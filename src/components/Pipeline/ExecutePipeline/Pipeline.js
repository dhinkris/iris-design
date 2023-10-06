import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { Input, Steps, Button, message ,Collapse, Form} from 'antd';
import {connect} from "react-redux";

import * as AllActions from '../../../actions';
import axios, {post} from "axios";

const Step = Steps.Step;
const Panel = Collapse.Panel;

const text = `
  This is the description
`;

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 1,
    overflow: 'hidden',
};

const dataObj = new FormData();

class Pipeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            fileParams: {
            },
            pipeline:[]
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    handleChange = (param) => (e) => {
        let obj = {...this.state.fileParams}
        obj[param] = e.target.value
        this.setState({
            fileParams: Object.assign({}, this.state.fileParams, obj)
        })
        console.log(this.state.fileParams)
    }

    handleRunPipeline=()=> {
        console.log(this.state.fileParams)
    }
    render() {
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
                <div style={{margin: 20}}>
                    <p>Fetal Segmentation Pipeline</p>
                    <Collapse bordered={false} defaultActiveKey={['1']} style={{margin: 10}}>
                        <Panel header="Split Volumes" key="1" style={customPanelStyle}>
                            <Input onChange={() => this.handleChange}>Splite volume</Input>
                        </Panel>
                        <Panel header="Brain Detection" key="2" style={customPanelStyle}>
                            <p onChange={this.handleChange}>Brain detection</p>
                        </Panel>
                        <Panel header="SVR Reconstruction" key="3" style={customPanelStyle}>
                            <p onChange={this.handleChange}>SVR Reconstruction</p>
                        </Panel>
                        <Panel header="Reorientation" key="4" style={customPanelStyle}>
                            <p onChange={this.handleChange}>Reorientation</p>
                        </Panel>
                        <Panel header="Brain Extraction" key="5" style={customPanelStyle}>
                            <p onChange={this.handleChange}>Brain extraction</p>
                        </Panel>
                        <Panel header="Segmentation" key="6" style={customPanelStyle}>
                            <p onChange={this.handleChange}></p>
                        </Panel>
                    </Collapse>
                    <Button onClick={this.handleRunPipeline}>Run pipeline</Button>
                </div>
            </React.Fragment>
        );
    }
}
const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})

// const WrappedPipeline = Form.create({name: 'coordinated'})(Pipeline)
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (Pipeline);
