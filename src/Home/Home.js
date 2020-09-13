import React, { useEffect, useState } from 'react';

// react-bootstrap css styling
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';

//react router dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import {test_redux} from "../Redux/actions"

//components
import Navbar from "../CustomNavbar/CustomNavbar.js"

//axios
const axios = require("axios")

function Home() {

  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {

    axios.get("/time")
    .then(res => {return res.data})
    .then(res => {
      console.log("Time fetched from flask backend:", res.time)
      setCurrentTime(res.time);

      //set the current time in redux 
      dispatch(test_redux(res.time))
    })

  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <p>
          Edit <code>src/Home.js</code> and save to reload.
        </p>

        <p> [Flask call] the current time is {currentTime}</p>
       
      </div>
    </div>
  );
}

export default Home;
