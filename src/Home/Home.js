import React, { useEffect, useState } from 'react';

// react-bootstrap css styling
import 'bootstrap/dist/css/bootstrap.min.css';

import { OverlayTrigger, Popover } from "react-bootstrap"

import styles from './Home.module.css';

import { compareAsc, format } from 'date-fns'

//react router dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { test_redux } from "../Redux/actions"

//components
import Navbar from "../CustomNavbar/CustomNavbar.js"

//allow us to navigate with react-router
import { useHistory } from "react-router-dom";

import {URL} from "../Redux/constants"

//axios
const axios = require("axios")



function Home() {

  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionCode, setSessionCode] = useState("")
  const history = useHistory();
  const jwt_token = useSelector((state) => state.jwt_token);
  const mongo_id = useSelector((state) => state.mongo_id)

  useEffect(() => {
    console.log("The jwt token is", jwt_token)
    console.log("The mongo id is",  mongo_id)
    
    history.push("/create");
  }, []);

  function onClick(type) {
    if (type == "new_session") {
      history.push("/start");
    } else if (type == "create") {
      history.push("/create");
    } else if (type == "join") {
      history.push("/sample");
    } else if (type == "settings") {
      history.push("/home");
    }
  }

  function onSubmitCode() {
    history.push("/sample/" + sessionCode);
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>

        <div className={styles.main}>

          <div className={styles.left}>

            <div className={styles.row}>
              <div onClick={() => onClick("new_session")}>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/quiz-white-small.png")}></img>
                </div>
                <p>New Session</p>
              </div>

              <div onClick={() => onClick("create")}>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/create-small-white.png")}></img>
                </div>
                <p>Create Deck</p>
              </div>
            </div>

            <div className={styles.row}>
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover >
                    <Popover.Title as="h3">Session Code</Popover.Title>
                    <Popover.Content>
                      <div className={styles.session_popup}>
                        <input placeholder={"27"} value={sessionCode} onInput={(e) => {setSessionCode(e.target.value)}}></input>
                        <button onClick={onSubmitCode}>submit</button>
                      </div>
                    </Popover.Content>
                  </Popover>
                }
              >
                <div>
                  <div className={styles.logoWrapper}>
                    <img src={require("../res/join-small-white.png")}></img>
                  </div>
                  <p>Join Session</p>
                </div>
              </OverlayTrigger>

              <div onClick={() => onClick("new_session")}>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/settings-white-small.png")}></img>
                </div>
                <p>User Settings</p>
              </div>
            </div>

          </div>


          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.imageContainer}>
                <img className={styles.backgroundImage} src={require("../res/home-background.png")}></img>
                <p className={styles.centeredText}>{format(new Date(), 'h:mm a')}</p>
                <p className={styles.dateText}>{format(new Date(), 'PPPP')}</p>
              </div>
              <div className={styles.meetingInformation}>
                <p>No upcoming meetings today.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;
