import axios from "axios";
import * as filterTypes from '../constants/FilterTypes';

import serverConfig from '../configs/config';

import { notification } from 'antd';

axios.defaults.baseURL = 'http://'+ serverConfig.ST.nodeRequest.server.host +':'+ serverConfig.ST.nodeRequest.server.port + '/' + serverConfig.ST.nodeRequest.server.entry
axios.defaults.headers.post['Content-Type'] = serverConfig.ST.nodeRequest.server.requestContentType;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

export function getUserFilters(){
    return async function(dispatch) {
        await axios.get('/user/filter/')
            .then((response) => {
                dispatch({
                    type: filterTypes.USER_FILTER_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: filterTypes.USER_FILTER_ERROR_PROCESS,
                    payload: err
                })
            })
    }
}

// export function addUserFilters(filters){
//     return async function(dispatch) {
//         await axios.post('/user/filter/', {})
//             .then((response) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//             .catch((err) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//     }
// }

// export function deleteUserFilters(filters){
//     return async function(dispatch) {
//         await axios.post('/user/filter/', {})
//             .then((response) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//             .catch((err) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//     }
// }

// export function updateUserFilters(filters){
//     return async function(dispatch) {
//         await axios.post('/user/filter/', {})
//             .then((response) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//             .catch((err) => {
//                 notification[response.data.status] ({
//                     message: response.data.msg,
//                 })
//             })
//     }
// }