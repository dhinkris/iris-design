import axios from "axios";
import * as loginTypes from '../constants/LoginActionTypes';
import * as pageTypes from '../constants/PageActionTypes';
import serverConfig from '../configs/config';

import { notification } from 'antd';

axios.defaults.baseURL = 'http://'+ serverConfig.ST.nodeRequest.server.host +':'+ serverConfig.ST.nodeRequest.server.port + '/' + serverConfig.ST.nodeRequest.server.entry
axios.defaults.headers.post['Content-Type'] = serverConfig.ST.nodeRequest.server.requestContentType;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

export function loginUser(userName, password) {
    return async function (dispatch) {
        dispatch({
            type: loginTypes.LOGIN_PROCESS
        });
        dispatch({
            type: pageTypes.THEME_CHANAGE,
            payload: {
                status: false
            }
        });
        dispatch({
            type: pageTypes.DRAWER_STATUS,
            payload: {
                status: true
            }
        });
        var requestBody = {
            userName: userName,
            password: password
        };
        await axios.post('auth/', requestBody)
            .then((response) => {
                let token = response.data.token;
                axios.defaults.headers.common['x-access-token'] = token;
                if (token) {
                    dispatch({
                        type: loginTypes.LOGIN_FULFILLED,
                        payload: {
                            userName: userName,
                            password: password,
                            token: token,
                            body: response.data.body,
                            action: true,
                        }
                    })
                    notification['success'] ({
                        message: response.data.message,
                    })
                } else {
                    dispatch({
                        type: loginTypes.LOGIN_REJECTED,
                        payload: (response.data.msg ? response.data.msg : "Error while logged in by user")
                    })
                    notification[response.data.status] ({
                        message: response.data.msg,
                    })
                }
            })
            .catch((err) => {
                notification['error'] ({
                    message: err.response.data.message,
                })
                dispatch({
                    type: loginTypes.LOGIN_REJECTED,
                    payload: err.response
                })
            })
    }
}

export function registerUser(userdetails) {
    var bodyObj ={
        userdetails
    }
    return async function(dispatch) {
        await axios.post('/register', bodyObj)
            .then((response) => {
                if (response.data.status === 'success'){
                    dispatch({
                        type: loginTypes.REGISTER_PROCESS,
                        payload: response
                    })
                    notification[response.data.status] ({
                        message: response.data.msg,
                    })
                }
                if (response.data.status === 'error'){
                    dispatch({
                        type: loginTypes.REGISTER_REJECTED,
                        payload: response
                    })
                    notification[response.data.status] ({
                        message: response.data.msg,
                    })
                }
            })
            .catch((err) => {
                dispatch({
                    type: loginTypes.REGISTER_REJECTED,
                    payload: err
                })
            })
    }
}
export function validateToken(token){
    return async function(dispatch) {
        await axios.get('/validatetoken?token='+token)
            .then((response) => {
                dispatch({
                    type: loginTypes.LOGIN_FULFILLED,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: loginTypes.LOGIN_REJECTED,
                    payload: err
                })
            })
    }
}
