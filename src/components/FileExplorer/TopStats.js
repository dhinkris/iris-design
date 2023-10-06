import { Card, Col, Row, Statistic, Divider, Space } from "antd";
import React from "react";
import _ from "lodash";


class TopStats extends React.Component {
    handleStats = (dataset) => {
        let rawFiles = []
        
        dataset.map((_data) => {
            if (_data.ImagingFiles) {
                _data.ImagingFiles.filePaths.map((_fp)=> {
                    if (_fp.name==='raw_files'){
                        _fp.value.map((_rfp)=> {
                            rawFiles.push(_rfp.name)
                        })
                    }
                })
            }
        });
        return _.uniq(rawFiles).length
    }
    render() {
        const { dataset } = this.props
        return (
            // <div id="topstats" >
            <>  
                <div style={{ boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 20 }}>
                    <Row justify="center" gutter={24} style={{ marginTop: 10, textAlign: 'center' }}>
                            <Col span={3}>
                                <Statistic title="# of Subjects" value={_.chain(dataset).map('ImagingBasicInfo._id').uniq().value().length} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Col span={3}>
                                <Statistic title="# of Scans" value={_.chain(dataset).map('ImagingScanDetails._id').uniq().value().length} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Divider type="vertical" style={{ height: '5em' }} />
                            <Col span={3}>
                                <Statistic title="# of Fetal scans" value={_.chain(_.filter(dataset, (data)=> data.ImagingScanDetails.type==='fetal')).map('ImagingScanDetails._id').uniq().value().length} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Col span={3}>
                                <Statistic title="# of Neonatal scans" value={_.chain(_.filter(dataset, (data)=> data.ImagingScanDetails.type==='neonatal')).map('ImagingScanDetails._id').uniq().value().length} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Divider type="vertical" style={{ height: '5em' }} />
                            <Col span={3}>
                                <Statistic title="# of Fetal brain sequences" value={this.handleStats(_.filter(dataset, (data)=> data.ImagingFiles?data.ImagingFiles.organ==='brain' && data.ImagingScanDetails.type==='fetal':null))} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Col span={4}>
                                <Statistic title="# of Newborn brain sequences" value={this.handleStats(_.filter(dataset, (data)=> data.ImagingFiles?data.ImagingFiles.organ==='brain' && data.ImagingScanDetails.type==='neonatal':null))} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Col span={3}>
                                <Statistic title="# of Placenta sequences" value={this.handleStats(_.filter(dataset, (data)=> data.ImagingFiles?data.ImagingFiles.organ==='placenta':null))} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                    </Row>
                </div>
            </>
        )
    }
}

export default TopStats;


