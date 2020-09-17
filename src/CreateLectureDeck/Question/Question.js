import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"

import styles from "./Question.module.css"

function Question(props) {

    let initalQuestionData = {
        "question": "",
        "A": "",
        "B": "",
        "C": "",
        "D": "",
        "correct": ""
    }

    const [questionData, setQuestionData] = useState(initalQuestionData)

    function onChange(event, type) {
        // console.log(props.questionNumber,":",type, ":", event.target.value)

        let update = {...questionData}
        update[type+""] = event.target.value
        setQuestionData(update)
        props.updateFunction(props.questionNumber, update)
    }
    return (
        <React.Fragment>
            <div className={styles.card}>

                <label for="question">What is the question?</label>
                <input onChange={(e) => onChange(e, "question")} name="question" placeholder="question"></input>

                <div className={styles.mContainer}>
                    <input onChange={(e) => onChange(e, "A")} placeholder="Option A"></input>
                    <input onChange={(e) => onChange(e, "B")} placeholder="Option B"></input>
                </div>
                <div className={styles.mContainer}>
                    <input onChange={(e) => onChange(e, "C")} placeholder="Option C"></input>
                    <input onChange={(e) => onChange(e, "D")} placeholder="Option D"></input>
                </div>

                <label for="correct">Correct Answer</label>
                <select onChange={(e) => onChange(e, "correct")} name="correct" id="correctAnswer">
                    <option value="" disabled selected>Select one</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>

            </div>
        </React.Fragment>
    )
}

export default withRouter(Question);

