import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { Card, Nav, Button, Form, Row, Col } from "react-bootstrap"

import styles from './Log.module.css';
import svg from "../res/peargauge-background_03.svg"


function Log() {
    return (
        <React.Fragment>
            <div
                className={styles.hero}
                style={{ backgroundImage: `url(${svg})` }}
            >
                <div className={styles.card}>
                    <Card.Header className={styles.cardHeader}>
                        <Nav variant="tabs" defaultActiveKey="#first">
                            <Nav.Item>
                                <Nav.Link href="#first">Log In</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#link">Create Account</Nav.Link>
                            </Nav.Item>

                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={2}>
                                Email
    </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="email" placeholder="Email" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={2}>
                                Password
    </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" />
                            </Col>
                        </Form.Group>
                        <Button variant="primary">Get in</Button>
                    </Card.Body>
                </div>

            </div>

        </React.Fragment>
    )
}

export default withRouter(Log);

