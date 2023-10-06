import { FILE_UPLOAD_INFO_PROCESS, FILE_UPLOAD_ERROR_PROCESS,
    CREATE_WORKSPACE_INFO_PROCESS, CREATE_WORKSPACE_ERROR_PROCESS,
    EXECUTE_PIPELINE_INFO_PROCESS, EXECUTE_PIPELINE_ERROR_PROCESS,
    USER_PIPELINE_INFO_PROCESS, USER_PIPELINE_ERROR_PROCESS      ,
    USER_PIPELINE_byID_INFO_PROCESS, USER_PIPELINE_byID_ERROR_PROCESS  
} from "../constants/UserProcessingTypes";


const initialSubjectDetailsState = {
    fileUpload: null,
    workspace: null,
    pipelineExecute: null,
    pipelineStatusAll: null,
    pipelineStatusById: null,
    error: null
}

export default function reducer(state = initialSubjectDetailsState, action) {
    switch (action.type) {
        case FILE_UPLOAD_INFO_PROCESS:
            return { ...state, fileUpload: action.payload }
        case FILE_UPLOAD_ERROR_PROCESS:
            return { ...state, error: action.payload }

        case CREATE_WORKSPACE_INFO_PROCESS:
            return { ...state, workspace: action.payload }
        case CREATE_WORKSPACE_ERROR_PROCESS:
            return { ...state, error: action.payload }

        case EXECUTE_PIPELINE_INFO_PROCESS:
            return { ...state, pipelineExecute: action.payload }
        case EXECUTE_PIPELINE_ERROR_PROCESS:
            return { ...state, error: action.payload }

        case USER_PIPELINE_INFO_PROCESS:
            return { ...state, pipelineStatusAll: action.payload }
        case USER_PIPELINE_ERROR_PROCESS:
            return { ...state, error: action.payload }

        case USER_PIPELINE_byID_INFO_PROCESS:
            return { ...state, pipelineStatusById: action.payload }
        case USER_PIPELINE_byID_ERROR_PROCESS:
            return { ...state, error: action.payload }
        default:
            return state
    }
}