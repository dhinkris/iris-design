import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Skeleton, Switch, Card, Avatar, Radio, Input, Row, Col, Button} from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import canvas2pdf from 'canvas2pdf';
import fs from 'fs';
import * as Blob from 'blob';
import FileSaver from 'file-saver'
import LineChart from '../Elements/LineChart';
import SubjectDetails from '../Elements/SubjectDetails';
import * as AllActions from "../../../actions";
import _ from 'lodash'

const { Meta } = Card;
const Search = Input.Search;

class FetalGrowth extends Component {
    handlePrint=() => {
        var toPrint = document.getElementById('graphArea');
        html2canvas(toPrint)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF();
                pdf.setDisplayMode( "300%", "continuous", "FullScreen")
                pdf.addImage(imgData, 'JPEG', 0,0);
                pdf.addPage()
                pdf.addImage(imgData, 'JPEG', 0,0);


                pdf.save("downloaded.pdf");
            })
    }

    render() {
        const { toLoad, subjectID, roiValues, updateFlag } = this.props
        return (
            <div id="graphArea" style={{
                background: '#f3f3f3', padding: 24, margin: 24
            }}>
                <Button onClick={this.handlePrint}>Download Page</Button>
                <h3> Subject ID: {subjectID}</h3>
                <div >
                    {
                        this.props.subjectToPlot && this.props.subjectToPlot!==null? <div  style={{ marginTop: 16 }}>
                            <Row gutter={24}>
                                <Col span={24}  style={{
                                    background: '#ffffff', padding: 24
                                }}><SubjectDetails data={'test'}/></Col>
                            </Row>
                        </div>:null
                    }
                    <div style={{ marginTop: 16 }}>
                        <Row gutter={24}>
                            {
                                Object.keys(toLoad.residuals).map((roi) => {
                                    var title =_.find(toLoad.variables, (lab)=>{return lab.constant === roi}).label
                                    let toPlot = []
                                    roiValues.map((_roi) => {
                                        let toPlotObj = {}
                                        const GA = _roi['gestational_age']
                                        const volume = _roi[roi]
                                        toPlotObj.x = GA
                                        toPlotObj.y = volume
                                        toPlot.push(toPlotObj)
                                    })
                                    return (<Col  style={{padding: 80}} span={8} ><LineChart referencedDot={toPlot} toPlot={toLoad.residuals[roi]} title={title}/></Col>)
                                })
                            }
                        </Row>
                    </div>
                </div>
            </div>
        );
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
) (FetalGrowth);

