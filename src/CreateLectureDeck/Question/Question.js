import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Radio } from '@material-ui/core';
import MathJax from 'react-mathjax2'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ClearIcon from '@material-ui/icons/Clear';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import classNames from 'classnames/bind';

import styles from "./Question.module.css"

let cx = classNames.bind(styles); //classnames package bound to our classes in the module.css
//alows us to merge class names in react.

const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

function Question(props) {

    useEffect(() => {

    }, [props.questionStateDict])


    function handleCheck(event, type, letter) {
        let update = { ...props.questionStateDict }
        update[type + ""] = letter
        props.updateFunction(props.questionNumber, update)
    }

    function handleRadioChange(event) {
        console.log("radio button status:", event.target.value)
        
        let update = { ...props.questionStateDict }
        update["format"] = event.target.value
        props.updateFunction(props.questionNumber, update)
    }

    function onChange(event, type) {
        let update = { ...props.questionStateDict }
        update[type + ""] = event.target.value
        props.updateFunction(props.questionNumber, update)
    }

    function showQuestionExample(questionType) {
        if (questionType == "text") {
            const textQuestion = "Who was the 23rd president of the United States?"

            let update = { ...props.questionStateDict }

            update["question"] = textQuestion
            update["A"] = "Herbert Hoover"
            update["B"] = "Joe Biden"
            update["C"] = "Donald Trump"
            update["D"] = "Benjamin Harrison"
            update["correct"] = "D"

            // set the question render format to text, to remove the latex rendering
            update["format"] = "text"

            props.updateFunction(props.questionNumber, update)

        } else if (questionType == "latex") {
            const latexQuestion = "\\text{find } \\mathbb{E}(x) \\text{ where X is a Poisson random variable } P\\left( x \\right) = \\frac{{e^{ - \\lambda } \\lambda ^x }}{{x!}}"

            let update = { ...props.questionStateDict }

            update["question"] = latexQuestion
            update["A"] = "\\lambda^{1}"
            update["B"] = "\\lambda^{2}"
            update["C"] = "\\int_0^{\\infty} \\lambda e^{\\frac{x}{\\lambda}} dx"
            update["D"] = "\\text{not convergent ??}"
            update["correct"] = "A"

            // set the question render format to latex, to add the latex rendering box
            update["format"] = "latex"

            props.updateFunction(props.questionNumber, update)
        }
    }

    return (
        <React.Fragment>
            <div className={styles.card}>
                {props.questionStateDict["format"] == "latex" && <div>
                    <MathJax.Context input='tex'>
                        <div>
                            <MathJax.Node>{props.questionStateDict["question"]}</MathJax.Node>
                        </div>
                    </MathJax.Context>
                </div>}

                <div className={styles.clearIconWrapper} onClick={() => props.deleteFunction(""+props.questionNumber)}>
                    <ClearIcon fontSize="large" className={styles.clearIcon}/>
                </div>

                <TextareaAutosize value={props.questionStateDict["question"]} onChange={(e) => onChange(e, "question")} className={styles.question} rowsMin={2} placeholder="Question... normal text or Latex supported 🐳" />

                <div className="p-3">
                    <FormControl component="fieldset" >
                        <FormLabel component="legend">Render Options</FormLabel>
                        <RadioGroup row aria-label="format-options" name="format" onChange={handleRadioChange}>
                            <FormControlLabel value="text" control={<Radio className={styles.radioButtonLabelAlignment} />} label={<p className={styles.radioButtonLabelAlignment}>text, view <span onClick={() => showQuestionExample("text")} className={styles.exampleText}>example</span></p>} />
                            <FormControlLabel value="latex" control={<Radio className={styles.radioButtonLabelAlignment} />} label={<p className={styles.radioButtonLabelAlignment}>latex, view <span onClick={() => showQuestionExample("latex")} className={styles.exampleText}>example</span></p>} />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className={styles.switchOrderingBox}>
                    <div className={cx("arrow", "pt-2")} onClick={() => props.swapQuestion(props.questionNumber, "UP")}>
                        {!props.firstQuestion && <ArrowUpwardIcon fontSize="large"/>}
                    </div>
                    <div className={cx("arrow", "pt-2")} onClick={() => props.swapQuestion(props.questionNumber, "DOWN")}>
                        {!props.lastQuestion && <ArrowDownwardIcon fontSize="large"/>}
                    </div>
                </div>


                <div className={styles.mContainer}>


                    <div className="d-flex flex-column">
                        {props.questionStateDict["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{props.questionStateDict["A"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}

                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "A")} checked={props.questionStateDict["correct"] == "A"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={props.questionStateDict["A"]} onChange={(e) => onChange(e, "A")} className={styles.option} placeholder="Option A 🎃" />
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        {props.questionStateDict["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{props.questionStateDict["B"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "B")} checked={props.questionStateDict["correct"] == "B"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={props.questionStateDict["B"]} onChange={(e) => onChange(e, "B")} className={styles.option} placeholder="Option B 🐶" />
                        </div>
                    </div>
                </div>
                <div className={styles.mContainer}>
                    <div className="d-flex flex-column">
                        {props.questionStateDict["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{props.questionStateDict["C"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "C")} checked={props.questionStateDict["correct"] == "C"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={props.questionStateDict["C"]} onChange={(e) => onChange(e, "C")} className={styles.option} placeholder="Option C 🏗️" /></div>
                    </div>

                    <div className="d-flex flex-column">
                        {props.questionStateDict["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{props.questionStateDict["D"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "D")} checked={props.questionStateDict["correct"] == "D"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={props.questionStateDict["D"]} onChange={(e) => onChange(e, "D")} className={styles.option} placeholder="Option D 🍕" />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Question);

