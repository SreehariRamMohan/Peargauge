import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import Question from "./Question/Question"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { Tab, Row, Col, Nav } from "react-bootstrap"

import styles from "./EditLectureDeck.module.css"

import { URL } from "../Redux/constants"

const axios = require("axios")

function EditLectureDeck() {
    const [title, setTitle] = useState("")
    const [numQuestions, setNumQuestions] = useState(0)
    const [questionContent, setQuestionContent] = useState({})
    const [deckTitles, setDeckTitles] = useState([])

    useEffect(() => {
        getDeckTitles()
    }, [])

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
        //convert the dictionary like structure in questionContent to a list
        let questions = []
        for (var i = 0; i < numQuestions; i++) {
            questions.push(questionContent[i + 1 + ""])
        }

        let payload = {
            "title": title,
            "questions": questions
        }

        axios.post(URL + "/createDeck", payload)
            .then(res => { return res.data })
            .then(data => {
                // console.log(data)
            })
    }

    function titleChange(e) {
        setTitle(e.target.value)
    }

    function getDeckTitles() {
        axios.get(URL + "/getDeckNames")
            .then(res => {
                return res.data
            })
            .then(data => {
                setDeckTitles(data.titles)
                console.log("Deck titles", data.titles, "generated")
            })
    }

    function generateNavItems() {
        // deckTitles.map((value, index, arr) => {
        //     return (<Nav.Item>
        //         <Nav.Link eventKey="first">{value}</Nav.Link>
        //     </Nav.Item>)
        // })
        return (<><Nav.Item>
            <Nav.Link eventKey="first">Deck 1</Nav.Link>
        </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="second">Deck 2</Nav.Link>
            </Nav.Item></>)

    }

    return (
        <React.Fragment>
            <div className={styles.container}>

                <Tab.Container id="left-tabs-example" defaultActiveKey="first">

                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">

                                {
                                deckTitles.map((value, index, arr) => {
                                    return (<Nav.Item>
                                            <Nav.Link eventKey="first">{value}</Nav.Link>
                                                </Nav.Item>)
                                })
                                }


                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <div className={styles.lectureTitleBox}>
                                        <TextareaAutosize className={styles.title} rowsMin={2} placeholder="Super Awesome Deck Title 🚀" />
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <div className={styles.lectureTitleBox}>
                                        <TextareaAutosize className={styles.title} rowsMin={2} placeholder="Super Awesome Deck Title 🚀" />
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>



            </div>


        </React.Fragment>
    )
}

export default withRouter(EditLectureDeck);

