export const SAMPLE_ACTION = "SAMPLE_ACTION"
export const SET_JWT = "SET_JWT"
// export const URL = (window.location.hostname == "peargauge-dev.herokuapp.com/api") ? "https://peargauge-dev.herokuapp.com/api" : `https://${window.location.hostname}:8000/api`

export const URL = (window.location.hostname == "peargauge-dev.herokuapp.com") ? "https://peargauge-dev.herokuapp.com/api" : "http://127.0.0.1:8000/api"
export const WEBSOCKET_URL = (window.location.hostname == "peargauge-dev.herokuapp.com") ? "peargauge-dev.herokuapp.com" : `${window.location.hostname}:8000`
