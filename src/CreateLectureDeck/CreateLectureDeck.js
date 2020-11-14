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
        if (props.edit_deck_uid != "" && props.edit_deck_uid != deckId) {
            console.log("Value of props.edit_deck_uid changed to ", props.edit_deck_uid)

            // load the current deck for editing
            setDeckId(props.edit_deck_uid)
            
        }
    }, [props.edit_deck_uid])
    /** questionContent structure
     * {
     * "1": {
     *      question: ""
     *      "A": ""
     *      "B": ""
     *      "C": ""
     *      "D": ""
     *      correct: ""
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
        newState["" + numQuestions + 1] = {}
        setNumQuestions(numQuestions + 1)
    }

    function questionUpdate(questionNumber, update) {
        let newState = { ...questionContent }
        newState["" + questionNumber] = { ...newState["" + questionNumber], ...update }
        setQuestionContent(newState)
    }

    function saveQuestions() {

        setSaving(true)
        //convert the dictionary like structure in questionContent to a list
        let questions = []
        for (var i = 0; i < numQuestions; i++) {
            questions.push(questionContent[i + 1 + ""])
        }

        let payload = {
            "title": title,
            "questions": questions,
            "mongo_id": mongo_id,
            "deck_id": deckId
        }

        axios.post(URL + "/createDeck", payload)
            .then(res => { return res.data })
            .then(data => {
                // console.log(data)
                setSaving(false)
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
                    <TextareaAutosize className={styles.title} onChange={titleChange} rowsMin={2} placeholder="Super Awesome Deck Title 🚀" />
                </div>

                {
                    Array.from(Array(numQuestions)).map((value, index, arr) => {
                        return <Question questionNumber={index + 1} updateFunction={questionUpdate} />
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

