import {
    SUBJECT_ALL_ROIS_INFO_PROCESS, SUBJECT_ALL_ROIS_ERROR_PROCESS,
    SUBJECT_ROIS_INFO_PROCESS, SUBJECT_ROIS_ERROR_PROCESS,
    SUBJECT_FILES_INFO_PROCESS, SUBJECT_FILES_ERROR_PROCESS,
    SUBJECT_ALL_FILES_INFO_PROCESS, SUBJECT_ALL_FILES_ERROR_PROCESS,
    SUBJECT_ALL_COMMENTS_INFO_PROCESS, SUBJECT_ALL_COMMENTS_ERROR_PROCESS,
    SUBJECT_COMMENTS_POST_PROCESS, SUBJECT_COMMENTS_POST_ERROR_PROCESS} from '../constants/DatasetType';

const initialSubjectDataState ={
    subjectFileData: null,
    subjectROIData: null,
    subjectCommentData: null,
    subjectCommentPost: null,
    error: null
}

export default function reducer(state=initialSubjectDataState, action) {
    switch (action.type){
        case SUBJECT_ALL_ROIS_INFO_PROCESS:
            return {...state, subjectROIData: action.payload}
        case SUBJECT_ROIS_INFO_PROCESS:
            return {...state, subjectROIData: action.payload}
        case SUBJECT_ALL_FILES_INFO_PROCESS:
            return {...state, subjectFileData: action.payload}
        case SUBJECT_FILES_INFO_PROCESS:
            return {...state, subjectFileData: action.payload}
        case SUBJECT_ALL_COMMENTS_INFO_PROCESS:
            return {...state, subjectCommentData: action.payload}
        case SUBJECT_COMMENTS_POST_PROCESS:
            return {...state, subjectCommentPost: action.payload}

        case SUBJECT_ALL_ROIS_ERROR_PROCESS:
            return {...state, error: action.payload}
        case SUBJECT_ROIS_ERROR_PROCESS:
            return {...state, error: action.payload}
        case SUBJECT_ALL_FILES_ERROR_PROCESS:
            return {...state, error: action.payload}
        case SUBJECT_FILES_ERROR_PROCESS:
            return {...state, error: action.payload}
        case SUBJECT_ALL_COMMENTS_ERROR_PROCESS:
            return {...state, error: action.payload}
        case SUBJECT_COMMENTS_POST_ERROR_PROCESS:
            return {...state, error: action.payload}
        default:
            return state
    }
}