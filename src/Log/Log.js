import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { Card, Nav, Button, Form, Row, Col } from "react-bootstrap"

import styles from './Log.module.css';
import svg from "../res/peargauge-background_03.svg"

const axios = require("axios")

function Log() {

    const [loginState, toggleLoginState] = useState(true)
    
    const usernameRef = React.createRef();
    const passwordRef = React.createRef();

    function toggle(bool) {
        toggleLoginState(bool)
    }

    function onSubmit() {

        let payload = {
            "username": usernameRef.current.value,
            "password": passwordRef.current.value
        }

        let route = "/loginUser"
        if (!loginState) {
            route = "/createUser"
        }

        axios.post(route, payload)
        .then(res => {return res.data})
        .then(data => {
            console.log(data)
        })

    }

    return (
        <React.Fragment>
            <div
                className={styles.hero}
                style={{ backgroundImage: `url(${svg})` }}
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

