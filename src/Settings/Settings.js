import React, { useRef, useState, useEffect } from "react";
import { Spinner, Alert, OverlayTrigger, Popover } from "react-bootstrap"
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { useHistory } from "react-router-dom";

import { URL } from "../Redux/constants"

import classNames from 'classnames/bind';

import styles from "./Settings.module.css"

const axios = require("axios")

let cx = classNames.bind(styles);

function Settings() {

    const [loadingDownload, setLoadingDownload] = useState(false)
    const mongo_id = useSelector((state) => state.mongo_id);
    const jwt_token = useSelector((state) => state.jwt_token);
    const username = useSelector((state) => state.username);
    const history = useHistory();


    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [showPasswordAlert, setShowPasswordAlert] = useState(false)
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
    const [passwordChangeButtonDisabled, setPasswordButtonDisabled] = useState(false)

    const [validationUsername, setValidationUsername] = useState("")

    const downloadRef = useRef()

    useEffect(() => {
        if (showPasswordAlert) {
            window.setTimeout(() => {
                setShowPasswordAlert(false)
                setPasswordButtonDisabled(false)
            }, 5000)
        }
    }, [showPasswordAlert])

    function downloadDecks() {
        setLoadingDownload(true)
        axios.post(URL + "/downloadDecks", {
            "mongo_id": mongo_id,
        })
            .then(res => {
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 4));
                var dlAnchorElem = document.getElementById('downloadLink');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", "decks.json");
                dlAnchorElem.click();
                setLoadingDownload(false)
            })
    }

    function changePassword() {
        console.log("Old Password", oldPassword, "New password", newPassword)
        let payload = {
            "mongo_id": mongo_id,
            "password": oldPassword,
            "new_password": newPassword
        }
        axios.post(URL + "/settings/changePassword", payload)
            .then(res => {
                setPasswordButtonDisabled(true)
                if (res.status == 200) {
                    setShowPasswordAlert(true)
                    setPasswordChangeSuccess(true)
                }
            })
            .catch(err => {
                setPasswordButtonDisabled(true)
                setShowPasswordAlert(true)
                setPasswordChangeSuccess(false)
            })
    }

    function deleteAccount() {
        if (validationUsername == username) {
            let payload = {
                "mongo_id": mongo_id
            }
            axios.post(URL + "/settings/deleteAccount", payload)
                .then(res => {
                    history.push("/logout")
                })
        }
    }

    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={cx("container", "main")}>
                <p className={styles.title}>Account Settings</p>
                <div className="d-flex flex-row py-3">
                    <p className="m-2">Download my decks (JSON format)</p>
                    <button disabled={loadingDownload} className={styles.stylistic_rounded_button} onClick={downloadDecks}>
                        {loadingDownload && <Spinner animation="border" />} Download
                    </button>
                    <a id="downloadLink"></a>
                </div>

                <div className="d-flex flex-row py-3">
                    <p className="m-2">Change Password</p>
                    <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mr-2" placeholder="old password"></input>
                    <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mr-2" placeholder="new password"></input>
                    <button disabled={passwordChangeButtonDisabled} onClick={changePassword} className={styles.stylistic_rounded_button}>change</button>
                </div>

                {showPasswordAlert ?
                    passwordChangeSuccess ? (<Alert variant={"success"}>
                        Password changed successfully.
                    </Alert>)
                        : (<Alert variant={"danger"}>
                            Error: incorrect old password, did not change password.</Alert>)
                    : <React.Fragment></React.Fragment>
                }




                <div className="d-flex flex-row py-3">
                    <p className="m-2">Delete Account</p>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={
                            <Popover >
                                <Popover.Title as="h3">This action is permanent. Please be sure.</Popover.Title>
                                <Popover.Content>
                                    <div className={styles.session_popup}>
                                        <input value={validationUsername} onInput={(e) => { setValidationUsername(e.target.value) }} placeholder={"Type your username"}></input>
                                        <button onClick={deleteAccount}>delete my account</button>
                                    </div>
                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <button className={styles.stylistic_rounded_button}>Delete</button>
                    </OverlayTrigger>
                </div>


            </div>

        </React.Fragment>
    )
}

export default withRouter(Settings);

