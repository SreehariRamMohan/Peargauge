import {SAMPLE_ACTION, SET_JWT} from "./constants"

export function test_redux(data) {
    return {
        type: SAMPLE_ACTION,
        data: data
    }
}

export function set_jwt_token(token) {
    return {
        type: SET_JWT,
        data: token
    }
}