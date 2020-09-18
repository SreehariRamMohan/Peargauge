import React, { useState } from "react";
import { connect } from "react-redux";
import {withRouter} from "react-router"
import CustomNavbar from "../../CustomNavbar/CustomNavbar"

import styles from "./QuestionViz.module.css"

function QuestionViz() {
    return (
        <React.Fragment>
            <div className={styles.card}>
                <p>Question title</p>
            </div>
        </React.Fragment>
    )
}
  
export default withRouter(QuestionViz);

