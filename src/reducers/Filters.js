import {
    DATASET_FILTERS_ALL_INFO_PROCESS, DATASET_FILTERS_ALL_ERROR_PROCESS
} from "../constants/FilterTypes";

const initialSubjectDetailsState ={
    filters: null,
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case DATASET_FILTERS_ALL_INFO_PROCESS:
            return {...state, filters: action.payload}
        case DATASET_FILTERS_ALL_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
        }
}