import React, { useState, useEffect, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import styles from "./StartLecture.module.css"
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

//charting library
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

//question visualization
import QuestionViz from "./QuestionViz/QuestionViz"
import {URL, WEBSOCKET_URL, generate_join_url} from "../Redux/constants"

const axios = require("axios")

function StartLecture() {

    const [inputRoomId, setInputRoomId] = useState("")

    // can't let the teacher start the lecture before we have a socket connection ready to send information back and forth
    const [teacherSocketId, setTeacherSocketId] = useState("")

    const [lecturePending, setLecturePending] = useState(false)
    const socket = io(WEBSOCKET_URL);

    const [answerData, setAnswerData] = useState({ "A": 0, "B": 0, "C": 0, "D": 0 })

    const [deckTitles, setDeckTitles] = useState([])

    const [deckTitleSelected, setDeckTitleSelected] = useState("")

    //deck specific fields
    const [deckSelected, setDeckSelected] = useState({})

    //index of the question we're on
    const [qi, setQi] = useState(0)

    //chart data. A-D is mapped to index 0-3
    const data = [
        {
            name: 'A', responses: 0,
        },
        {
            name: 'B', responses: 0,
        },
        {
            name: 'C', responses: 0,
        },
        {
            name: 'D', responses: 0,
        },
    ];
    const [chartData, setChartData] = useState(data)


    useEffect(() => {
        console.log("API URL is", URL, "websocket URL is", WEBSOCKET_URL)
        console.log("the socket is", socket)
        socket.on("connect", function () {
            console.log("Connected: socket id is", socket.id)
            setTeacherSocketId(socket.id)

            // each teacher will join their own "unique" room so we can send back updates about student MC choices
            socket.emit("join", socket.id)
            console.log("Teacher joining unique room " + socket.id)
        })
        socket.on("updateGuess", function (stats) {
            console.log("receiving updated student stats:", stats)
            setAnswerData(stats)

            let order = ["A", "B", "C", "D"]
            let chartDataNew = [...chartData]
            for (var i = 0; i < order.length; i++) {
                chartDataNew[i].responses = stats[order[i]]
            }
            setChartData(chartDataNew)
            console.log(chartDataNew)
        })

        getDeckTitles()

        initializeRoomId()
    }, [])

    // use a react hook to load in the deck when a user selects one
    useEffect(() => {
        if (deckTitleSelected != "") {
            loadDeck()
        }
    }, [deckTitleSelected])

    //on changes to the question index, we need to emit a message to all clients to update their question. 
    useEffect(() => {
        if (deckTitleSelected != "") {
            let payload = {
                "question": {
                    ...deckSelected.questions[qi]
                },
                "roomid":inputRoomId
            }

            /*
            "question"
                A: "9"
                B: "4"
                C: "1"
                D: "1"
                correct: "B"
                question: "6-2"
            */
            
            axios.post(URL + "/updateQuestion", payload) 
                .then(function (response) {
                        console.log(response.body)
                })
        }
    }, [qi])


    function initializeRoomId() {
        const uuid = uuidv4()
        setInputRoomId(uuid)
    }

    function startLecture(event) {

        let payload = {
            "roomid": inputRoomId,
            "teacherSocketId": teacherSocketId,
            "question": {
                ...deckSelected.questions[qi]
            }
        }   

        axios.post(URL+'/startLecture', payload)
            .then(function (response) {
                //reset the room id
                setLecturePending(true)
            })

        console.log("started lecture")
    }

    function onClick(e, type){
        if (type == "forward") {
            setQi(Math.min(qi + 1, deckSelected.questions.length-1))
        }
        else if (type == "backward") {
            setQi(Math.max(qi - 1, 0))
        }

    }

    function getDeckTitles() {
        axios.get(URL+"/getDeckNames")
            .then(res => {
                return res.data
            })
            .then(data => {
                setDeckTitles(data.titles)
            })
    }

    function onChange(event, type) {
        if (type == "room") {
            setInputRoomId(event.target.value)
        } else if (type == "deck") {
            setDeckTitleSelected(event.target.value)
        }
    }

    function loadDeck() {
        // fetch the deckSelected from MongoDB
        let payload = {
            "title": deckTitleSelected
        }
        axios.post(URL+"/getDeck", payload)
            .then(res => {
                return res.data
            })
            .then(data => {
                setDeckSelected(JSON.parse(data["deck"]))
            })
    }

    const questionVizView = (
        <React.Fragment>
            <QuestionViz qi={qi} title={deckSelected["title"]} questions={deckSelected["questions"]} />
            <div>
                <button onClick={(e) => onClick(e, "forward")}>forward</button>
                <button onClick={(e) => onClick(e, "backward")}>backward</button>
            </div>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>

                <label for="deck">Current Decks</label>
                <select name="deck" onChange={(e) => onChange(e, "deck")}>
                    <option value="" disabled selected>Select one</option>
                    {
                        deckTitles.map((value, index, arr) => {
                            return <option key={index}>{value}</option>

                        })
                    }
                </select>



                {Object.keys(deckSelected).length > 0 ? questionVizView : <p>Select a deck to get started</p>}


                {/* while the socket connection is being established prevent the user from submitting */}
                <button disabled={teacherSocketId == ""} className={styles.button} onClick={startLecture}>Start lecture button</button>

                <input disabled={true} placeholder="room id" value={inputRoomId} onChange={(e) => onChange(e, "room")}></input>
                
                {inputRoomId != "" && <div><p>Have participants scan this QR code with their phone to get started</p><img src={"https://api.qrserver.com/v1/create-qr-code/?data=" + generate_join_url(inputRoomId) +"&amp;size=100x100"} /></div>}

                <p>Question Statistics</p>

                <div className={styles.stats}>
                    <p className={styles.letter}>A: {answerData["A"]}</p>
                    <p className={styles.letter}>B: {answerData["B"]}</p>
                    <p className={styles.letter}>C: {answerData["C"]}</p>
                    <p className={styles.letter}>D: {answerData["D"]}</p>
                </div>

                <BarChart width={730} height={250} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />

                    <Bar dataKey="responses" fill="#95bc3e" />
                </BarChart>
            </div>
        </React.Fragment>
    )
}

export default withRouter(StartLecture);

