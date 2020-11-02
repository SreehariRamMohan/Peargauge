import React, { useEffect, useState } from "react";
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

const axios = require("axios")


function Log() {

    const [loginState, toggleLoginState] = useState(true)

    const usernameRef = React.createRef();
    const passwordRef = React.createRef();
    const history = useHistory();
    const dispatch = useDispatch();

    const jwt_token = useSelector((state) => state.jwt_token);

    // define an axios interceptor to automatically request a refresh token from flask-jwt if the access_token is expired
    // axios.interceptors.response.use(
    //     (response) => {
    //         return response
    //     },
    //     (error) => {
    //         return new Promise((resolve, reject) => {
    //             const originalRequest = error.config
    //             const refreshToken = localStorage.getItem('refresh_token')
    //             if (refreshToken) {
    //                 axios({
    //                     method: "post",
    //                     url: URL + `/refresh`,
    //                     withCredentials: true,
    //                     headers: {
    //                         Authorization: `Bearer ${jwt_token}`,
    //                     },
    //                 })
    //                     .then((res) => res.json())
    //                     .then((res) => {

    //                         let non_fresh_access_token = res.data["access_token"]
    //                         dispatch(set_jwt_token(non_fresh_access_token))
    //                         resolve(axios(originalRequest))
    //                     })
    //             } else {
    //                 // redirect to login page since we don't have a refresh token. 
    //                 return reject("no refresh token availible")
    //             }
    //         })
    //     },
    // )

    useEffect(() => {
        console.log(`URL is ${URL}`)

        if (AUTO_LOG_IN) {
            onSubmit()
        }

    }, []);


    function toggle(bool) {
        toggleLoginState(bool)
    }

    function onSubmit() {

        let payload = {
            "username": usernameRef.current.value,
            "password": passwordRef.current.value
        }

        if (AUTO_LOG_IN) {
            payload["username"] = "sree"
            payload["password"] = "sree"
        }

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
            <CustomNavbar hideLogout={true}/>
            <div
                className={styles.background}
            >
                <div className={styles.card}>
                    <Card.Header className={styles.cardHeader}>
                        <Nav variant="tabs" defaultActiveKey="#first">
                            <Nav.Item onClick={() => toggle(true)}>
                                <Nav.Link href="#first">Log In</Nav.Link>
                            </Nav.Item>
                            <Nav.Item onClick={() => toggle(false)}>
                                <Nav.Link href="#link">Create Account</Nav.Link>
                            </Nav.Item>

                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Username
    </Form.Label>
                            <Col sm={7}>
                                <Form.Control ref={usernameRef} type="text" placeholder="user32" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={3}>
                                Password
                            </Form.Label>
                            <Col sm={7}>
                                <Form.Control ref={passwordRef} type="password" placeholder="Password" />
                            </Col>
                        </Form.Group>
                        {loginState ? <Button onClick={() => onSubmit()} variant="primary">Log in</Button> : <Button onClick={() => onSubmit()} variant="primary">Sign Up</Button>}
                    </Card.Body>
                </div>

            </div>

        </React.Fragment>
    )
}

export default withRouter(Log);

