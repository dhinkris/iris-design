import {EXECUTE_PIPELINE_ERROR_PROCESS, EXECUTE_PIPELINE_ERROR_PROCESSS} from "../constants/UserPipelineTypes";

const initialSubjectDetailsState ={
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case EXECUTE_PIPELINE_INFO_PROCESS:
            return {...state, executeResponse: action.payload}
        case EXECUTE_PIPELINE_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}