import React, { useEffect, useState } from "react";
import { Nav, Navbar, Form, NavDropdown, FormControl, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import styles from './CustomNavbar.module.css';

function CustomNavbar(props) {
    return (
        <div className={styles.navBarContainer}>
            <p className={styles.text}>🍐 Peargauge</p>
        </div>
        // <Navbar bg="light" expand="lg">
        //     <Navbar.Brand><Link to={"/home"}>{"🍐 Peargauge"}</Link></Navbar.Brand>
        //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
        // </Navbar>
    )
}

export default withRouter(CustomNavbar);


