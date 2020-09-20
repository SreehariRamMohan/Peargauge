import React, { useEffect, useState } from 'react';

// react-bootstrap css styling
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';

import { compareAsc, format } from 'date-fns'

//react router dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { test_redux } from "../Redux/actions"

//components
import Navbar from "../CustomNavbar/CustomNavbar.js"

//axios
const axios = require("axios")



function Home() {

  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {

  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>

        <div className={styles.main}>

          <div className={styles.left}>

            <div className={styles.row}>
              <div>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/quiz-white-small.png")}></img>
                </div>
                <p>New Session</p>
              </div>

              <div>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/create-small-white.png")}></img>
                </div>
                <p>Create Deck</p>
              </div>
            </div>

            <div className={styles.row}>

              <div>
                <div className={styles.logoWrapper}>
                  <img src={require("../res/join-small-white.png")}></img>
                </div>
                <p>Join Session</p>
              </div>
              <div>
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
