import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"

import styles from "./StartLecture.module.css"

function StartLecture() {

    const [answerData, setAnswerData] = useState({ "A": 0, "B": 0, "C": 0, "D": 0 })

    useEffect(() => {

    }, [])



    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={styles.container}>
                <p>Start Lecture</p>

                <button className={styles.button}>Start lecture button</button>

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

