import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { Tab, Row, Col, Nav } from "react-bootstrap"

import styles from "./EditLectureDeck.module.css"

import DeckTemplate from "./DeckTemplate/DeckTemplate"

import { URL } from "../Redux/constants"

const axios = require("axios")

function EditLectureDeck(props) {

    const [deckTitles, setDeckTitles] = useState([])
    const mongo_id = useSelector((state) => state.mongo_id);


    useEffect(() => {
        getDeckTitles()
    }, [])

    function getDeckTitles() {

        axios.post(URL + "/getDeckNames", {
            "mongo_id": mongo_id
        })
            .then(res => {
                return res.data
            })
            .then(data => {
                let titles_uids = []
                for (var i = 0; i < data.titles.length; i++) {
                    titles_uids.push([data.titles[i], data.uids[i]]) // push the deck titles and uids into the deckTitles list. 
                }

                setDeckTitles(titles_uids)
                // console.log("Deck titles", titles_uids, "generated")
            })
    }

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    {deckTitles.map((value, index, arr) => {
                        return (
                            <div className="col-4 p-3">
                                {<DeckTemplate title={value[0]} uid={value[1]} onEdit={props.onEdit}/>}
                            </div>)
                    })}
                </div>
            </div>

        </React.Fragment>
    )
}

export default withRouter(EditLectureDeck);

