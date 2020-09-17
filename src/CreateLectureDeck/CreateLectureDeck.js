import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import Question from "./Question/Question"

import styles from "./CreateLectureDeck.module.css"

const axios = require("axios")

function CreateLectureDeck() {
    const[title, setTitle] = useState("")
    const [numQuestions, setNumQuestions] = useState(0)
    const [questionContent, setQuestionContent] = useState({})

    /** questionContent structure
     * {
     * "1": {
     *      question: ""
     *      "A": ""
     *      "B": ""
     *      "C": ""
     *      "D": ""
     *      correct: ""
     *      }
     *      ....
     * 
     * "2": {
     * .... .....
     * }
     * }
     */

    function addQuestion() {
        let newState = { ...questionContent }
        newState["" + numQuestions + 1] = {}
        setNumQuestions(numQuestions + 1)
    }

    function questionUpdate(questionNumber, update) {
        let newState = { ...questionContent }
        newState["" + questionNumber] = { ...newState["" + questionNumber], ...update }
        setQuestionContent(newState)
    }
    
    function saveQuestions() {
        //convert the dictionary like structure in questionContent to a list
        let questions = []
        for (var i = 0; i < numQuestions; i++) {
            questions.push(questionContent[i+1+""])
        }

        let payload = {
            "title": title,
            "questions": questions
        }

        axios.post("/createDeck", payload)
            .then(res => {return res.data})
            .then(data => {
                // console.log(data)
            })
        



    }

    function titleChange(e) {
        setTitle(e.target.value)
    }

    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <p>Create Deck</p>

                <div className={styles.lectureTitleBox}>
                    <p>Lecture Title</p>
                    <input placeholder="title" onChange={titleChange}></input>
                </div>

                {
                    Array.from(Array(numQuestions)).map((value, index, arr) => {
                        return <Question questionNumber={index + 1} updateFunction={questionUpdate} />
                    })
                }

                <div className={styles.bottomButtonBox} >
                    <button onClick={addQuestion}>Add more questions</button>
                    <button onClick={saveQuestions}>Save</button>
                </div>


            </div>


        </React.Fragment>
    )
}

export default withRouter(CreateLectureDeck);

