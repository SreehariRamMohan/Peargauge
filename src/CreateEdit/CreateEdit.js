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

    const date = new Date()
    const [lastSavedTime, setLastSavedTime] = useState(date.getTime()) // time of last saved deck. Using this as an indicator 
    //prop to determine when to refresh the EditLectureDeck component (re-call the getDeckNames route)

    // called from the edit tab, transition to the create tab
    // pass along the deck uid, generate exisiting questions to allow for easy editing. 
    function edit_particular_deck(deck_uid) {
        console.log("Switching tabs deck uid is", deck_uid )
        setDeckUID(deck_uid)
        setKey("create")
    }

    function refresh_edit_deck_screen() {
        setLastSavedTime(date.getTime())
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
                <CreateLectureDeck edit_deck_uid={deckUID} refresh={refresh_edit_deck_screen}/>
            </Tab>
            <Tab eventKey="edit" title="My Decks">
                <EditLectureDeck onEdit={edit_particular_deck} refresh_prop={lastSavedTime}/>
            </Tab>
        </Tabs>
        </React.Fragment>
    )
}

export default withRouter(CreateEdit);

