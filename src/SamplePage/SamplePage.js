import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import { useParams } from "react-router-dom";
import Navbar from "../CustomNavbar/CustomNavbar"

import styles from "./SamplePage.module.css"

import io from 'socket.io-client'

const socket = io('ws://localhost:5000');

function mapStateToProps(state) {
    return {
        sampleData: state.sampleData,
    };
}

function SamplePage() {

    let { id } = useParams();

    const [disabled, setDisabled] = useState(false)

    //use Effect will only run once, because there is nothing in the array that will change.
    useEffect(() => {
        socket.on("connect", function () {
            socket.emit("join", id)
            console.log("Client joining the room", id)
        })
       
    }, [])

    function handleMC(letter) {
        let guessObject = {
            "roomid": id,
            "letter": letter
        }
        socket.emit("guess", guessObject)
        //setDisabled(true)
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.container}>
                <p>Peargauge MVP</p>
                {id != null &&
                    <p>Trying to join the room with id {id}</p>}
                
                    <div className={styles.mContainer}>
                        <button disabled={disabled} onClick={() => handleMC("A")} className={styles.button}>A</button>
                        <button disabled={disabled} onClick={() => handleMC("B")} className={styles.button}>B</button>
                    </div>
                    <div className={styles.mContainer}>
                        <button disabled={disabled} onClick={() => handleMC("C")} className={styles.button}>C</button>
                        <button disabled={disabled} onClick={() => handleMC("D")} className={styles.button}>D</button>
                    </div>
            </div>


        </React.Fragment>
    )
}

export default withRouter(connect(mapStateToProps, null)(SamplePage));

