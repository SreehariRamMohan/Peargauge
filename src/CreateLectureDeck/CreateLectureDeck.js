import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import Question from "./Question/Question"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import styles from "./CreateLectureDeck.module.css"
import { v4 as uuidv4 } from 'uuid';

import { URL } from "../Redux/constants"

const axios = require("axios")

function CreateLectureDeck(props) {
    const [title, setTitle] = useState("")
    const [numQuestions, setNumQuestions] = useState(0)
    const [questionContent, setQuestionContent] = useState({})
    const [saving, setSaving] = useState(false)
    const [deckId, setDeckId] = useState(uuidv4())
    const mongo_id = useSelector((state) => state.mongo_id);

    useEffect(() => {
    }, [])
    
    useEffect(() => {
        if (props.edit_deck_uid != "" && props.edit_deck_uid != deckId) {
            // console.log("Value of props.edit_deck_uid changed to ", props.edit_deck_uid)
            // load the current deck for editing
            fetch_deck(props.edit_deck_uid)
        }
    }, [props.edit_deck_uid])

    function fetch_deck(deck_id) {
        let payload = {
            "mongo_id": mongo_id,
            "deck_id": deck_id
        }
        axios.post(URL + "/getDeck", payload)
            .then(res => { return res.data })
            .then(data => {
                if (data.status == "success") {
                    setTitle(data.deck.title)                    
                    //convert the list like format of the questions to a dictionary which we use internally. 
        
                    let questionContent = {}
                    for (var i = 0; i < data.deck.questions.length; i++) {
                        questionContent[(parseInt(i)+1) + ""] = data.deck.questions[i]
                    }

                    setQuestionContent(questionContent)
                    setDeckId(data.deck["_id"])
                    setNumQuestions(data.deck.questions.length)
                }
            })
    }


    /** questionContent structure
     * {
     * "1": {
     *      question: ""
     *      "A": ""
     *      "B": ""
     *      "C": ""
     *      "D": ""
     *      correct: ""
     *      format: ""
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
        newState[(numQuestions + 1)+""] = {
            "question": "",
            "A": "",
            "B": "",
            "C": "",
            "D": "",
            "correct": "",
            "format": "text" //if "latex" we format with latex
        }
        setQuestionContent(newState)

        setNumQuestions(numQuestions + 1)
    }

    

    function questionUpdate(questionNumber, update) {
        let newState = { ...questionContent }
        newState[questionNumber] = { ...newState["" + questionNumber], ...update }
        setQuestionContent(newState)
    }

    function deleteQuestion(questionNumber) {
        let newState = {...questionContent} 
        if (newState.hasOwnProperty("" + questionNumber)) {
            delete newState["" + questionNumber]
            setQuestionContent(newState)
        }
    }

    // method to help instructors modify the order of the questions in their deck 
    function swapQuestion(questionNumber, direction) {
        let keys = Object.keys(questionContent)

        let destination; 
        if (direction == "UP") {
            destination = (parseInt(questionNumber) - 1)+""
        } else if (direction == "DOWN") {
            destination = (parseInt(questionNumber) + 1)+""
        }

        if (destination < 1 || destination > keys.length) {
            return //First question can't be moved up. Last question can't be moved down. 
        } else {
            let targetQuestion = Object.assign({}, questionContent[destination])
            let questionToSwap = Object.assign({}, questionContent[questionNumber])

            let newQuestionContent = {...questionContent}
            newQuestionContent[questionNumber] = targetQuestion
            newQuestionContent[destination] = questionToSwap

            setQuestionContent(newQuestionContent)
            return
        }
    }

    //verify the user has filled out all required fields before saving.
    function validate() {
        let message = ""
        if (title == "") {
            message += "Please ensure your deck has a title\n"
        }
        let keys = Object.keys(questionContent)
        for (var i = 0; i < keys.length; i++) {
            let questionBody = questionContent[keys[i]]
            const {question, A, B, C, D, correct, format} = questionBody
            if (question == "") {
                message += "For question " + keys[i] + ", please ensure the question prompt is filled out\n"
            }
            if (A == "" || B == "" || C == "" || D == "") {
                message += "For question " + keys[i] + ", please ensure the all answer choices are filled out\n"
            }
            if (correct == "") {
                message += "For question " + keys[i] + ", please select a correct answer\n"
            }
            if (format == "") {
                message += "For question " + keys[i] + ", please choose a display format (text or latex)\n"
            }
        }
        return message
    }

    function saveQuestions() {

        let validationMessage = validate()

        if (!(validationMessage == "")) {
            alert(validationMessage)
            return
        }

        setSaving(true)
        
        //convert the dictionary like structure in questionContent to a list

        let questions = []
        let keys = Object.keys(questionContent)
        for (var i = 0; i < keys.length; i++) {
            questions.push(questionContent[keys[i]])
        }

        let payload = {
            "title": title,
            "questions": questions,
            "mongo_id": mongo_id,
            "deck_id": deckId
        }

        axios.post(URL + "/createDeck", payload) // This will also edit an existing deck 
            .then(res => { return res.data })
            .then(data => {
                setSaving(false)
                props.refresh()
            })
    }

    function titleChange(e) {
        setTitle(e.target.value)
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                
                <div className={styles.lectureTitleBox}>
                    {/* <p>Lecture Title</p> */}
                    {/* <input placeholder="title" onChange={titleChange}></input> */}
                    <TextareaAutosize value={title} className={styles.title} onChange={titleChange} rowsMin={2} placeholder="Super Awesome Deck Title 🚀" />
                </div>

                {/* {
                    Array.from(Array(numQuestions)).map((value, index, arr) => {
                        return <Question questionNumber={index + 1} updateFunction={questionUpdate} />
                    })
                } */}

                {
                    Object.keys(questionContent).sort().map((value, index, arr) => {
                        return <Question questionNumber={value} questionStateDict={questionContent[value]} updateFunction={questionUpdate} 
                                            deleteFunction={deleteQuestion} swapQuestion={swapQuestion}
                                            firstQuestion={index==0 ? true : false} 
                                            lastQuestion={index==(arr.length-1) ? true : false}/>
                    })
                }

                <div className={styles.bottomButtonBox} >
                    <div className="left"></div>
                    <button className={styles.addButton} onClick={addQuestion}><AddIcon fontSize="large"/> New Question</button>
                    <button className={styles.addButton} disabled={saving} onClick={saveQuestions}><SaveIcon fontSize="large" /> Save</button>
                </div>


            </div>


        </React.Fragment>
    )
}

export default withRouter(CreateLectureDeck);

