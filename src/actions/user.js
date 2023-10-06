import axios from "axios";
import * as userTypes from '../constants/UserTypes';
import serverConfig from '../configs/config';
import { notification } from 'antd';

axios.defaults.baseURL = 'http://'+ serverConfig.ST.nodeRequest.server.host +':'+ serverConfig.ST.nodeRequest.server.port + '/' + serverConfig.ST.nodeRequest.server.entry
axios.defaults.headers.post['Content-Type'] = serverConfig.ST.nodeRequest.server.requestContentType;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

export function getAllUsers(){
    return async function (dispatch) {
        await axios.get('/users/all')
            .then((response) => {
                dispatch({
                    type: userTypes.ALL_USERS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userTypes.ALL_USERS_ERROR_PROCESS,
                    payload: err
                })
            })
    } 
}


export function getCommentsByUserId(id) {
    return async function (dispatch) {
        await axios.get('/datasets/comments?userId='+id)
            .then((response) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function getCommentsByRefId(id) {
    return async function (dispatch) {
        await axios.get('/datasets/comments?refId='+id)
            .then((response) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function addComments(id, comment) {
    return async function (dispatch) {
        await axios.post('/datasets/comments/', {refId:id, text: comment})
            .then((response) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_ADD_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

export function deleteComments(id) {
    return async function (dispatch) {
        await axios.delete('/datasets/comments/'+id)
            .then((response) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_DELETE_PROCESS,
                    payload: response.data
                })
                notification[response.data.status] ({
                    message: response.data.msg,
                })
            })
            .catch((err) => {
                dispatch({
                    type: userTypes.USER_COMMENTS_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}
