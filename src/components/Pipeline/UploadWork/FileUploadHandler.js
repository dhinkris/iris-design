import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { Input, Steps, Button, message ,Collapse, Form} from 'antd';
import {connect} from "react-redux";

import UploadFiles from "./FileUploadHelper";

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

class FileUploadHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            fileParams: {
            },
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
    }
    handleUpload = (fileList) => {
        this.setState({filesUploadHandle: fileList})
    }
    handleUploadFiles = (e) =>{
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err){
                Object.keys(this.state.fileParams).map((attr) => {
                    dataObj.append(attr, this.state.fileParams[attr])
                })
                Object.keys(this.state.filesUploadHandle).map((index) => {
                    dataObj.append('niftiImage', this.state.filesUploadHandle[index].originFileObj)
                })
                this.props.actions.uploadFiles(dataObj)
            }
        })

    }
    render() {
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
                <div style={{margin: 20}}>
                    <p>Fetal Segmentation Pipeline</p>
                    <Form onSubmit={this.handleUploadFiles}>
                        <Form.Item >
                            {getFieldDecorator('subject_id',
                                {
                                    rules:[{ required: true, message:"Enter a Subject ID" }],
                                }
                            )(<Input id="subject_id" placeholder="Subject ID" onChange={this.handleChange('subject_id')}/>)
                            }
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('scan_number',
                                {
                                    rules:[{ required: true, message:"Enter a Scan number" }],
                                }
                            )(<Input placeholder="Scan number" onChange={this.handleChange('scan_number')}/>)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('gestational_age',
                            {
                                rules:[{ required: true, message:"Enter Gestational Age" }],
                            })(<Input placeholder="Gestational age" onChange={this.handleChange('gestational_age')}/>)
                        }
                        </Form.Item>
                        <Form.Item >
                            <UploadFiles id="file_upload" handleUpload={this.handleUpload}/>
                        </Form.Item>
                        <Button htmlType="submit">Upload Files</Button>
                    </Form>
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

// const WrappedPipeline = Form.create({name: 'coordinated'})(FileUploadHandler)
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (FileUploadHandler);
