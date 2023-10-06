import React, { Component } from 'react';
import { Layout, Menu, Collapse, Button, Spin, Form, Input } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import algorithm from './ExecutePipeline/fetalbrainpipeline';
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { bindActionCreators } from "redux";
import { Switch, BrowserRouter as Router, Link, Route } from 'react-router-dom'

import AlgorithmGenerator from './ExecutePipeline/AlgorithmList';
import FileUpload from './UploadWork/FileHandler'
import PipelineList from './PipelineList'
import * as AllActions from "../../actions";


const mainAlgorithmSpace = []


class AlgorithmList extends Component {
    constructor(props) {
        super();
        this.state = {
            addedAlgorithmList: [],
            uploadedFiles: null,
            id: '',
            scan: '',
            ga: '',
            loading: false
        }
    }

    handleClickAdd = (algorithm) => {
        mainAlgorithmSpace.push(algorithm)
        this.setState({
            addedAlgorithmList: mainAlgorithmSpace
        })
    }
    handleClickRemove = (algorithm) => {
        const index = mainAlgorithmSpace.indexOf(algorithm);
        mainAlgorithmSpace[index] = null;
        this.setState({
            addedAlgorithmList: mainAlgorithmSpace
        })
    }
    handleUpload = (e) => {
        this.setState({
            uploadedFiles: e.target.files[0],
            loaded: 0
        })
    }

    handleValidate = () => {
        const data = new FormData()
        data.append('file', this.state.uploadedFiles)
        axios.post("http://localhost:8000/uploadfile", data, {
            // receive two    parameter endpoint url ,form data
        })
            .then(res => { // then print response status
                console.log(res.statusText)
            })


    }
    handleRun = async (pipeline) => {
        this.setState({
            loading: true
        })
        // await this.props.actions.executePipelineDetails(pipelineList(this.state.id, this.state.scan, this.state.ga))
        this.setState({
            id: '',
            scan: '',
            ga: '',
            loading: false
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })

    }
    render() {
        console.log(`${this.props.match.url}/:id`)

        return (
            <Layout id="custom-collapse">
                <Spin spinning={this.state.loading}>                  
                    <PipelineList {...this.props}/>
                    {/* <Button type="primary" onClick={this.handleRun}>Run</Button> */}
                </Spin>
            </Layout>
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
)(withRouter(AlgorithmList));
