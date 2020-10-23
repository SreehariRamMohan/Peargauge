import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import { useParams } from "react-router-dom";
import Navbar from "../CustomNavbar/CustomNavbar"
import Badge from 'react-bootstrap/Badge'

import styles from "./SamplePage.module.css"

import io from 'socket.io-client'

//question visualization
import QuestionViz from "../StartLecture/QuestionViz/QuestionViz"
import { WEBSOCKET_URL } from "../Redux/constants";

function mapStateToProps(state) {
    return {
        sampleData: state.sampleData,
    };
}

function SamplePage() {

    let { id } = useParams();

    const [disabled, setDisabled] = useState(false)

    const [currentQuestion, setCurrentQuestion] = useState({})

    const socket = io(WEBSOCKET_URL);

    //use Effect will only run once, because there is nothing in the array that will change.
    useEffect(() => {

        socket.on("connect", function () {
            console.log("socket connection made -->")
            socket.emit("join", id)
            console.log("Client joining the room", id)
        })

        socket.on("updateQuestion", function (question) {
            console.log("Question received", question)
            setCurrentQuestion(question)
        })

        socket.on("initQuestion", function (question) {
            console.log("here in init question question received is", question, "current question", currentQuestion)
            if (Object.keys(currentQuestion).length == 0) {
                setCurrentQuestion(question)
                console.log("initializing first question with", question)
            }
        })

    }, [])

    function handleMC(letter) {
        let guessObject = {
            "roomid": id,
            "letter": letter
        }
        socket.emit("guess", guessObject)
        setDisabled(true) // prevent multiple guesses
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.container}>
    
                <div className={styles.badgeContainer}>
                    <Badge variant="success">
                        {"room " + id}
                    </Badge>
                </div>

                <QuestionViz client={true} qi={0} title={"Sample Question"} questions={[currentQuestion]} />

                <div className={styles.mContainer}>
                    <button disabled={disabled} onClick={() => handleMC("A")} className={styles.button}>A</button>
                    <button disabled={disabled} onClick={() => handleMC("B")} className={styles.button}>B</button>
                </div>
                <div className={styles.mContainer}>
                    <button disabled={disabled} onClick={() => handleMC("C")} className={styles.button}>C</button>
                    <button disabled={disabled} onClick={() => handleMC("D")} className={styles.button}>D</button>
                </div>
            </div>


        </React.Fragment>
    )
}

export default withRouter(connect(mapStateToProps, null)(SamplePage));

