import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"

import styles from "./QuestionViz.module.css"

function QuestionViz(props) {

    

    return (
        <React.Fragment>
            <div className={styles.card}>
                <p>{props.title}</p>

                <p>{props.questions[props.qi].question}</p>
                <p>A: {props.questions[props.qi].A}</p>
                <p>B: {props.questions[props.qi].B}</p>
                <p>C: {props.questions[props.qi].C}</p>
                <p>D: {props.questions[props.qi].D}</p>
            </div>
        </React.Fragment>
    )
}

export default withRouter(QuestionViz);

