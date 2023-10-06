import Paper from '@material-ui/core/Paper';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { EyeOutlined } from '@ant-design/icons';
import _ from 'lodash';
import styles from '../../../../style/index'
import * as AllActions from "../../../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Table, Popover, Statistic, Tabs} from 'antd';
import residuals from '../../../../data/roi_residuals';
import SimpleChart from '../../../Charts/Helper/SimpleChart'
import LineChart from '../../../Charts/Elements/LineChart';

const { TabPane } = Tabs;

class ROI extends React.Component{

    state={
        measures: []
    }
    handleComment = () =>{
        return
    }
    // componentWillReceiveProps(nextProps){
    //     this.setState({refresh: nextProps.refresh})
    // }

    async componentDidMount(){
        await this.props.actions.getDatasetMeasure(this.props.basicInfo.ImagingScanDetails._id)
        await this.props.actions.getResiduals()

        let measures = await this.props.dataExplorer.measures
        measures = _.uniqBy(measures, v => v.ImagingMetrics ? [v.ImagingMetrics.modality, v.ImagingMetrics.metricType].join() :null)
        this.setState({ measures: measures, residuals: this.props.residuals})
        
    }
    handleColor = (volumeData, roi) => {
        // Equation of polynomail function: b0+b1*x+b2*x*x
        var volume = volumeData[roi]
        var ga = volumeData['GA']
        if (residuals[roi] !==undefined){
            var upper_limit=residuals[roi]['b0_l'] + (residuals[roi]['b1_l']*ga)+(residuals[roi]['b2_l']*ga*ga)
            var lower_limit=residuals[roi]['b0_u'] + (residuals[roi]['b1_u']*ga)+(residuals[roi]['b2_u']*ga*ga)
            var normal_limit=residuals[roi]['b0'] + (residuals[roi]['b1']*ga)+(residuals[roi]['b2']*ga*ga)
            var difference=normal_limit-volume
            if ( volume>upper_limit  || volume<lower_limit ){
                return {"color":"red", "dev":Math.round(difference/normal_limit*100*100)/100}
            }
            else{
                return {"color":"white", "dev":Math.round(difference/normal_limit*100*100)/100}
            }
        }
        return {"color":"white", "dev":"NA"}
    }
    render(){
        const { classes, basicInfo } = this.props
        let { measures, residuals } = this.state
        
        const columns=[
            {
                dataIndex: 'name',
                key:'name'
                
            },
            {
                dataIndex: 'value',
                name:'value',
                render: obj => <p>{obj!==0? Number.parseFloat(obj).toFixed(2): null}</p>
            },
            {
                dataIndex: 'metricType',
                name:'metricType',
                render: obj => <p>{obj==='volume'? " cc": obj==='surface'? " no unit ":null}</p>
            },
            {
                dataIndex: ['metricType', 'modality', 'organ','type', 'roi'],
                key: ['metricType', 'modality', 'organ','type', 'roi'],
                render: (text, metrics, index) => (<Popover  trigger="click" placement="left" content={<div style={{width: 500 }}><LineChart {...metrics} {...residuals} /></div>}> <EyeOutlined /> </Popover>)
            }
        ]
        return(
            <>
                
                <h3> Metrics </h3>
                {
                    ((measures !== null) && (measures!==undefined))?
                        <>
                            <Tabs>
                            {
                                measures.map((_measure, index)=>{
                                    if (_measure.ImagingMetrics){
                                        let data = _measure.ImagingMetrics.metrics.map((obj, index)=> {
                                            obj['metricType'] = _measure.ImagingMetrics.metricType
                                            obj['modality'] = _measure.ImagingMetrics.modality
                                            obj['organ'] = _measure.ImagingMetrics.organ
                                            obj['type'] = _measure.ImagingScanDetails.type
                                            obj['gestationalAgeAtScan'] = _measure.ImagingScanDetails.gestationalAgeAtScan
                                            return obj
                                        })
                                        return(
                                            <TabPane tab={_measure.ImagingMetrics.organ+' | '+_measure.ImagingMetrics.metricType+' | '+_measure.ImagingMetrics.modality} key={index}>
                                                <Table rowKey={dataSource => dataSource.index} pagination={{ pageSize: 5 }} columns={columns} dataSource={data}/>
                                            </TabPane>
                                        )
                                    } else {
                                        return(<p>No data</p>)
                                    }
                                })
                            }
                            </Tabs>
                        </>: <p>No data</p>
                }
            </>
        )
    }
}

ROI.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (withStyles(styles)(ROI));
