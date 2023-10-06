import { ALL_USERS_INFO_PROCESS, ALL_USERS_ERROR_PROCESS } from "../constants/UserTypes";

const initialSubjectDetailsState ={
    userDetails:[],
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case ALL_USERS_INFO_PROCESS:
            return {...state, userDetails: action.payload}
        case ALL_USERS_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}