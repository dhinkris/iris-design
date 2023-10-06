import React from 'react';
import LineChart from "../Elements/LineChart";
import {Col} from "antd";
import residual from '../../../data/roi_residuals'
import _ from "lodash";

const SimpleChart =(props) => {
    console.log(props)
    // return(
    //     <LineChart key={props.params.name} 
    //                 referencedDot={[{x: Math.floor(props.params.gestational_age), y: Math.floor(props.params.value)}]}
    //                 toPlot={residual.rois[0].residuals[props.params.name]} 
    //                 title={props.params.name}/>
    // )
}
export default SimpleChart
