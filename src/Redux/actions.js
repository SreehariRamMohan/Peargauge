import {SAMPLE_ACTION} from "./constants"

export function test_redux(data) {
    return {
        type: SAMPLE_ACTION,
        data: data
    }
}