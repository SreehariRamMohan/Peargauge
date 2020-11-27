import {SAMPLE_ACTION, SET_JWT, SET_MONGO_ID, SET_USERNAME} from "./constants"

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

export function set_mongo_id(id) {
    return {
        type: SET_MONGO_ID,
        data: id
    }
}

export function set_username(username) {
    return {
        type: SET_USERNAME,
        data: username
    }
}