import axios from "axios";
import * as fileTypes from '../constants/NiftiFileTypes';
import * as reportTypes from '../constants/ReportsTypes';
import * as pipelineTypes from '../constants/UserPipelineTypes';
import * as executeTypes from '../constants/ExecutePipelineTypes';
import { notification } from 'antd';

export function getFile(filename) {
    return async function (dispatch) {
        await axios.get('/imaging/readfile?filename='+filename)
            .then((response) => {
                dispatch({
                    type: fileTypes.FILE_DOWNLOAD_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: fileTypes.FILE_DOWNLOAD_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function getNiftiFile(filename) {
    return async function (dispatch) {
        await axios.get('/imaging/niftifile?filename='+filename)
            .then((response) => {
                dispatch({
                    type: fileTypes.FILE_DOWNLOAD_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: fileTypes.FILE_DOWNLOAD_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function fetchNiftiHeader(filename) {
    return async function (dispatch) {
        let bodyObj ={
            filename: filename,
        }
        await axios.post('/misc/getniftifileheader', bodyObj)
            .then((response) => {
                dispatch({
                    type: fileTypes.FILE_HEADER_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: fileTypes.FILE_HEADER_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function saveUserReport(reportinfo) {
    return async function (dispatch) {
        let bodyObj ={
            reportinfo: reportinfo,
        }
        await axios.post('/reports/savereport', bodyObj)
            .then((response) => {
                dispatch({
                    type: reportTypes.USER_REPORTS_POST_PROCESS,
                    payload: response
                })
                notification[response.data.status] ({
                    message: response.data.msg,
                })
            })
            .catch((err) => {
                dispatch({
                    type: reportTypes.USER_REPORTS_POST_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function getUserPipelineDetails(){
    return async function(dispatch){

        await axios.get('/pipeline/userpipeline')
            .then((response) => {
                dispatch({
                    type: pipelineTypes.USER_PIPELINE_INFO_PROCESS,
                    payload: response.data
                })

            })
            .then((err)=>{
                dispatch({
                    type: pipelineTypes.USER_PIPELINE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function executePipelineDetails(commandsToExecute){
    return async function(dispatch){
        let bodyObj = {
            commandsToExecute: commandsToExecute
        }
        await axios.post('/pipeline/runbatchjobs', bodyObj)
            .then((response) => {
                dispatch({
                    type: executeTypes.EXECUTE_PIPELINE_INFO_PROCESS,
                    payload: response.data
                })
                notification[response.data[0].status] ({
                    message: response.data[0].msg,
                })

            })
            .then((err)=>{
                dispatch({
                    type: executeTypes.EXECUTE_PIPELINE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}
