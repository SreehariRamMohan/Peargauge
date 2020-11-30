import React, { useState, useEffect, PureComponent } from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import styles from "./StartLecture.module.css"
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import Badge from 'react-bootstrap/Badge'

//charting library
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

//question visualization
import QuestionViz from "./QuestionViz/QuestionViz"
import Accordion from 'react-bootstrap/Accordion'
import { Card, Button } from "react-bootstrap"

import { URL, WEBSOCKET_URL, generate_join_url } from "../Redux/constants"
import CardToggle from "./CardToggle/CardToggle";

const axios = require("axios")

/*

format of each individual question (this is a latex formatted question)

A: "\lambda^{1}"
B: "\lambda^{2}"
C: "\int_0^{\infty} \lambda e^{\frac{x}{\lambda}} dx"
D: "\text{not convergent ??}"
correct: ""
format: "latex"
question: "\text{find } \mathbb{E}(x) \text{ where X is a Poisson random variable } P\left( x \right) = \frac{{e^{ - \lambda } \lam

*/

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

    const data = {
        0: {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        }
    }

    const [responseData, setResponseData] = useState(data)

    const mongo_id = useSelector((state) => state.mongo_id)

    //chart data. A-D is mapped to index 0-3
    const initialChartDataForQuestion = [
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


    const [formattedChartData, setFormattedChartData] = useState(initialChartDataForQuestion)

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

            // let chartDataNew = [...responseData]
            // for (var i = 0; i < order.length; i++) {
            //     chartDataNew[i].responses = stats[order[i]]
            // }

            let update = { ...responseData }

            //case where we are going to a question for the first time
            update[qi] = stats

            setResponseData(update)

            reformatDataForChart(update)
            // console.log(chartDataNew)
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
            updateQuestion()
        }
    }, [qi])


    // start the "lecture" (session) using the selected deck.
    // note, I expect the instructor may want to switch decks (even after making a selection), but this is just 
    // more convenient than needing them to press "start lecture" each time. 
    // starting a lecture is cheap, can just as well create multiple rooms on the backend (whenever they switch deck)
    // redis keys will expire in a set time anyway. 
    useEffect(() => {
        if (Object.keys(deckSelected).length > 0) {
            updateQuestion()
            startLecture()

        }
    }, [deckSelected])

    /*
    The chart library I am using requires the data in the following format for the current question to display
    [
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
    ]

    Our data is in the following format:
    // {
    //     0: { <-- where 0 is the qi (current question)
    //         "A": 0,
    //         "B": 0,
    //         "C": 0,
    //         "D": 0
    //     }
    // }
    */
    function reformatDataForChart(data) {
        let formattedData = []

        let order = ["A", "B", "C", "D"]
        for (var i = 0; i < order.length; i++) {
            const letterObject = {
                "name": order[i],
                "responses": data[qi][order[i]]
            }
            formattedData.push(letterObject)
        }
        setFormattedChartData(formattedData)

    }

    function updateQuestion() {
        let payload = {
            "question": {
                ...deckSelected.questions[qi]
            },
            "roomid": inputRoomId
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
        console.log("trying to start lecture")

        //update current question in Redis, so if users join the session later, they are served with the current question.
        axios.post(URL + "/updateQuestion", payload)
            .then(function (response) {

            })
    }

    function initializeRoomId() {
        const uuid = uuidv4()
        setInputRoomId(uuid)
    }

    function startLecture() {

        console.log("Start lecture called.")

        let payload = {
            "roomid": inputRoomId,
            "teacherSocketId": teacherSocketId,
            "question": {
                ...deckSelected.questions[qi]
            }
        }

        axios.post(URL + '/startLecture', payload)
            .then(function (response) {
                //reset the room id
                setLecturePending(true)
            })

        console.log("started lecture")
    }

    function onClick(e, type) {
        if (type == "forward") {
            setQi(Math.min(qi + 1, deckSelected.questions.length - 1))

            //reset the graph chart data with either new data or previous data 
            let index = Math.min(qi + 1, deckSelected.questions.length - 1)
            if ((index) in responseData) {
                setFormattedChartData(responseData[index])
            } else {
                setFormattedChartData(initialChartDataForQuestion)
            }

        }
        else if (type == "backward") {
            setQi(Math.max(qi - 1, 0))

            //reset the graph chart data with either new data or previous data 
            let index = Math.max(qi - 1, 0)
            if ((index) in responseData) {
                setFormattedChartData(responseData[index])
            } else {
                setFormattedChartData(initialChartDataForQuestion)
            }
        }




    }

    function getDeckTitles() {
        axios.post(URL + "/getDeckNames", { "mongo_id": mongo_id })
            .then(res => {
                return res.data
            })
            .then(data => {
                console.log("received deck names", data)
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

        axios.post(URL + "/getDeck", payload)
            .then(res => {
                return res.data
            })
            .then(data => {
                setDeckSelected(JSON.parse(data["deck"]))
                console.log("Load deck finished, the deck we loaded was:", JSON.parse(data["deck"]))
            })
    }

    const questionVizView = (demo) => {
        return (
            <React.Fragment>
                <QuestionViz client={false} demo={demo} forward={onClick} backward={onClick} qi={qi} title={deckSelected["title"]} questions={deckSelected["questions"]} />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <div className={styles.badgeContainer}>
                    {/* <label for="deck">Current Decks</label> */}
                    <select className={styles.selectBox} name="deck" onChange={(e) => onChange(e, "deck")}>
                        <option value="" disabled selected>Choose Deck 🗂️</option>
                        {
                            deckTitles.map((value, index, arr) => {
                                return <option key={index}>{value}</option>

                            })
                        }
                    </select>

                    <Badge variant="success">
                        {"room " + inputRoomId}
                    </Badge>

                </div>


                {Object.keys(deckSelected).length > 0 ? questionVizView(false) : questionVizView(true)}



                {inputRoomId != "" && <div>
                    <p>Scan QR code to get started</p><img src={"https://api.qrserver.com/v1/create-qr-code/?data=" + generate_join_url(inputRoomId) + "&amp;size=200x200"} />
                    <p>(or visit this <a href={generate_join_url(inputRoomId)}>url</a>)</p>
                </div>}

                <Accordion className={styles.accordion} defaultActiveKey="0">
                    <Card>
                        <Card.Header>
                            <CardToggle eventKey="0"></CardToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body className={styles.cardBody}>
                                <div className={styles.stats}>
                                    <p className={styles.letter}>A: {answerData["A"]}</p>
                                    <p className={styles.letter}>B: {answerData["B"]}</p>
                                    <p className={styles.letter}>C: {answerData["C"]}</p>
                                    <p className={styles.letter}>D: {answerData["D"]}</p>
                                </div>

                                <BarChart className={styles.barChart} width={500} height={250} data={formattedChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />

                                    <Bar dataKey="responses" fill="#95bc3e" />
                                </BarChart>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>



            </div>
        </React.Fragment>
    )
}

export default withRouter(StartLecture);

