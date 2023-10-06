import React, { Component } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import UserPipeline from './UserPipeline/UserPipeline'
import { bindActionCreators } from "redux";
import * as AllActions from "../../actions";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import io from 'socket.io-client';
import _ from 'lodash';
import { Spin, Table, Alert, Modal, Row, Col, Card, Button, Tag, Badge } from "antd";
import Viewer from '../Viewer2/Viewer'
import { PDFDownloadLink, Document, Page,Text, View } from '@react-pdf/renderer';

const statusColorCode = {
    "COMPLETED": "#56f000",
    "PD": "#fce83a",
    "PENDING": "#fce83a",
    "0:0": "#fce83a",
    "FAILED": "#ff3838",
    "RUNNING": "#2dccff",
    "CF": "#2dccff",
    "LOADING": "#fce83a"
}
class PipelineStatus extends React.Component {
    constructor(props) {
        super();
        this.state = {
            userpipeline: null,
            pipelineStatus: null,
            inputFiles: ["Loading..."],
            outputFiles: ["Loading..."],
            status: "LOADING",
            fileContent: "Nothing to show"
        }
        this.socket = io.connect("http://10.54.250.10:3005/")
    }
    subscribe = (id) => {
        if (this.state.status!=='COMPLETED'){
            this.socket.on('subscribe', (status) => this.setState({ inputFiles: status.inputFiles, outputFiles: status.outputFiles, status: status.status }))
        }
    }
    async componentDidMount() {

        if (this.props.match.params.id !== undefined) {
            await this.props.actions.getUserPipelineStatusById(this.props.match.params.id)
            this.setState({
                visible: true,
                tmpdir: this.props.userProcess.pipelineStatusById[0].tmpdir,
                pipeline: this.props.userProcess.pipelineStatusById[0].config,
                status: this.props.userProcess.pipelineStatusById[0].status,
                inputFiles: this.props.userProcess.pipelineStatusById[0].inputFiles,
                outputFiles: this.props.userProcess.pipelineStatusById[0].outputFiles ? this.props.userProcess.pipelineStatusById[0].outputFiles : [],
                commandLine: this.props.userProcess.pipelineStatusById[0].commandLine,
                updatedAt: this.props.userProcess.pipelineStatusById[0].updatedAt
            })
            this.socket.emit('subscribeToId', this.props.match.params.id)
            this.subscribe(this.props.match.params.id)
        }

        await this.props.actions.getUserPipelineStatus()
        this.setState({ pipelineStatus: this.props.userProcess.pipelineStatusAll })
    }
    componentWillUnmount() {
        this.socket.emit('disconnect');
    }

    toArrayBuffer = (buf) => {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    handleModal = async (fileToOpen) => {
        if  (fileToOpen.split('.')[1] == 'nii'){
            let segmentation = []
            this.state.outputFiles.map((_file) => {
                if  (_file.split('.')[1] == 'nii'){
                    segmentation.push(_file)
                }
            })
            this.setState({ openViewer: true, baseImage: fileToOpen, segmentation: segmentation })
        } else {
            await this.props.actions.getFile(fileToOpen)
            this.setState({ openFileReader: true, fileContent: this.props.getFile.fetchedData })
        }
       
    }
    handleCloseViewer = () => {
        this.setState({ openViewer: false })
    }
    handleCloseFileReader = () => {
        this.setState({ openFileReader: false })
    }
    handleOpen = (_id) => {
        this.props.history.push('/projects/' + _id)
    }
    handleCancel = () => {
        this.setState({ visible: false })
        this.props.history.push('/projects/')
    }

    render() {
        const { pipelineStatus, visible, pipeline, tmpdir, inputFiles, outputFiles, baseImage, segmentation, status, commandLine, updatedAt, fileContent } = this.state
        console.log(status)
        const columns = [
            {
                title: 'Name',
                dataIndex: 'displayName',
                key: 'displayName',
            },
            {
                title: 'Created at',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            },
            {
                title: 'Last updated',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                sortOrder: 'descend',
                sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => <Tag color={statusColorCode[status]}>{status}</Tag>
            },
            {
                title: 'Action',
                dataIndex: '_id',
                key: '_id',
                render: (_id) => <a onClick={() => this.handleOpen(_id)}>Open</a>,
            }
        ]
        return (
            pipelineStatus !== null ?
                <>
                    <Row span={24} style={{ margin: 20 }}>
                        <Col span={24}>
                            <Viewer baseImage={baseImage} segmentation={segmentation} visible={this.state.openViewer} handleClose={this.handleCloseViewer} />
                            <Modal title="" visible={this.state.openFileReader} width="100%" onCancel={this.handleCloseFileReader} destroyOnClose={true}>
                                <p>{fileContent}</p>
                            </Modal>
                            <Modal title="" visible={visible} width="100%" onCancel={this.handleCancel} style={{ background: statusColorCode[status] }} destroyOnClose={true}>
                                <div style={{ background: statusColorCode[status], height: 50 }}></div>
                                {
                                    pipeline ? <div style={{ padding: 10, boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px" }}>
                                        <Row style={{ background: "#f4f4f4", padding: 20 }} ><Col span={24}><h2>{pipeline.name}<Tag color={statusColorCode[status]} style={{ marginLeft: 10 }}>{status}</Tag></h2><h4>Current workspace: {tmpdir}</h4><h5>Last updated: {updatedAt}</h5></Col></Row>
                                        <Row>
                                            <Col span={12}>
                                                <div className="site-card-border-less-wrapper" style={{ margin: 20 }} >
                                                    <Card title="INPUT" bordered={true}>
                                                        <div style={{ overflow: "scroll", height: 300 }}>
                                                            {
                                                                inputFiles !== undefined ? inputFiles.map((_file) => {
                                                                    return (
                                                                        <>
                                                                            <Tag color="processing">
                                                                                <a type="primary" onClick={() => this.handleModal(_file)}>{_file.split('/').slice(-1)[0]}</a>
                                                                            </Tag>
                                                                            <br />
                                                                        </>
                                                                    )
                                                                }) : null
                                                            }

                                                        </div>
                                                    </Card>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="site-card-border-less-wrapper" style={{ margin: 20 }} >
                                                    <Card title="OUTPUT" bordered={true} >
                                                        <div style={{ overflow: "scroll", height: 300 }}>
                                                            {
                                                                outputFiles.map((_file) => {
                                                                    return (
                                                                        <>
                                                                            <Tag color="processing">
                                                                                <a type="primary" onClick={() => this.handleModal(_file)}>{_file.split('/').slice(-1)[0]}</a>
                                                                            </Tag>
                                                                            <br />
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <Button type="primary" onClick={this.showModal} style={{ marginTop: 20, textAlign: 'right' }}>Download</Button>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ backgroundColor: "#000000", marginLeft: 20, marginRight: 20, marginBottom: 20, borderRadius: 10 }} >
                                            <Col span={24} style={{ padding: 20 }}>
                                                <p style={{ color: "#ffffff", fontFamily: "Courier" }}> {commandLine}</p>
                                            </Col>
                                        </Row>
                                    </div> : null
                                }
                            </Modal>
                            <Table columns={columns} dataSource={pipelineStatus} pagination={false} />
                        </Col>
                    </Row></> : <Spin tip="Loading...">
                    <Alert
                        message="Pipeline status"
                        description="Fetching the updates."
                        type="info"
                    />
                </Spin>
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
)(withRouter(PipelineStatus));