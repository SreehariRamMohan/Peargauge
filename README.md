🍐 Peargauge // Making virtual lectures interactive. 

In virtual lectures, it can be difficult for teachers to effectively gauge student understanding. 

Peargauge allows educators to administer realtime quiz questions during a lecture to track student undertanding. 

Teachers create a "deck" of questions they want to use to track student understanding during a lecture, and have the option to pause periodically and have students answer the question on the screen. Teachers see the results in real time and can thus clarify concepts which are not being explained properly. In contrast to Kahoot, Peargauge allows educators to spread questions over the course of the lecture (as well as takes far less time for students to log on) 

Libraries:
- Socket.io (websockets) : realtime student choice recording
- Flask : backend
- Redis : to cache socket room id's as well as cumulative student answers during a session
- React/Redux/Immer : front end + state management
- Mongo DB  : database
- QR Code API : http://goqr.me/api/
