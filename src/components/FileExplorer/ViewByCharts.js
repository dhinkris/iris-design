import { Skeleton, Switch, Card, Avatar } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Input } from 'antd';
import { Row, Col } from 'antd';
import LineChart from '../Charts/Elements/AreaChart'
import BarChart from '../Charts/Elements/BarChart'
import PieChart from '../Charts/Elements/PieChart'
import StackedBarChart from '../Charts/Elements/StackedBarChart'
import DataSet from "@antv/data-set";

import _ from 'lodash';
import Wordcloud from '../Charts/Elements/WordNet';


const { Meta } = Card;
const Search = Input.Search;


class ChartsView extends Component {

    handleGAChart=(dataset, filter)=>{
        dataset = _.filter(_.filter(dataset, data=> data.ImagingScanDetails.type===filter), data => data.ImagingScanDetails.gestationalAgeAtScanString!=="0")
        let attr = 'ImagingScanDetails.gestationalAgeAtScanString'
        var data=[]
        _.filter(Object.keys(_.countBy(_.sortBy(dataset, [attr]), attr)), arr => {
            return arr !== "null"
        }).map((obj)=>{
            var eachObj={}
            eachObj.attr=attr
            eachObj.count=_.countBy(dataset, attr)[obj]
            eachObj.name=obj
            data.push(eachObj)
        })
        data = _.sortBy(data, 'name')
        return data
    }

    handleProjectSubjects = (dataset, uniqBy, filter)=> {
        if(filter){
            dataset = _.filter(dataset, data=> data.ImagingScanDetails.type===filter)
        }
        dataset = _.uniqBy(dataset, uniqBy)
        let attr = 'ImagingBasicInfo.studyName.name'
        var data=[]
        _.filter(Object.keys(_.fromPairs(_.sortBy(_.toPairs(_.countBy(dataset, attr)),1))), arr => {
            return arr !== "null"
        }).map((obj)=>{
            var eachObj={}
            eachObj.attr=attr
            eachObj.count=_.countBy(dataset, attr)[obj]
            eachObj.name=obj
            data.push(eachObj)
        })
        return data
    }

    handleProjectScans = (dataset, filter)=> {
        dataset = _.filter(dataset, data=> data.ImagingScanDetails.type===filter)
        let attr = 'ImagingBasicInfo.studyName.name'
        var data=[]
        _.filter(Object.keys(_.fromPairs(_.sortBy(_.toPairs(_.countBy(dataset, attr)),1))), arr => {
            return arr !== "null"
        }).map((obj)=>{
            let _dataset = _.filter(dataset, data=>data.ImagingBasicInfo.studyName.name==obj)
            let seq ={}
            _.chain(this.props.dataset).map('ImagingFiles.modality').uniq().value().map((studyName)=> {
                seq[studyName]=this.handleCount(_.filter(_dataset, data => { if (data.ImagingFiles) { return data.ImagingFiles.modality === studyName } }))
            })
            var eachObj={
                ...seq,
                "name": obj
            }
            data.push(eachObj)
        })
        return data
    }

