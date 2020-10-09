import time
import json
from flask import Flask, jsonify
from flask_pymongo import PyMongo, pymongo
from flask import request
from bson.objectid import ObjectId
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import redis
from flask_bcrypt import Bcrypt
from jwt_auth.User import authenticate, identity
from flask_jwt import JWT, jwt_required, current_identity

app = Flask(__name__)

# jwt 
app.config['SECRET_KEY'] = 'super-secret'
jwt = JWT(app, authenticate, identity)

bcrypt = Bcrypt(app)

# connect to redis cache
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
print("return all documents in the sample collection",mongo.db.sample.find_one())

#Optional Socket.IO compatibility added as a template
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# method called when a client requests to join a certain teacher's interactive lecture session
# client will send the room uid in the key "roomid"
@socketio.on("join")
def on_join(roomid):
    print(f"Adding client to room {roomid} on server side")
    #print(request.sid)
    join_room(roomid)

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
    else:
        guesses = json.loads(r.get(roomid))
        guesses[letter] += 1
        r.set(roomid, json.dumps(guesses))
    
    # update the teacher with the latest student guesses by sending her the latest dict via her socket


    emit("updateGuess", json.loads(r.get(roomid)), room=r.get(f"{roomid}:teacher").decode("utf-8"))

    # print("request object is", request)
    print(f"** client {request.sid} guessed {guess}")




@socketio.on("connect")
def handle_new_connection():
    print(f"a user has connected to the socket with sid {request.sid}")


@app.route("/createDeck", methods=["POST"])
def create_deck():
    title = request.json["title"]
    deck = {
        "title": title,
        "questions": request.json["questions"]
    }
    mongo.db.sets.insert_one(deck)
    return jsonify({"status": "success"})

@app.route("/startLecture", methods=['POST'])
def start_lecture():
    roomid = request.json["roomid"]
    teacherSocketId = request.json["teacherSocketId"]
    r.set(f"{roomid}:teacher", str(teacherSocketId))

    r.set(f"{roomid}:question", json.dumps(request.json["question"]))

    return jsonify({"status": "success"})

@app.route("/updateQuestion", methods=["POST"])
def update_question():
    roomid = request.json["roomid"]
    question = request.json["question"]
    socketio.emit("updateQuestion", question, room=roomid)

@app.route("/getDeckNames", methods=['GET'])
def get_deck_name():
    decks = mongo.db.sets.find({})
    print(decks)
    titles = []
    for deck in decks:
        print(deck)
        titles.append(deck["title"])

    return jsonify({"titles": titles})

@app.route("/getDeck", methods=['POST'])
def get_deck():
    deck = mongo.db.sets.find_one({"title": request.json["title"]})
    print("deck found on the backend is", deck)
    # ObjectId is not by default serializable to json
    return jsonify({"deck": json.dumps(deck, default=str)})

@app.route("/createUser", methods=["POST"])
def create_user():
    username = request.json["username"]
    password = request.json["password"]
    pw_hash = bcrypt.generate_password_hash(password)

    user = {
        "username": username,
        "password": pw_hash
    }
    try:
        mongo.db.users.insert_one(user)
    except pymongo.errors.DuplicateKeyError: 
        return {'status': "failure, duplicate username exists"}
    return {'status': "success"}

@app.route("/loginUser", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    password_hash = mongo.db.users.find_one({"username": username})["password"]

    if bcrypt.check_password_hash(password_hash, password):
        return {'status': "success"}
    else:
        return {'status': "incorrect username or password"}

    
@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# to access data sent in the request body, use the form attribute. 
# request.form["username"] accesses the "username" key in the request body
@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = mongo.db.sample.find_one({"_id": ObjectId(id)})
    print(user)
    return json.dumps(user, default=str)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity


if __name__ == '__main__':
    socketio.run(app)