import {DATASET_INFO_PROCESS, DATASET_ERROR_PROCESS,
        DATASET_BASICINFO_BY_ID_INFO_PROCESS, DATASET_BASICINFO_BY_ID_ERROR_PROCESS,
        DATASET_MEASURES_BY_ID_INFO_PROCESS, DATASET_MEASURES_BY_ID_ERROR_PROCESS,
        DATASET_FILEPATHS_BY_ID_INFO_PROCESS, DATASET_FILEPATHS_BY_ID_ERROR_PROCESS,
        // DATASET_FILTERS_ALL_INFO_PROCESS, DATASET_FILTERS_ALL_ERROR_PROCESS
    } from "../constants/DatasetType";

const initialSubjectDetailsState ={
    dataset: null,
    basicInfo: null,
    measures: null,
    filepaths: null,
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case DATASET_INFO_PROCESS:
            return {...state, dataset: action.payload}
        case DATASET_ERROR_PROCESS:
            return {...state, error: action.payload}
        case DATASET_BASICINFO_BY_ID_INFO_PROCESS:
            return {...state, basicInfo: action.payload}
        case DATASET_BASICINFO_BY_ID_ERROR_PROCESS:
            return {...state, error: action.payload}
        case DATASET_MEASURES_BY_ID_INFO_PROCESS:
            return {...state, measures: action.payload}
        case DATASET_MEASURES_BY_ID_ERROR_PROCESS:
            return {...state, error: action.payload}
        case DATASET_FILEPATHS_BY_ID_INFO_PROCESS:
            return {...state, filepaths: action.payload}
        // case DATASET_FILTERS_ALL_INFO_PROCESS:
        //     return {...state, filters: action.payload}
        // case DATASET_FILTERS_ALL_ERROR_PROCESS:
        //     return {...state, error: action.payload}
        case DATASET_FILEPATHS_BY_ID_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}