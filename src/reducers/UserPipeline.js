import {USER_PIPELINE_INFO_PROCESS, USER_PIPELINE_ERROR_PROCESS} from "../constants/UserPipelineTypes";

const initialSubjectDetailsState ={
    error: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case USER_PIPELINE_INFO_PROCESS:
            return {...state, pipelineList: action.payload}
        case USER_PIPELINE_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}