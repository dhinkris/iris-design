import { RESIDUALS_INFO_PROCESS, RESIDUALS_ERROR_PROCESS} from "../constants/ResidualTypes";

const initialSubjectDetailsState ={
    residuals: null
}

export default function reducer(state=initialSubjectDetailsState, action) {
    switch (action.type){
        case RESIDUALS_INFO_PROCESS:
            return {...state, residuals: action.payload}
        case RESIDUALS_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}