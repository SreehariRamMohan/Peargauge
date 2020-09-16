import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import Question from "./Question/Question"

import styles from "./CreateLectureDeck.module.css"

function CreateLectureDeck() {
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
        console.log("New question content", newState)
    }
    
    function saveQuestions() {
        console.log("Question content", questionContent)
    }

    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <p>Create Deck</p>

                <div className={styles.lectureTitleBox}>
                    <p>Lecture Title</p>
                    <input placeholder="title"></input>
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

