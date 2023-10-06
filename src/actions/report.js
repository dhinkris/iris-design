import axios from "axios";
import * as residualTypes from '../constants/ResidualTypes';
import serverConfig from '../configs/config';
import { notification } from 'antd';

axios.defaults.baseURL = 'http://'+ serverConfig.ST.nodeRequest.server.host +':'+ serverConfig.ST.nodeRequest.server.port + '/' + serverConfig.ST.nodeRequest.server.entry
axios.defaults.headers.post['Content-Type'] = serverConfig.ST.nodeRequest.server.requestContentType;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

export function getResiduals(){
    return async function(dispatch) {
        await axios.get('/reports/nomograms')
            .then((response) => {
                dispatch({
                    type: residualTypes.RESIDUALS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: residualTypes.RESIDUALS_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function saveReport(state){
    return async function(dispatch) {
        await axios.post('/user/reports', {state})
            .then((response) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_SAVE_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_SAVE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function getUserReport(){
    return async function(dispatch) {
        await axios.get('/user/reports')
            .then((response) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_GET_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_GET_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}


export function deleteUserReport(id){
    return async function(dispatch) {
        await axios.delete('/user/reports/'+id)
            .then((response) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_DELETE_INFO_PROCESS,
                    payload: response.data
                })
                // notification[response.data.status] ({
                //     message: response.data,
                // })
            })
            .catch((err) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_DELETE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function shareUserReport(state){
    return async function(dispatch) {
        await axios.post('/user/reports/share', state )
            .then((response) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_SAVE_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: residualTypes.USER_REPORTS_SAVE_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}
