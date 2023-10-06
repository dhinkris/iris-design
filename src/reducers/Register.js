import {
    REGISTER_PROCESS, REGISTER_REJECTED
} from "../constants/LoginActionTypes";

const initialLoginState = {
    subjectAuthInfo: null,
    error: null
}
export default function reducer(state=initialLoginState, action) {
    switch (action.type) {
        case REGISTER_PROCESS:
            return {...state, subjectAuthInfo: action.payload}
        case REGISTER_REJECTED:
            return {...state, error: action.payload}
        default:
            return state
    }
}