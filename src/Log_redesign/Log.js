import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { Card, Nav, Button, Form, Row, Col } from "react-bootstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { set_jwt_token, set_mongo_id } from "../Redux/actions"

import styles from './Log.module.css';
import svg from "../res/peargauge-background_03.svg"
import { URL, AUTO_LOG_IN } from "../Redux/constants"

import { ReactComponent as PeargaugeLogo } from '../res/Peargauge-Logo_2.svg';
import { ReactComponent as Blob } from '../res/blob.svg';

import { gsap } from "gsap";
import {moveCircle} from "./animate"

const axios = require("axios")
const classNames = require("classnames")
let cx = classNames.bind(styles);

function Log() {

    const [loginState, toggleLoginState] = useState(true)

    const usernameRef = React.createRef();
    const passwordRef = React.createRef();
    const history = useHistory();
    const dispatch = useDispatch();

    const jwt_token = useSelector((state) => state.jwt_token);


    let intro = useRef(null)

    useEffect(() => {
        console.log(`URL is ${URL}`)

        // if (AUTO_LOG_IN) {
        //     onSubmit()
        // }
        moveCircle(intro)

    }, []);


    function toggle(bool) {
        toggleLoginState(bool)
    }

    function onSubmit() {

        let payload = {
            "username": usernameRef.current.value,
            "password": passwordRef.current.value
        }

        // if (AUTO_LOG_IN) {
        //     payload["username"] = "sree"
        //     payload["password"] = "sree"
        // }

        let route = URL + "/loginUser"
        if (!loginState) {
            route = URL + "/createUser"
        }

        axios.post(route, payload)
            .then(res => {
                if (res.status == 200) {
                    let access_token = res.data["access_token"]
                    let refresh_token = res.data["refresh_token"]

                    // store the access token in redux and the refresh token in local storage
                    dispatch(set_jwt_token(access_token))
                    dispatch(set_mongo_id(res.data["mongo_id"]))

                    localStorage.setItem("refresh_token", refresh_token);

                    history.push("/home");
                }
            })

    }

    return (
        <React.Fragment>
            <CustomNavbar hideLogout={true} />
            <div className={styles.background}>
                <div className={styles.form}>
                    <p className={styles.biggerFont}>Login <span className={styles.smallerFont}>or create account</span></p>
                    <Form.Control className={styles.form_input} ref={usernameRef} type="text" placeholder="username" />
                    <Form.Control className={styles.form_input} ref={passwordRef} type="password" placeholder="password" />
                    <Button onClick={() => onSubmit()} variant="light">Log in</Button>
                </div>
                <div>

                    <div className={styles.svgContainer}>
                        <PeargaugeLogo ref={(l) => (intro = l)} className={styles.peargaugeLogo} />
                    </div>

                </div>
            </div>

        </React.Fragment >
    )
}

export default withRouter(Log);

