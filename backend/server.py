import time
import json
from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask import request
from bson.objectid import ObjectId
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import redis

app = Flask(__name__)

# connect to redis cache
r = redis.Redis(host='localhost', port=6379, db=0)

# connect to the MongoDB server running on port 27017 (localhost)
# the database we're connecting to is called myDatabase (exposed as db)
# "db" is a reference to the database which can be referenced in routes/views
# example: mongo.db.users.find()
app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
mongo = PyMongo(app)

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

    print("request object is", request)
    print(f"client {request.sid} guessed {guess}")




@socketio.on("connect")
def handle_new_connection():
    print(f"a user has connected to the socket with sid {request.sid}")


@app.route("/startLecture", methods=['POST'])
def start_lecture():
    roomid = request.json["roomid"]
    teacherSocketId = request.json["teacherSocketId"]
    r.set(f"{roomid}:teacher", str(teacherSocketId))
    return jsonify({"status": "success"})

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

if __name__ == '__main__':
    socketio.run(app)