import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Radio } from '@material-ui/core';

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

    function handleCheck(event, type, letter) {
        let update = { ...questionData }
        update[type + ""] = letter
        setQuestionData(update)
        props.updateFunction(props.questionNumber, update)
    }
    
    function onChange(event, type) {
        //console.log(props.questionNumber,":",type, ":", event.target)
        let update = { ...questionData }
        update[type + ""] = event.target.value
        setQuestionData(update)
        props.updateFunction(props.questionNumber, update)
    }
    return (
        <React.Fragment>
            <div className={styles.card}>

                {/* <label for="question">What is the question?</label> */}
                <TextareaAutosize onChange={(e) => onChange(e, "question")} className={styles.question} rowsMin={2} placeholder="Question... text, latex, asciimath 🐳" />
                {/* <input onChange={(e) => onChange(e, "question")} name="question" placeholder="question"></input> */}
                {/* <FormControlLabel
                    control={<Checkbox icon={<CheckCircleIcon fontSize="large"/>} checkedIcon={<CheckCircleIcon fontSize="large"/>} name="checkedH" />}
                    label="Correct"
                /> */}

                <div className={styles.mContainer}>

                    <div className={styles.optionBox}>
                        <Checkbox onChange={(e) => handleCheck(e, "correct", "A")} checked={questionData["correct"] == "A"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                        <TextareaAutosize onChange={(e) => onChange(e, "A")} className={styles.option} placeholder="Option A 🎃" />
                    </div>

                    <div className={styles.optionBox}>
                        <Checkbox onChange={(e) => handleCheck(e, "correct", "B")} checked={questionData["correct"] == "B"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                        <TextareaAutosize onChange={(e) => onChange(e, "B")} className={styles.option} placeholder="Option B 🐶" />
                    </div>
                    {/* <input onChange={(e) => onChange(e, "A")} placeholder="Option A"></input> */}
                    {/* <input onChange={(e) => onChange(e, "B")} placeholder="Option B"></input> */}
                </div>
                <div className={styles.mContainer}>
                    {/* <input onChange={(e) => onChange(e, "C")} placeholder="Option C"></input>
                    <input onChange={(e) => onChange(e, "D")} placeholder="Option D"></input> */}
                    <div className={styles.optionBox}>
                        <Checkbox onChange={(e) => handleCheck(e, "correct", "C")} checked={questionData["correct"] == "C"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                        <TextareaAutosize onChange={(e) => onChange(e, "C")} className={styles.option} placeholder="Option C 🏗️" /></div>
                    <div className={styles.optionBox}>
                        <Checkbox onChange={(e) => handleCheck(e, "correct", "D")} checked={questionData["correct"] == "D"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                        <TextareaAutosize onChange={(e) => onChange(e, "D")} className={styles.option} placeholder="Option D 🍕" /></div>
                </div>

                {/* <label for="correct">Correct Answer</label>
                <select onChange={(e) => onChange(e, "correct")} name="correct" id="correctAnswer">
                    <option value="" disabled selected>Select one</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select> */}

            </div>
        </React.Fragment>
    )
}

export default withRouter(Question);

