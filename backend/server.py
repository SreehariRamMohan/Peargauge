import time
import json
from flask import Flask, jsonify
from flask_pymongo import PyMongo, pymongo
from pymongo.collection import ReturnDocument
from flask import request, Flask, send_from_directory
from bson.objectid import ObjectId
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import redis
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, jwt_refresh_token_required
from flask_cors import CORS, cross_origin
import os
from os import environ

app = Flask(__name__, static_folder='build')

origin = "http://localhost:3000"
if "PROD" in os.environ:
    origin = "https://peargauge-dev.herokuapp.com"

print("Origin is", origin)

CORS(app, resources={r"*": {"origins": origin, "supports_credentials": True}})

# jwt 
app.config['SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

# connect to redis cache
if "PROD" in os.environ:
    # connect to redis store on heroku
    r = redis.from_url(os.environ['REDIS_URL'])
    app.config["MONGO_URI"] = os.environ['MONGO_URI']
    mongo = PyMongo(app)
else:
    # local development
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.flushdb()
    # connect to the MongoDB server running on port 27017 (localhost)
    # the database we're connecting to is called myDatabase (exposed as db)
    # "db" is a reference to the database which can be referenced in routes/views
    # example: mongo.db.users.find()
    app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
    mongo = PyMongo(app)

mongo.db.users.create_index([('username', pymongo.DESCENDING)], unique=True)

# to verify mongodb is working locally, try querying documents from a sample collection within a database
# print("return all documents in the sample collection",mongo.db.sample.find_one())

#Optional Socket.IO compatibility added as a template
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# method called when a client requests to join a certain teacher's interactive lecture session
# client will send the room uid in the key "roomid"
@socketio.on("join")
def on_join(roomid):
    # print(f"Adding client to room {roomid} on server side")
    #print(request.sid)
    join_room(roomid)
    # print(r.exists(f"{roomid}:current_question"))
    if (r.exists(f"{roomid}:current_question")):
        emit("initQuestion", json.loads(r.get(f"{roomid}:current_question")))
        # print("sending initial question to client who just joined")

"""
guess object:
    letter: a letter A - D
    roomid: string
"""
@socketio.on("guess")
def on_guess(guess):
    letter = guess["letter"]
    roomid = guess["roomid"]
    
    current_answers = r.get(roomid)

    if(current_answers == None):
        init_guess = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        }
        init_guess[letter] += 1
        r.set(roomid, json.dumps(init_guess))
        # print(f"in guess: printing the value of r.get(roomid) {json.loads(r.get(roomid))}")
    else:
        guesses = json.loads(r.get(roomid))
        guesses[letter] += 1
        r.set(roomid, json.dumps(guesses))
    
    # update the teacher with the latest student guesses by sending her the latest dict via her socket
    teacher_room_id = r.get(f"{roomid}:teacher").decode("utf-8")
    # print(f"trying to updateGuess to teacher's room {teacher_room_id}")
    emit("updateGuess", json.loads(r.get(roomid)), room=r.get(f"{roomid}:teacher").decode("utf-8"))

    # print("request object is", request)
    # print(f"** client {request.sid} guessed {guess}")

@socketio.on("connect")
def handle_new_connection():
    print(f"a user has connected to the socket with sid {request.sid}")


# serve the static react build files from flask. 
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/createDeck", methods=["POST"])
@jwt_required
def create_deck():
    title = request.json["title"]

    mongo_user_id = request.json["mongo_id"]
    deck_id = request.json["deck_id"]

    deck = {
        "_id": deck_id,
        "title": title,
        "questions": request.json["questions"]
    }

    returned_document = mongo.db.users.find_one_and_update(
                            filter={"_id": ObjectId(mongo_user_id)},
                            update={"$addToSet": {"decks": deck_id}},
                            upsert=False,
                            return_document=ReturnDocument.AFTER
                        )

    # handle the case where we are editing an existing deck
    user = mongo.db.users.find_one({"_id": ObjectId(mongo_user_id)})
    user_decks = user["decks"]
    doc = mongo.db.sets.find_one_and_replace(filter={"_id": deck_id}, replacement=deck, return_document=ReturnDocument.AFTER, upsert=True)
    print("modified the document here it is after the update", doc)
    # if deck_id in user_decks:
    #     # we're editing an existing deck
        
    # else:
    #     mongo.db.sets.insert_one(deck)
    return jsonify({"status": "success"})

@app.route("/api/startLecture", methods=['POST'])
@jwt_required
def start_lecture():
    roomid = request.json["roomid"]
    teacherSocketId = request.json["teacherSocketId"]
    r.set(f"{roomid}:teacher", str(teacherSocketId))

    r.set(f"{roomid}:current_question", json.dumps(request.json["question"])) # we need this in our key-store to handle users to get the 
    # initial (first) question when the session just starts (because they will have missed the updateQuestion being emitted.)

    return jsonify({"status": "success"})

@app.route("/api/updateQuestion", methods=["POST"])
@jwt_required
def update_question():
    roomid = request.json["roomid"]
    question = request.json["question"]
    socketio.emit("updateQuestion", question, room=roomid)

    # once we update the question, let's reset the multiple choice frequency responses
    reset_guess = {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0
    }
    r.set(roomid, json.dumps(reset_guess))

    return jsonify({"status": "success"})

@app.route("/api/getDeckNames", methods=['POST'])
@jwt_required
def get_deck_name():
    mongo_id = request.json["mongo_id"]
    user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})
    user_decks = user["decks"]
        
    user_deck_names = []
    user_deck_uids = []
    
    for deck_uid in user_decks:
        deck = mongo.db.sets.find_one({"_id": deck_uid})
        if not deck == None:
            user_deck_names.append(deck["title"])
            user_deck_uids.append(deck_uid)

    return jsonify({"titles": user_deck_names, "uids": user_deck_uids})