    handleCount = (dataset) => {
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

    handleSequenceScans = (dataset, filter)=>{
        dataset = _.filter(dataset, data=> data.ImagingScanDetails.type===filter)
        let attr = 'ImagingFiles.modality'
        var data=[]
        let _ct=0
        Object.keys(_.countBy(dataset, attr)).map((arr)=>{
            var eachObj={}
            eachObj.attr=attr
            eachObj.count = this.handleCount(_.filter(dataset, data => { if (data.ImagingFiles) { return data.ImagingFiles.modality === arr } }))
            eachObj.name=arr
            _ct +=eachObj.count
            data.push(eachObj)
        })
        data = _.filter(_.sortBy(data, 'count'), _data=> _data.name!=="undefined")
        return data
    }
    handleWordCloudDiagnosis=(dataset)=>{
        dataset=_.uniqBy(dataset, (e)=> e.ImagingScanDetails._id)
        let res=[]
        let data=[]
        dataset.map((_data)=> {
            if ((_data.ImagingScanDetails.notes!=="unknown")){
                res.push(_data.ImagingScanDetails.notes.toLowerCase())
            }
        })
        let _res=_.countBy(res)
        Object.keys(_res).map((obj)=>{
            var eachObj={}
            eachObj.value = _res[obj]
            eachObj.text=obj
            data.push(eachObj)
        })
        return data
    }

    handleSubjectDiagnosis=(dataset)=>{
        let data=[]
        dataset = _.uniqBy(dataset, 'ImagingBasicInfo._id')
        Object.keys(_.countBy(dataset, 'ImagingScanDetails.diagnosis')).map(obj => {
            var eachObj={}
            eachObj.count=_.countBy(dataset, 'ImagingScanDetails.diagnosis')[obj]
            eachObj.name=obj
            data.push(eachObj)
        })
        data = _.sortBy(data, 'count')
        return data
    }
    render() {
        return (
            <span style={{
                background: '#fff'
            }}>
                <Row gutter={24}>
                    <BarChart dataset={this.handleGAChart(this.props.dataset, 'fetal')} 
                                title='GA Fetal scans' 
                                xtitle='Gestational age' 
                                ytitle='Count' 
                                span={12}
                                padding={[40,40,40,40]} 
                                scale={{
                                    name: {
                                        min: 0,
                                        max: 65,
                                        tickCount: 10,
                                        // formatter: data=> Math.round(data)
                                    }
                                }} />
                    <BarChart dataset={this.handleGAChart(this.props.dataset, 'neonatal')} 
                                title='GA Neonatal scans' 
                                xtitle='Gestational age' 
                                ytitle='Count' 
                                span={12} 
                                padding={[40,40,40,40]}
                                scale={{
                                    name: {
                                        min: 0,
                                        max: 65,
                                        tickCount: 10,
                                        // formatter: data=> Math.round(data)
                                    }
                                }} />
                    <BarChart dataset={this.handleProjectSubjects(this.props.dataset,'ImagingBasicInfo._id')} title='Subjects across projects' xtitle='Gestational age' ytitle='Count' span={8} transpose={true} padding={[40,40,40,80]}/>
                    <BarChart dataset={this.handleProjectSubjects(this.props.dataset,'ImagingScanDetails._id', 'fetal')} title='Fetal scans across projects' xtitle='Gestational age' ytitle='Count' span={8} transpose={true}  padding={[40,40,40,80]}/>
                    <BarChart dataset={this.handleProjectSubjects(this.props.dataset,'ImagingScanDetails._id', 'neonatal')} title='Neonatal scans across projects' xtitle='Gestational age' ytitle='Count' span={8} transpose={true} padding={[40,40,40,80]}/>
                    <PieChart dataset={this.handleSequenceScans(this.props.dataset, 'fetal')} title='Sequences across Fetal scans' xtitle='Gestational age' ytitle='Count' span={12} transpose={true}/>
                    <PieChart dataset={this.handleSequenceScans(this.props.dataset, 'neonatal')} title='Sequences across Neonatal scans' xtitle='Gestational age' ytitle='Count' span={12} transpose={true}/>
                    <StackedBarChart  dataset ={this.handleProjectScans(this.props.dataset, 'fetal')} title='Sequences across Fetal scans' fields={_.chain(this.props.dataset).map('ImagingFiles.modality').uniq().value()} span={12}/>
                    <StackedBarChart  dataset ={this.handleProjectScans(this.props.dataset, 'neonatal')} title='Sequences across Neonatal scans' fields={_.chain(this.props.dataset).map('ImagingFiles.modality').uniq().value()} span={12}/>
                    <BarChart dataset={this.handleSubjectDiagnosis(this.props.dataset)} title='Diagnosis across subjects' xtitle='Gestational age' ytitle='Count' span={12} transpose={true} padding={[20,20,20,200]}/>
                    <Wordcloud dataset = {this.handleWordCloudDiagnosis(this.props.dataset)}  transpose={true} span={12}/>

                    {/* <Wordcloud dataset = {this.handleWordCloudDiagnosis(this.props.dataset)} span={12} span={12} transpose={true} /> */}
                    {/* <WordNet dataset={this.handleWordCloudDiagnosis(this.props.dataset)}/> */}
                </Row>
            </span>
        );
    }
}
export default ChartsView;