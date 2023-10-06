import { combineReducers } from 'redux'
import dataset from './Dataset'
import subjectData from './SubjectData'
import register from './Register'
import loginData from './LoginData'
import queriedSubjectData from './QueriedSubjectData'
import getFile from './FetchFiles'
import reports from './Reports'
import userDetails from './UserDetails'
// import userpipeline from './UserPipeline'
import userFilters from './UserFilters'
import userComments from './UserComments'
import residuals from './Residuals'
import userProcess from './UserProcess'
import filters from './Filters'
// Combined all reducers.
const rootReducer = combineReducers({
    register: register,
    loginData: loginData,
    dataExplorer: dataset,
    userFilters: userFilters,
    subjectData: subjectData,
    queriedSubjectData: queriedSubjectData,
    getFile: getFile,
    reports: reports,
    userDetails:userDetails,
    // userpipeline: userpipeline,
    userComments: userComments,
    userProcess: userProcess,
    residuals,
    filters
})

export default rootReducer