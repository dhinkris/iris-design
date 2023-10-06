import {
    FILE_DOWNLOAD_ERROR_PROCESS,
    FILE_DOWNLOAD_INFO_PROCESS,
    FILE_UPLOAD_INFO_PROCESS,
    FILE_UPLOAD_ERROR_PROCESS,
    FILE_HEADER_INFO_PROCESS,
    FILE_HEADER_ERROR_PROCESS,
} from '../constants/NiftiFileTypes';

const initialFetchFileState ={
    fetchedData: null,
    header: null,
    error: null
}

export default function reducer(state=initialFetchFileState, action) {
    switch (action.type) {
        case FILE_DOWNLOAD_INFO_PROCESS:
            return {...state, fetchedData: action.payload}
        case FILE_DOWNLOAD_ERROR_PROCESS:
            return {...state, error: action.payload}
        case FILE_UPLOAD_INFO_PROCESS:
            return {...state, fetchedData: action.payload}
        case FILE_UPLOAD_ERROR_PROCESS:
            return {...state, error: action.payload}
        case FILE_HEADER_INFO_PROCESS:
            return {...state, header: action.payload}
        case FILE_HEADER_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}
