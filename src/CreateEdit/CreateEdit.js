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
    return (
        <React.Fragment>
            <CustomNavbar />
            <Tabs
            className={styles.tabs}
            transition={false}
            activeKey={key}
            onSelect={(k) => setKey(k)}
        >
            <Tab eventKey="create" title="Create Deck">
                <CreateLectureDeck />
            </Tab>
            <Tab eventKey="edit" title="Edit Deck">
                <EditLectureDeck />
            </Tab>
        </Tabs>
        </React.Fragment>
    )
}

export default withRouter(CreateEdit);

