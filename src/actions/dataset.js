import axios from "axios";
import * as datasetTypes from '../constants/DatasetType';
import * as queryTypes from '../constants/QueryActionTypes';
import * as filterTypes from '../constants/FilterTypes'
import serverConfig from '../configs/config';

import { notification } from 'antd';

axios.defaults.baseURL = 'http://'+ serverConfig.ST.nodeRequest.server.host +':'+ serverConfig.ST.nodeRequest.server.port + '/' + serverConfig.ST.nodeRequest.server.entry
axios.defaults.headers.post['Content-Type'] = serverConfig.ST.nodeRequest.server.requestContentType;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults['resolveWithFullResnse'] = true;

export function getDatasetBasicInfo(){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('datasets/basicinfo/all')
            .then((response) => {
                dispatch({
                    type: datasetTypes.DATASET_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                notification['error'] ({
                    message: err.response.data.message,
                })
                dispatch({
                    type: datasetTypes.DATASET_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getDatasetBasicInfoById(id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('datasets/basicinfo/'+id)
            .then((response) => {
                dispatch({
                    type: datasetTypes.DATASET_BASICINFO_BY_ID_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.DATASET_BASICINFO_BY_ID_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getDatasetMeasure(id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('datasets/measures?_id='+id)
            .then((response) => {
                dispatch({
                    type: datasetTypes.DATASET_MEASURES_BY_ID_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.DATASET_MEASURES_BY_ID_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getDatasetFiles(id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('datasets/filepaths?_id='+id)
            .then((response) => {
                dispatch({
                    type: datasetTypes.DATASET_FILEPATHS_BY_ID_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.DATASET_FILEPATHS_BY_ID_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getAllSubjectROIs(){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('/subject/allsubjectsrois')
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_ROIS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_ROIS_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getAllFilters(){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('/imaging/filter/all')
            .then((response) =>{
                dispatch({
                    type: filterTypes.DATASET_FILTERS_ALL_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: filterTypes.DATASET_FILTERS_ALL_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getFilteredData(filters){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    let body={
        filters: filters
    }
    return async function(dispatch) {
        await axios.post('/datasets/filterdata/', body)
            .then((response) => {
                dispatch({
                    type: datasetTypes.DATASET_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.DATASET_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}
export function getSubjectROIs(subject_id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    let bodyObj = {
        subject_id: subject_id
    }
    return async function(dispatch) {
        await axios.post('/subject/subjectsrois', bodyObj)
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ROIS_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ROIS_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getAllSubjectFile(){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    return async function(dispatch) {
        await axios.get('/subject/allsubjectsfiles')
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_FILES_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_FILES_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getSubjectFile(subject_id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    let bodyObj = {
        subject_id: subject_id
    }
    return async function(dispatch) {
        await axios.post('/subject/subjectsfiles', bodyObj)
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_FILES_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_FILES_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function getSubjectComments(subject_id){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    let bodyObj = {
        subject_id: subject_id
    }
    return async function(dispatch) {
        await axios.post('/subject/comment/getsubjectscomments', bodyObj)
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_COMMENTS_INFO_PROCESS,
                    payload: response.data[0]
                })
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_ALL_COMMENTS_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function addSubjectComments(subject_id, commented_by, text){
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    let bodyObj = {
        sname: subject_id,
        commented_text: text
    }

    return async function(dispatch) {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

        await axios.post('/subject/comment/updatesubjectscomments', bodyObj)
            .then((response) => {
                dispatch({
                    type: datasetTypes.SUBJECT_COMMENTS_POST_PROCESS,
                    payload: response.data
                })
                dispatch(getSubjectComments(subject_id))
            })
            .catch((err) => {
                dispatch({
                    type: datasetTypes.SUBJECT_COMMENTS_POST_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}

export function queryToDownload(subject_list, grouped, params) {
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem('authToken')

    var result=[]
    Object.keys(grouped).map((db) => {
        let bodyObj ={
            subject_id: subject_list,
            db: db,
            params: params
        }
        axios.post('/misc/downloadcsv', bodyObj)
            .then((response) => {
                result.push(response.data)
            })
            .catch((err) => {
                result.push(err)
            })
    })



    return function(dispatch) {
            dispatch({
                type: queryTypes.QUERY_INFO_PROCESS,
                payload: result
            })
    }
}

export function newqueryToDownload(subject_list) {
    var result=[]
    return async function (dispatch) {
        let bodyObj ={
            subject_id: subject_list,
        }
        await axios.post('/misc/downloadcsv', bodyObj)
            .then((response) => {
                dispatch({
                    type: queryTypes.QUERY_INFO_PROCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: queryTypes.QUERY_ERROR_PROCESS,
                    payload: err.response
                })
            })
    }
}