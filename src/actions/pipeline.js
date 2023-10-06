import axios from "axios";
import * as userProcessTypes from '../constants/UserProcessingTypes';

export function createWorkspace(file) {
    return async function (dispatch) {
        await axios.get('/user/pipeline/createworkspace')
            .then((response) => {
                dispatch({
                    type: userProcessTypes.CREATE_WORKSPACE_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userProcessTypes.CREATE_WORKSPACE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}


export function uploadFile(file, tmpdir) {
    axios.defaults.headers['Accept'] = 'multipart/form-data'
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return async function (dispatch) {
        await axios.post('/file/uploadfile', file, 'file')
            .then((response) => {
                dispatch({
                    type: userProcessTypes.FILE_UPLOAD_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userProcessTypes.FILE_UPLOAD_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function executeCommand(command) {
    return async function (dispatch) {
        await axios.post('/pipeline/executecommand', command)
            .then((response) => {
                dispatch({
                    type: userProcessTypes.EXECUTE_PIPELINE_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userProcessTypes.EXECUTE_PIPELINE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function getUserPipelineStatus() {
    return async function (dispatch) {
        await axios.get('/pipeline/userpipeline')
            .then((response) => {
                dispatch({
                    type: userProcessTypes.USER_PIPELINE_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userProcessTypes.USER_PIPELINE_INFO_PROCESS,
                    payload: err
                })
            })
    }
}

export function getUserPipelineStatusById(id) {
    return async function (dispatch) {
        await axios.get('/pipeline/userpipeline/'+id)
            .then((response) => {
                dispatch({
                    type: userProcessTypes.USER_PIPELINE_byID_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userProcessTypes.USER_PIPELINE_byID_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

