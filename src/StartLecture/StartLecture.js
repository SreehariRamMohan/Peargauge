import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import styles from "./StartLecture.module.css"
import io from 'socket.io-client'

const socket = io('ws://localhost:5000');
const axios = require("axios")

function StartLecture() {

    const [answerData, setAnswerData] = useState({ "A": 0, "B": 0, "C": 0, "D": 0 })
    const [inputRoomId, setInputRoomId] = useState("")
    
    // can't let the teacher start the lecture before we have a socket connection ready to send information back and forth
    const [teacherSocketId, setTeacherSocketId] = useState("")

    const [lecturePending, setLecturePending] = useState(false)

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
        })
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



    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <p>Start Lecture</p>

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
            </div>
        </React.Fragment>
    )
}

export default withRouter(StartLecture);

