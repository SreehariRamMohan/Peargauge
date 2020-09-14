import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router"
import Navbar from "../CustomNavbar/CustomNavbar"
import styles from "./ChatPage.module.css"

// socket io imports
import io from 'socket.io-client'

function ChatPage() {
    const [messages, setMessages] = useState(["Initial Message"]);
    const [currentMessage, setCurrentMessage] = useState("");
    const socket = io('ws://localhost:5000');

    useEffect(() => {
        getMessages()

    }, [messages.length])

    const getMessages = () => {
        socket.on("message", msg => {
            setMessages([...messages, msg])
            console.log("fetched messages from socket.io")
        });
    }

    const onClick = () => {
        if (currentMessage !== "") {
            socket.emit("message", currentMessage)
            setCurrentMessage("")
        } else {
            alert("Please add a message before submitting it.")
        }
    }

    const onChange = (e) => {
        setCurrentMessage(e.target.value);
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className={styles.container}>
                <p>Chat room</p>
                {messages.length > 0 &&
                    messages.map(msg => (
                        <div><p>{msg}</p></div>
                    ))
                }
                <input value={currentMessage} name="message" onChange={e => onChange(e)} />
                <button onClick={() => onClick()}>Send Message</button>
            </div>
        </React.Fragment>
    )
}

export default withRouter(ChatPage);

