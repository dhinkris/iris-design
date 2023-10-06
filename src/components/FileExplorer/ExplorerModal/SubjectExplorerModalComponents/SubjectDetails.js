import React from 'react';
import * as AllActions from "../../../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { Descriptions } from "antd";

import _ from 'lodash';
import residuals from '../../../../data/roi_residuals';

class SubjectDetails extends React.Component{

    state={
        refresh:false
    }
    handleComment = () =>{
        return
    }
    componentDidMount (){
        
    }
    render(){
        const { classes, basicInfo, refresh } = this.props;
        // const subjectDetails=_.filter(this.props.subjectList.subjectList, (list)=>{return list.sname===this.props.subjectToShow.sname})
        const columns=[
            {
                dataIndex: 'name',
                key:'name'
            },
            {
                dataIndex: 'value',
                key:'value'
            }
        ]


        // if (subjectDetails===null || subjectDetails === undefined ){
        //     return(null)
        // } else{

            // var dataSource = Object.keys(basicInfo).map((keys) => {
            //     Object.keys(basicInfo[keys]).map((_keys) =>{
            //         console.log({
            //             "name":_keys,
            //             "value":basicInfo[keys][_keys]
            //         })
            //     })
            // })
            return(
                <React.Fragment>
                    <Descriptions title = "Scan Details">
                        <Descriptions.Item label="Study ID">{basicInfo.ImagingScanDetails.scanId}</Descriptions.Item>
                        <Descriptions.Item label="Scan Number">{basicInfo.ImagingScanDetails.scanNumber}</Descriptions.Item>
                        <Descriptions.Item label="Group">{basicInfo.ImagingBasicInfo.studyName.name}</Descriptions.Item>
                        <Descriptions.Item label="Type">{basicInfo.ImagingScanDetails.type}</Descriptions.Item>
                        <Descriptions.Item label="Gestational age">{basicInfo.ImagingScanDetails.gestationalAgeAtScanString}</Descriptions.Item>
                        <Descriptions.Item label="Condition">{basicInfo.ImagingBasicInfo.condition}</Descriptions.Item>
                        <Descriptions.Item label="Study name">{basicInfo.ImagingBasicInfo.studyName.name}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{basicInfo.ImagingBasicInfo.gender}</Descriptions.Item>
                        <Descriptions.Item label="Diagnosis"></Descriptions.Item>
                    </Descriptions>
                </React.Fragment>
            )
        }
}

const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (SubjectDetails);
