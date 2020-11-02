🍐 Peargauge // Making virtual lectures interactive. 

In virtual lectures, it can be difficult for teachers to effectively gauge student understanding. 

Peargauge allows educators to administer realtime quiz questions during a lecture to track student undertanding. 

Teachers create a "deck" of questions they want to use to track student understanding during a lecture, and have the option to pause periodically and have students answer the question on the screen. Teachers see the results in real time and can thus clarify concepts which are not being explained properly. In contrast to Kahoot, Peargauge allows educators to spread questions over the course of the lecture (as well as takes far less time for students to log on) 

Libraries:
- Socket.io : realtime student choice recording
- Flask (+ Flask-Cors, Flask-JWT): backend
- Redis : to manage ephemeral server state & caching (socket rooms, session ids, quiz answers, etc)
- React/Redux/Immer : front end + state management
- Mongo DB  : database
- Recharts : React driven charting library
- QR Code API : http://goqr.me/api/
- date-fns : lightweight date formatting library
- bcrypt : hash passwords

Photo/Media Credits
- Credits to Icons8 for a few of the icons on the home page
- Flower photo on homepage by Katie Drazdauskaite from Unsplash

Deployed on Heroku

Run backend with python server.py (not flask run because flask-socketio requires you to run the server with python server.py)
