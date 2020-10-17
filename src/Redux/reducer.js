import produce from "immer"
import {enableAllPlugins} from "immer"

import {SAMPLE_ACTION, SET_JWT} from "./constants"

enableAllPlugins()

const initialState = {
    sampleData: "",
    jwt_token: ""
}

export default function reducer(state = initialState, action) {
  
    const producer = produce((draft, action) => {
      switch (action.type) {
        
        case SAMPLE_ACTION: {
          draft.sampleData = action.data;
          return draft;
        }

        case SET_JWT: {
          draft.jwt_token = action.data;
          return draft;
        }
  
        default: {
          return draft;
        }
      }
    }, state);
  
    const nextState = producer(state, action);
    console.log("Redux action:", action, "Updated state:", nextState);
    return nextState;
  }
  