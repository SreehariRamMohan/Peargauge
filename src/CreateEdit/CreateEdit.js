import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { Tabs, Tab } from "react-bootstrap"

import CreateLectureDeck from "../CreateLectureDeck/CreateLectureDeck"
import EditLectureDeck from "../EditLectureDeck/EditLectureDeck"
import styles from "./CreateEdit.module.css"

function CreateEdit() {
    const [key, setKey] = useState('create');

    const [deckUID, setDeckUID] = useState("")

    // called from the edit tab, transition to the create tab
    // pass along the deck uid, generate exisiting questions to allow for easy editing. 
    function edit_particular_deck(deck_uid) {
        console.log("Switching tabs deck uid is", deck_uid )
        setDeckUID(deck_uid)
        setKey("create")
    }


    return (
        <React.Fragment>
            <CustomNavbar />
            <Tabs
            className={styles.tabs}
            transition={false}
            activeKey={key}
            onSelect={(k) => setKey(k)}
        >
            <Tab eventKey="create" title="Create/Edit Deck">
                <CreateLectureDeck edit_deck_uid={deckUID} />
            </Tab>
            <Tab eventKey="edit" title="My Decks">
                <EditLectureDeck onEdit={edit_particular_deck}/>
            </Tab>
        </Tabs>
        </React.Fragment>
    )
}

export default withRouter(CreateEdit);

