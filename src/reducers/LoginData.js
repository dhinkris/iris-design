import {
    LOGIN_FULFILLED, LOGIN_PROCESS, LOGIN_REJECTED, PASSWORD_REQUIRED, PASSWORD_VALIDATE_ERROR, EMAIL_REQUIRED, EMAIL_VALIDATE_ERROR, LOGIN_RESTORE, LOGOUT
} from "../constants/LoginActionTypes";

const initialLoginState = {
    subjectAuthInfo: null,
    error: null
}
export default function reducer(state=initialLoginState, action) {
    switch (action.type) {
        case LOGIN_FULFILLED:
            return {...state, subjectAuthInfo: action.payload}
        case LOGIN_REJECTED:
            return {...state, error: action.payload}
        default:
            return state
    }
}