import {
    USER_COMMENTS_INFO_PROCESS, USER_COMMENTS_ERROR_PROCESS
} from "../constants/UserTypes";

const initialUserCommentsState ={
    comments: null,
    error: null
}

export default function reducer(state=initialUserCommentsState, action) {
switch (action.type){
    case USER_COMMENTS_INFO_PROCESS:
        return {...state, comments: action.payload}
    case USER_COMMENTS_ERROR_PROCESS:
        return {...state, comments:[], error: action.payload}
    default:
        return state
}
}