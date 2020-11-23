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

  const [time, setTime] = useState(format(new Date(), 'h:mm a'))
  const [date, setDate] = useState(format(new Date(), 'PPPP'))

  useEffect(() => {
    console.log("The jwt token is", jwt_token)
    console.log("The mongo id is",  mongo_id)
    
    window.setInterval(function () {
      updateTime();
    }, 1000);
  }, []);

  function updateTime() {
    setTime(format(new Date(), 'h:mm a'))
    setDate(format(new Date(), 'PPPP'))
  }

  function onClick(type) {
    if (type == "new_session") {
      history.push("/start");
    } else if (type == "create") {
      history.push("/create");
    } else if (type == "join") {
      history.push("/sample");
    } else if (type == "settings") {
      history.push("/settings");
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

              <div onClick={() => onClick("settings")}>
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
                <p className={styles.centeredText}>{time}</p>
                <p className={styles.dateText}>{date}</p>
              </div>
              <div className={styles.meetingInformation}>

                <blockquote className={styles.quote}>
                  <p>"Education must shift from instruction, from imposing of stencils, to discovery—to probing and exploration and to the recognition of the language of forms."</p>
                  <p>--Marshall McLuhan</p>
                </blockquote>
                
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;
