import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"
import MathJax from 'react-mathjax2'

import styles from "./QuestionViz.module.css"

function QuestionViz(props) {

    //props.questions[props.qi]["format"] == "text" or "latex"

    function createQuestion() {
        if (!("format" in props.questions[props.qi]) || props.questions[props.qi]["format"] == "text") {
            // if for some reason we didn't set the question format, default to text (in addition to the case we set the question format to text)
            return (<React.Fragment>
                <div className={styles.container}>
                    {!props.client && <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "backward")}><img src={require("../../res/backward.png")}></img></div>}
                    <div className={styles.card}>
                        <p>{props.title}</p>
                        <p>{props.questions[props.qi].question}</p>
                        <p>A: {props.questions[props.qi].A}</p>
                        <p>B: {props.questions[props.qi].B}</p>
                        <p>C: {props.questions[props.qi].C}</p>
                        <p>D: {props.questions[props.qi].D}</p>
                    </div>
                    {!props.client && <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "forward")}><img src={require("../../res/forward.png")}></img></div>}
                </div>
            </React.Fragment>)
        }
        else if (props.questions[props.qi]["format"] == "latex") {
            return (<React.Fragment>
                <div className={styles.container}>
                    {!props.client && <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "backward")}><img src={require("../../res/backward.png")}></img></div>}
                    <div className={styles.card}>
                        <p>{props.title}</p>
                        
                        <MathJax.Context input='tex'>
                            <div>
                                <MathJax.Node>{props.questions[props.qi].question}</MathJax.Node>
                            </div>
                        </MathJax.Context>

                        <MathJax.Context input='tex'>
                            <div className="d-flex flex-row">
                                <MathJax.Node>{"\\text{A: }" + props.questions[props.qi].A}</MathJax.Node>
                            </div>
                        </MathJax.Context>

                        <MathJax.Context input='tex'>
                            <div className="d-flex flex-row">
                                <MathJax.Node>{"\\text{B: }" + props.questions[props.qi].B}</MathJax.Node>
                            </div>
                        </MathJax.Context>

                        <MathJax.Context input='tex'>
                            <div className="d-flex flex-row">
                                <MathJax.Node>{"\\text{C: }" + props.questions[props.qi].C}</MathJax.Node>
                            </div>
                        </MathJax.Context>

                        <MathJax.Context input='tex'>
                            <div className="d-flex flex-row">
                                <MathJax.Node>{"\\text{D: }" + props.questions[props.qi].D}</MathJax.Node>
                            </div>
                        </MathJax.Context>
                    </div>
                    {!props.client && <div className={styles.toggleContainer} onClick={(e) => props.forward(e, "forward")}><img src={require("../../res/forward.png")}></img></div>}
                </div>
            </React.Fragment>)
        }
    }

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
                    : createQuestion()
            }
        </React.Fragment>
    )
}

export default withRouter(QuestionViz);

