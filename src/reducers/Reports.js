import {
    USER_REPORTS_SAVE_INFO_PROCESS,
    USER_REPORTS_SAVE_ERROR_PROCESS,
    USER_REPORTS_GET_INFO_PROCESS,
    USER_REPORTS_GET_ERROR_PROCESS,
    USER_REPORTS_DELETE_INFO_PROCESS,
    USER_REPORTS_DELETE_ERROR_PROCESS
} from '../constants/ResidualTypes'

const initialFetchFileState ={
    fetchedReportsData: null,
    reports: null,
    userReport: null,
    header: null,
    title: null,
    description: null,
    error: null
}

export default function reducer(state=initialFetchFileState, action) {
    switch (action.type) {
        case USER_REPORTS_SAVE_INFO_PROCESS:
            return {...state, reports: action.payload, error: null,  title: 'Success', description: 'Report successfully saved'}
        case USER_REPORTS_SAVE_ERROR_PROCESS:
            return {...state, error: action.payload,  title: 'error', description: 'Unable to save report'}
        case USER_REPORTS_GET_INFO_PROCESS:
            return {...state, userReport: action.payload, error: null, title: 'Success', description: 'Report successfully saved'}
        case USER_REPORTS_GET_ERROR_PROCESS:
            return {...state, error: action.payload, title: 'Error', description: 'Unable to retrieve data'}
        case USER_REPORTS_DELETE_INFO_PROCESS:
            return {...state, header: action.payload.msg, error: null, title: 'Success', description: 'Report successfully deleted'}
        case USER_REPORTS_DELETE_ERROR_PROCESS:
            return {...state, error: action.payload, header: action.payload.msg, title: 'Error', description: 'Unable to delete report'}
        default:
            return state
    }
}