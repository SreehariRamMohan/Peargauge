import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from "./DeckTemplate.module.css"
import { useHistory } from "react-router-dom";

function DeckTemplate(props) {

    const history = useHistory();

    function edit() {
        props.onEdit(props.uid)
    }

    return (
        <React.Fragment>
            <div className="card">
                <p>{props.title}</p>
                <div className="d-flex flex-row justify-content-around">
                    <button onClick={edit} className={styles.stylistic_rounded_button}><EditIcon fontSize="large" /> Edit</button>
                    <button className={styles.stylistic_rounded_button}><DeleteIcon fontSize="large" /> Delete</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(DeckTemplate);

