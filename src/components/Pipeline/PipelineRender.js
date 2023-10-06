import { Row, Col, Card, Button, Modal, Input, Table } from 'antd';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Block from "react-blocks";
import _ from 'lodash';
// import * as AllActions from '../../actions';
import styles from './styles';
import './ExecutePipeline/demo.less';

import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as AllActions from "../../actions";

import { pipelines } from './List/'
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import io from 'socket.io-client';

const { Dragger } = Upload;

const updateKey='uploadKey'

class PipelineList extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: false, selectedFiles: null, uploading: [], fileList:[], argString: {}, tmpdir: "Not an active workspace" }
    }

    async componentDidMount() {
    
        this.formdata = new FormData();
        let algo = this.props.history.location.pathname.split('/')
        algo = algo[algo.length - 1]
        await this.props.actions.createWorkspace()
        await this.setState({ pipeline: pipelines[algo], tmpdir: this.props.userProcess.workspace.tmpdir })
        this.setState({ cliString: this.state.pipeline['command-line'].split(' ')[0]+' ' })
        this.formdata.append('tmpdir', this.state.tmpdir+'/input/')
    }

    handleRun = async () => {
        const hide=message.loading({ content: 'Submission in process...', updateKey });
        this.renderString()

        const command={
            "command": {
                "tmpdir": this.state.tmpdir,
                "config": this.state.pipeline,
                "commandLine": this.state.cliString
            }
        }
        
        await this.props.actions.executeCommand(command)
        hide();
        message.success({ content: 'Submission success.', updateKey})
        this.props.history.push('/projects/'+this.props.userProcess.pipelineExecute._id)
    }

    hideModal = () => {
        this.setState({ visible: false })
        this.props.history.push('/pipeline')
    }

    handleFileUpload = async (files) => {
        // Object.keys(files).map((index) => {
        //     this.formdata.append('files', files[index].originFileObj)
        // })
    }

    handleUpload = async (index, flag) => {
        const hide=message.loading({ content: 'Loading...', updateKey });
        this.state.uploading[index] = true
        this.setState({
            uploading: this.state.uploading,
        });
        this.state.fileList.map((file) => {
            this.formdata.append('files', file)
        })
       
        await this.props.actions.uploadFile(this.formdata)
        let filepath=' ';
        
        _.uniqBy(this.props.userProcess.fileUpload, 'path').map((file)=> {filepath+=file.path+' '})
        
        if (filepath.trim()!=='') {
            this.state.argString[flag] = filepath
            this.setState({ argString: this.state.argString })
            this.renderString()
        }

        this.state.uploading[index] = false
        this.setState({
            uploading: this.state.uploading,
        });
        hide();
        message.success({ content: 'Successfully uploaded', updateKey})
    }

    handleChange=(e, flag)=> {
        this.state.argString[flag] = e.target.value
        this.setState({ argString: this.state.argString })
        this.renderString()
    }

    getComponent = (type, record, index) => {
        const { fileList } = this.state
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                    fileList: newFileList,
                    };
                });
            },
            beforeUpload: files=> {
                this.setState(state => ({
                    fileList: [...state.fileList, files],
                  }));
                return false;
            },
            fileList,
          };
        
        if (type === 'File') {
            this.state.uploading.push(false)
            return (<>
                {record['list']? <Upload {...props} key={index}><Button icon={<UploadOutlined />}  >Add your files</Button> </Upload>: <Upload {...props} key={index}><Button icon={<UploadOutlined />}>Add your files</Button> </Upload>}
                    <Button loading={this.state.uploading[index]} style={{ marginTop: 10 }} type="primary" onClick={() => this.handleUpload(index, record['command-line-flag'])}>Upload</Button>
            </>)
        }
        if (type === 'String') {
            return (<Input placeholder={record['command-line-flag']} onChange={(e)=> this.handleChange(e, record['command-line-flag'])} allowClear />)
        }
        if (type === 'Number') {
            return (<Input placeholder={record['command-line-flag']} onChange={(e)=> this.handleChange(e, record['command-line-flag'])} allowClear />)
        }
    }

    cleanObj = (obj) => {
        for (var propName in obj){
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] ==='' ){
                delete obj[propName]
            }
        }
        return obj
    }
    renderString = ()=> {
        let _cliString = ' '
        this.state.argString=this.cleanObj(this.state.argString)
        Object.keys(this.state.argString).map((args)=> {
            if (_.filter(_.find(this.state.pipeline['input'], data=> data['command-line-flag']===args)['id'].split('_'), args=> args==='out').length>0){
                _cliString+=args+' '
                _cliString+=this.state.tmpdir+"/output/"+this.state.argString[args]+' '
            } else {
                _cliString+=args+' '
                _cliString+=this.state.argString[args]+' '
            }
            
        })
        this.setState({ cliString: this.state.pipeline['command-line'].split(' ')[0]+' '+_cliString })
    }

    render() {
        const { pipeline, tmpdir } = this.state;
        const columns = [
            {
                dataIndex: 'name'
            },
            {
                dataIndex: 'type',
                render: (text, record, index) => this.getComponent(text, record, index)
            }
        ]
        return (
            <div>
                {
                    pipeline ?
                        <div style={{ margin: 100, boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px" }}>
                            <Modal title="Confirm" visible={this.state.visible} onOk={this.hideModal} onCancel={this.hideModal} okText="OK" cancelText={"Cancel"}>
                                <p>Are you sure to go back. Your progress will be lost if not saved.</p>
                            </Modal>
                            <Row style={{ background: "#f4f4f4", padding: 20 }} ><Col span={24}><h2>{pipeline.name}</h2><h4>Current workspace: {tmpdir}</h4></Col></Row>
                            <Row>
                                <Col span={12}>
                                    <div className="site-card-border-less-wrapper" style={{ margin: 20 }} >
                                        <Card title="INPUT" bordered={true}>
                                            <div style={{ overflow: "scroll", height: 300 }}>
                                                <Table dataSource={pipeline.input} columns={columns} pagination={false} />
                                                
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="site-card-border-less-wrapper" style={{ margin: 20 }} >
                                        <Card title="OUTPUT" bordered={true} >
                                            <div style={{ overflow: "scroll", height: 300 }}>
                                                <Button type="primary" onClick={this.showModal} style={{ marginTop: 20, textAlign: 'right' }}>Download</Button>
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ backgroundColor: "#000000", marginLeft: 20, marginRight: 20, marginBottom: 20, borderRadius: 10 }} >
                                <Col span={24} style={{ padding: 20 }}>
                                    <p style={{ color: "#ffffff", fontFamily: "Courier" }}> {this.state.cliString}</p>
                                </Col>
                            </Row>
                            <Row style={{ backgroundColor: "#f4f4f4" }} >
                                <Col span={24} style={{ margin: 20, textAlign: "center" }} >
                                    <Button type="default" onClick={this.showModal} style={{ marginRight: 10 }}>Close</Button>
                                    <Button type="danger" onClick={this.showModal} style={{ marginRight: 10 }}>Stop</Button>
                                    <Button type="primary" onClick={this.handleRun} style={{ marginRight: 10 }}>Run</Button>
                                </Col>
                            </Row>
                        </div> : null
                }
            </div>
        )
    }
}
const mapStatetoProps = (state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})

export default connect(
    mapStatetoProps,
    mapDispatchToProps,
)(withRouter(PipelineList));