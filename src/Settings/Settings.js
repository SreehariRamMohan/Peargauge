import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"


import classNames from 'classnames/bind';

import styles from "./Settings.module.css"

let cx = classNames.bind(styles);

function Settings() {
    return (
        <React.Fragment>
            <CustomNavbar />
            <div className={cx("container", "main")}>
                <p className={styles.title}>Account Settings</p>
                <div className="d-flex flex-row py-3">
                    <p className="m-2">Download my decks (JSON format)</p>
                    <button className="">Download</button>
                </div>

                <div className="d-flex flex-row py-3">
                    <p className="m-2">Change Password</p>
                    <input placeholder="old password"></input>
                    <input placeholder="new password"></input>
                    <button>change</button>
                </div>

                <div className="d-flex flex-row py-3">
                    <p className="m-2">Delete Account</p>
                    <button>Delete</button>
                </div>


            </div>

        </React.Fragment>
    )
}

export default withRouter(Settings);

