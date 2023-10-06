import {
    QUERY_INFO_PROCESS,
    QUERY_ERROR_PROCESS
} from "../constants/QueryActionTypes";

const initialQueriedSubjectDataState ={
    queriedSubjectData: null,
    error: null
}

export default function reducer(state=initialQueriedSubjectDataState, action) {
    switch (action.type) {
        case QUERY_INFO_PROCESS:
            return {...state, queriedSubjectData: action.payload}
        case QUERY_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}
