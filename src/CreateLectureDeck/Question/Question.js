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
import MathJax from 'react-mathjax2'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


import styles from "./Question.module.css"
const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`

function Question(props) {

    let initalQuestionData = {
        "question": "",
        "A": "",
        "B": "",
        "C": "",
        "D": "",
        "correct": "",
        "format": "text" //if "latex" we format with latex
    }

    const [questionData, setQuestionData] = useState(initalQuestionData)

    function handleCheck(event, type, letter) {
        let update = { ...questionData }
        update[type + ""] = letter
        setQuestionData(update)
        props.updateFunction(props.questionNumber, update)
    }

    function handleRadioChange(event) {
        console.log("radio button status:", event.target.value)
        questionData["format"] = event.target.value
    }

    function onChange(event, type) {
        //console.log(props.questionNumber,":",type, ":", event.target)
        let update = { ...questionData }
        update[type + ""] = event.target.value
        setQuestionData(update)
        props.updateFunction(props.questionNumber, update)
    }

    function showQuestionExample(questionType) {
        if (questionType == "text") {
            const textQuestion = "Who was the 23rd president of the United States?"
            let update = { ...questionData }

            update["question"] = textQuestion
            update["A"] = "Herbert Hoover"
            update["B"] = "Joe Biden"
            update["C"] = "Donald Trump"
            update["D"] = "Benjamin Harrison"

            // set the question render format to text, to remove the latex rendering
            update["format"] = "text"

            setQuestionData(update)
            props.updateFunction(props.questionNumber, update)

        } else if (questionType == "latex") {
            const latexQuestion = "\\text{find } \\mathbb{E}(x) \\text{ where X is a Poisson random variable } P\\left( x \\right) = \\frac{{e^{ - \\lambda } \\lambda ^x }}{{x!}}"
            let update = { ...questionData }

            update["question"] = latexQuestion
            update["A"] = "\\lambda^{1}"
            update["B"] = "\\lambda^{2}"
            update["C"] = "\\int_0^{\\infty} \\lambda e^{\\frac{x}{\\lambda}} dx"
            update["D"] = "\\text{not convergent ??}"

            // set the question render format to latex, to add the latex rendering box
            update["format"] = "latex"

            setQuestionData(update)
            props.updateFunction(props.questionNumber, update)
        }
    }

    return (
        <React.Fragment>
            <div className={styles.card}>
                {questionData["format"] == "latex" && <div>
                    <MathJax.Context input='tex'>
                        <div>
                            <MathJax.Node>{questionData["question"]}</MathJax.Node>
                        </div>
                    </MathJax.Context>
                </div>}

                <TextareaAutosize value={questionData["question"]} onChange={(e) => onChange(e, "question")} className={styles.question} rowsMin={2} placeholder="Question... normal text or Latex supported 🐳" />

                <div className="p-3">
                    <FormControl component="fieldset" >
                        <FormLabel component="legend">Render Options</FormLabel>
                        <RadioGroup row aria-label="format-options" name="format" onChange={handleRadioChange}>
                            <FormControlLabel value="text" control={<Radio className={styles.radioButtonLabelAlignment} />} label={<p className={styles.radioButtonLabelAlignment}>text, view <span onClick={() => showQuestionExample("text")} className={styles.exampleText}>example</span></p>} />
                            <FormControlLabel value="latex" control={<Radio className={styles.radioButtonLabelAlignment} />} label={<p className={styles.radioButtonLabelAlignment}>latex, view <span onClick={() => showQuestionExample("latex")} className={styles.exampleText}>example</span></p>} />
                        </RadioGroup>
                    </FormControl>
                </div>


                <div className={styles.mContainer}>


                    <div className="d-flex flex-column">
                        {questionData["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{questionData["A"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}

                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "A")} checked={questionData["correct"] == "A"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={questionData["A"]} onChange={(e) => onChange(e, "A")} className={styles.option} placeholder="Option A 🎃" />
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        {questionData["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{questionData["B"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "B")} checked={questionData["correct"] == "B"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={questionData["B"]} onChange={(e) => onChange(e, "B")} className={styles.option} placeholder="Option B 🐶" />
                        </div>
                    </div>
                    {/* <input onChange={(e) => onChange(e, "A")} placeholder="Option A"></input> */}
                    {/* <input onChange={(e) => onChange(e, "B")} placeholder="Option B"></input> */}
                </div>
                <div className={styles.mContainer}>
                    {/* <input onChange={(e) => onChange(e, "C")} placeholder="Option C"></input>
                    <input onChange={(e) => onChange(e, "D")} placeholder="Option D"></input> */}

                    <div className="d-flex flex-column">
                        {questionData["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{questionData["C"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "C")} checked={questionData["correct"] == "C"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={questionData["C"]} onChange={(e) => onChange(e, "C")} className={styles.option} placeholder="Option C 🏗️" /></div>
                    </div>

                    <div className="d-flex flex-column">
                        {questionData["format"] == "latex" && <div>
                            <MathJax.Context input='tex'>
                                <div>
                                    <MathJax.Node>{questionData["D"]}</MathJax.Node>
                                </div>
                            </MathJax.Context>
                        </div>}
                        <div className={styles.optionBox}>
                            <Checkbox onChange={(e) => handleCheck(e, "correct", "D")} checked={questionData["correct"] == "D"} icon={<CheckCircleIcon fontSize="large" />} checkedIcon={<CheckCircleIcon fontSize="large" />} />
                            <TextareaAutosize value={questionData["D"]} onChange={(e) => onChange(e, "D")} className={styles.option} placeholder="Option D 🍕" />
                        </div>
                    </div>
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

