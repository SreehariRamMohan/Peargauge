export const SAMPLE_ACTION = "SAMPLE_ACTION"
export const SET_JWT = "SET_JWT"
export const SET_MONGO_ID =  "SET_MONGO_ID"
// export const URL = (window.location.hostname == "peargauge-dev.herokuapp.com/api") ? "https://peargauge-dev.herokuapp.com/api" : `https://${window.location.hostname}:8000/api`

export const URL = (window.location.hostname == "peargauge-dev.herokuapp.com") ? "https://peargauge-dev.herokuapp.com/api" : "http://127.0.0.1:5000/api"
export const WEBSOCKET_URL = (window.location.hostname == "peargauge-dev.herokuapp.com") ? "https://peargauge-dev.herokuapp.com" : `${window.location.hostname}:5000`

export const generate_join_url = (uid) => {
    if (window.location.hostname == "peargauge-dev.herokuapp.com") {
        return "https://peargauge-dev.herokuapp.com/sample/" + uid
    } else {
        return "http://localhost:3000/sample/" + uid
    } 
} 

export const AUTO_LOG_IN = false