import {
    USER_FILTER_INFO_PROCESS, USER_FILTER_ERROR_PROCESS
} from "../constants/FilterTypes";

const initialSubjectDetailsState ={
    filters: null,
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
switch (action.type){
    case USER_FILTER_INFO_PROCESS:
        return {...state, filters: action.payload}
    case USER_FILTER_ERROR_PROCESS:
        return {...state, error: action.payload}
    default:
        return state
}
}