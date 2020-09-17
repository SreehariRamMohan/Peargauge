import React, { useState, useEffect, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import styles from "./StartLecture.module.css"
import io from 'socket.io-client'

//charting library
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const axios = require("axios")

function StartLecture() {

    const [inputRoomId, setInputRoomId] = useState("")

    // can't let the teacher start the lecture before we have a socket connection ready to send information back and forth
    const [teacherSocketId, setTeacherSocketId] = useState("")

    const [lecturePending, setLecturePending] = useState(false)
    const socket = io('ws://localhost:5000');
    
    const [answerData, setAnswerData] = useState({ "A": 0, "B": 0, "C": 0, "D": 0 })

    const [deckTitles, setDeckTitles] = useState([])
    

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
        console.log("the socket is", socket)
        socket.on("connect", function () {
            console.log("Connected: socket id is", socket.id)
            setTeacherSocketId(socket.id)

            // each teacher will join their own "unique" room so we can send back updates about student MC choices
            socket.emit("join", socket.id)
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
    }, [])


    function onInputChange(event) {
        setInputRoomId(event.target.value)
    }

    function startLecture(event) {

        let payload = {
            "roomid": inputRoomId,
            "teacherSocketId": teacherSocketId
        }

        axios.post('/startLecture', payload)
            .then(function (response) {
                //reset the room id
                setLecturePending(true)
            })

        console.log("started lecture")
    }

    function getDeckTitles() {
        axios.get("/getDeckNames")
        .then(res => {
            return res.data
        })
        .then(data => {
            setDeckTitles(data.titles)
        })
    }


    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <p>Start Lecture</p>

                <h5>Choose deck</h5>

                <label for="deck">Current Decks</label>
                <select name="deck">
                    <option value="" disabled selected>Select one</option>
                    {
                        deckTitles.map((value, index, arr) => {
                            return <option key={index}>{value}</option>
                            
                        })
                    }
                </select>


                {/* while the socket connection is being established prevent the user from submitting */}
                <button disabled={teacherSocketId == ""} className={styles.button} onClick={startLecture}>Start lecture button</button>

                <input disabled={lecturePending} placeholder="room id" value={inputRoomId} onChange={onInputChange}></input>
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

