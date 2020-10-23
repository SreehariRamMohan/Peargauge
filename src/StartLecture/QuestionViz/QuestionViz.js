import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"

import styles from "./QuestionViz.module.css"

function QuestionViz(props) {


    return (
        <React.Fragment>
            {
                props.demo ?
                    <React.Fragment>
                        <div className={styles.container}>
                            <div className={styles.toggleContainer}><img src={require("../../res/backward.png")}></img></div>
                            <div className={styles.card}>
                                <p>Select a deck to get started</p>
                            </div>
                            <div className={styles.toggleContainer}><img src={require("../../res/forward.png")}></img></div>
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className={styles.container}>
                            <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "backward")}><img src={require("../../res/backward.png")}></img></div>
                            <div className={styles.card}>
                                <p>{props.title}</p>
                                <p>{props.questions[props.qi].question}</p>
                                <p>A: {props.questions[props.qi].A}</p>
                                <p>B: {props.questions[props.qi].B}</p>
                                <p>C: {props.questions[props.qi].C}</p>
                                <p>D: {props.questions[props.qi].D}</p>
                            </div>
                            <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "forward")}><img src={require("../../res/forward.png")}></img></div>
                        </div>
                    </React.Fragment>
            }
        </React.Fragment>
    )
}

export default withRouter(QuestionViz);

