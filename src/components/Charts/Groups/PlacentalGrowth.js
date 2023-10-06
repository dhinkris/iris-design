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

const { Meta } = Card;
const Search = Input.Search;

class FetalGrowth extends React.Component {
    handlePrint=() => {
        const toPrint = document.getElementById('graphArea');
        var file = new File([toPrint], "out.png", {type:'image/png'})
        FileSaver.saveAs(file)
        // canvas.toBlob(function(blob){
        //     FileSaver.saveAs(blob, 'out.png')
        // })
        html2canvas(toPrint)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')
                var file = new File([imgData], "out.png", {type:'image/png'})
                FileSaver.saveAs(file)
                // var blob = new Blob(canvas, {type:'image/png'})
                //
                // FileSaver.saveAs(imgData, 'out.png');
                // // const imgData = canvas.toDataURL('image/png');
                // const pdf = new jsPDF();
                // pdf.addImage(imgData, 'JPEG', 0,0);
                // pdf.save("downloaded.pdf");
            })
    }
    render() {
        return (
            <div style={{
                background: '#f3f3f3', padding: 24, margin: 24
            }}>
                <div id ="graphArea">
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
                            <Col span={8} ><LineChart toPlot='placenta_volume' y_lower_limit = {0} y_upper_limit={1750} title='Placenta Volume'/></Col>
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