# TODO: merge getDeck2 into getDeck. Leaving original to prevent website breaking while testing. 
@app.route("/api/getDeck", methods=['POST'])
@jwt_required
def get_deck():
    deck = mongo.db.sets.find_one({"title": request.json["title"]})
    # print("deck found on the backend is", deck)
    # ObjectId is not by default serializable to json
    return jsonify({"deck": json.dumps(deck, default=str)})

@app.route("/api/getDeck2", methods=['POST'])
@jwt_required
def get_deck2():
    mongo_id = request.json["mongo_id"]
    deck_id_to_find = request.json["deck_id"]

    user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})
    user_decks = user["decks"]

    # TODO: Properly handle errors using a class https://flask.palletsprojects.com/en/1.1.x/patterns/apierrors/

    # verify that the requested deck id is a deck the mongo user created
    if not deck_id_to_find in user_decks:
        return jsonify({"status": "Failure, user does not own the deck requested"})
    else:
        deck = mongo.db.sets.find_one({"_id": deck_id_to_find})
        return jsonify({"status": "success", "deck": deck})

@app.route("/api/deleteDeck", methods=['POST'])
@jwt_required
def delete_deck():
    mongo_id = request.json["mongo_id"]
    deck_id_to_find = request.json["deck_id"]

    user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})
    user_decks = user["decks"]

    # verify that the requested deck id is a deck the mongo user created
    if not deck_id_to_find in user_decks:
        return jsonify({"status": "Failure, user does not own the deck requested to be deleted"})
    else:
        deck = mongo.db.sets.find_one_and_delete({"_id": deck_id_to_find})
        return jsonify({"status": "success", "deck_deleted": deck})


# verify the validity of a jwt token
@app.route("/api/verify", methods=['POST'])
@jwt_required
def verify():
    current_user = get_jwt_identity()
    # print("current user is", current_user)

    if current_user:
        return jsonify({"status": "valid"}), 200
    else:
        return jsonify({"status": "invalid"}), 401 

@app.route("/api/createUser", methods=["POST"])
def create_user():
    username = request.json["username"]
    password = request.json["password"]
    pw_hash = bcrypt.generate_password_hash(password)

    user = {
        "username": username,
        "password": pw_hash
    }
    try:
        mongo_id = mongo.db.users.insert_one(user).inserted_id
        ret = {
            'access_token': create_access_token(identity=username, expires_delta=False),
            'refresh_token': create_refresh_token(identity=username),
            'mongo_id': mongo_id
        }
        return json.dumps(ret, default=str), 200
    except pymongo.errors.DuplicateKeyError: 
        return {'status': "failure, duplicate username exists"}

@app.route("/api/loginUser", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    mongo_user = mongo.db.users.find_one({"username": username})
    password_hash = mongo_user["password"]
    mongo_id = mongo_user["_id"]

    if bcrypt.check_password_hash(password_hash, password):
        ret = {
            'access_token': create_access_token(identity=username, expires_delta=False),
            'refresh_token': create_refresh_token(identity=username),
            'mongo_id': mongo_id
        }
        return json.dumps(ret, default=str), 200
    else:
        return {'status': "incorrect username or password"}, 404

@app.route("/api/downloadDecks", methods=["POST"])
@jwt_required
def downloadDecks():
    print("in download deck route")
    mongo_id = request.json["mongo_id"]

    mongo_user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})
    ret = []
    print(mongo_user)
    if "decks" in mongo_user:
        for deck_id in mongo_user["decks"]:
            deck = mongo.db.sets.find_one({"_id": deck_id})
            if not deck == None:
                del deck["_id"]
                ret.append(deck)
    return {"status": "success", "decks": ret}

@app.route("/api/settings/changePassword", methods=["POST"])
@jwt_required
def changePassword():
    mongo_id = request.json["mongo_id"]
    password = request.json["password"]
    new_password = request.json["new_password"]

    mongo_user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})

    if bcrypt.check_password_hash(mongo_user["password"], password):
        new_pw_hash = bcrypt.generate_password_hash(new_password)
        mongo.db.users.update_one(filter={"_id": ObjectId(mongo_id)}, update={'$set': {'password': new_pw_hash}})
        return {'status': "success"}, 200
    else:
        return {'status': "incorrect password supplied"}, 404

@app.route("/api/settings/deleteAccount", methods=["POST"])
@jwt_required
def deleteAccount():
    mongo_id = request.json["mongo_id"]

    mongo_user = mongo.db.users.find_one({"_id": ObjectId(mongo_id)})

    # delete all user decks
    if "decks" in mongo_user:
        for deck in mongo_user["decks"]:
            mongo.db.sets.delete_one(filter={"_id": deck})
    
    mongo.db.users.delete_one(filter={"_id": ObjectId(mongo_id)})

    return jsonify({"status": "success"}), 200

# Route to create a new access token (not fresh) given a refresh token. 
@app.route('/api/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    # mark the refresh token as not fresh since we don't verify the password authenticity in this step
    ret = {
        'access_token': create_access_token(identity=current_user, fresh=False)
    }
    return jsonify(ret), 200

    
@app.route('/api/time', methods=['GET'])
def get_current_time():
    return {'time': time.time()}

# to access data sent in the request body, use the form attribute. 
# request.form["username"] accesses the "username" key in the request body
@app.route('/api/user/<id>', methods=['GET'])
def get_user(id):
    user = mongo.db.sample.find_one({"_id": ObjectId(id)})
    # print(user)
    return json.dumps(user, default=str)


# Protect a view with jwt_required, which requires a valid access token
# in the request to access.
@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    socketio.run(app)