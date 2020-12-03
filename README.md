🍐 Peargauge // Making virtual lectures interactive. 

### Demo link: https://peargauge-dev.herokuapp.com

In virtual lectures, it can be difficult for teachers to effectively gauge student understanding. 

Peargauge allows instructors to administer realtime questions during a lecture or recitation session. 

A few notable features
* Create, edit, download question decks (with LaTeX formatting)
* Quick to join sessions, students can join by scanning a QR code with their phone and answer questions anonymously.
* Instructors can have full control over the duration of each question, no more annoying time limits (you choose when to advance). 

### Creating Lecture Decks

![Alt text](src/res/readme/create_gif.gif?raw=true "Deck Creation Process")

### Instructor View (Starting Question-Answer session)

![Alt text](src/res/readme/start_demo_gif.gif?raw=true "Starting a session")

### Student View (Answering Questions). Scan to join
![Alt text](src/res/readme/phone_view_gif_2.gif?raw=true "Student Answering View")

### Homepage
* Start a session, create/edit lecture decks, join a session, or access settings. 
![Alt text](src/res/readme/homepage.png?raw=true "Homepage")

### Edit / Delete Decks
* View / edit / delete existing decks
![Alt text](src/res/readme/my_decks.png?raw=true "My Decks")

### Account Settings
* Download all your question decks (to store or migrate)
* Change password
* Delete account
![Alt text](src/res/readme/account_settings.png?raw=true "Account Settings")

### Login
![Alt text](src/res/readme/login.png?raw=true "Login")

### Building from source
If you would like to build Peargauge locally, you will need to set up Redis, and MongoDB. These can be done with the ```redis-server``` and ```mongo``` commands respectively. On localhost, I'm using a database called ```test``` and serving mongodb from port ```27017``` (```mongodb://localhost:27017/test```). Redis is being served from port ```6379``` on localhost. These values can easily be modified in server.py (lines 33-43) 

1. Clone this repository. 
2. Run ```npm install``` in the root directory
3. ```cd backend``` and create a python virtual environment ```python3 -m venv ./venv```
4. Activate the environment ```source activate venv``` and pip install the requirements.txt file ```pip install -r requirements.txt```
5. Create a ```.flaskenv``` file in backend and set appropriate values for the following environment variables:

```bash
export FLASK_APP=server.py
export FLASK_ENV=development
export APPLICATION_MODE=local
export MONGO_URI=<MongoDB URI> // not needed if only testing locally
```

5. Run the flask server with ```python server.py```
6. Run the front end with ```npm start```

### Photos, Illustrations, and Animations
- Logo / Animation on the login page was created by me with Adobe Illustrator. 
- Credits to Icons8 for the icons on the home page
- Flower photo on homepage by Katie Drazdauskaite from Unsplash

### Libraries Used:
- Socket.io : realtime student choice recording
- Flask (+ Flask-Cors, Flask-JWT): backend & securing of routes with jwt tokens
- Redis : to manage ephemeral server state & caching (socket rooms, session ids, answers, etc)
- React/Redux/Immer : front end + state management
- Mongo DB  : database
- Recharts : React driven charting library
- QR Code API : http://goqr.me/api/
- date-fns : lightweight date formatting library
- bcrypt : hash passwords
- react math jax : LaTeX rendering
- classnames : react conditional join classnames
- Framer / SVGR : used for animations

### Avenues of Potential Improvement
* Support multiple answer formats (number entry, text, audio, video)
* Allow instructors to upload media (pictures/videos) along with a question