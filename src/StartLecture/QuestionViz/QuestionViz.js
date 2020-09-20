import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"

import styles from "./QuestionViz.module.css"

function QuestionViz(props) {

    //index of the question we're on
    const [qi, setQi] = useState(0)

    function onClick(e, type){
        if (type == "forward") {
            setQi(qi + 1)
        }
        else if (type == "backward") {
            setQi(Math.max(qi - 1, 0))
        }

    }

    return (
        <React.Fragment>
            <div className={styles.card}>
                <p>{props.title}</p>

                <p>{props.questions[qi].question}</p>
                <p>A: {props.questions[qi].A}</p>
                <p>B: {props.questions[qi].B}</p>
                <p>C: {props.questions[qi].C}</p>
                <p>D: {props.questions[qi].D}</p>

                <div>
                    <button onClick={(e) => onClick(e, "forward")}>forward</button>
                    <button onClick={(e) => onClick(e, "backward")}>backward</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(QuestionViz);

