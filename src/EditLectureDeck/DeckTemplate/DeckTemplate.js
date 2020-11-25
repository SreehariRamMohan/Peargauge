import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from "./DeckTemplate.module.css"
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap"

import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

function DeckTemplate(props) {

    const history = useHistory();

    function edit() {
        props.onEdit(props.uid)
    }

    return (
        <React.Fragment>
            <div className={cx("card", "deckCard")}>
                <p>{props.title}</p>
                <div className="d-flex flex-row justify-content-around">
                    <button onClick={edit} className={styles.stylistic_rounded_button}><EditIcon fontSize="large" /> Edit</button>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={
                            <Popover >
                                <Popover.Title>Are you sure you want to delete {props.title}?</Popover.Title>
                                <Popover.Content>
                                    <div className={styles.session_popup}>
                                        <button onClick={() => props.onDelete(props.uid)}>Yes!</button>
                                    </div>
                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <div>
                        <button className={styles.stylistic_rounded_button}><DeleteIcon fontSize="large" /> Delete</button>
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        </React.Fragment>


    )
}

export default withRouter(DeckTemplate);