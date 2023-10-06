import { Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from "react-redux";

import * as AllActions from '../../../actions';


const Dragger = Upload.Dragger;


class Pipeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
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

    handleChange = (info) => {
        const status = info.file.status;
        if (status !== 'uploading') {
            this.props.handleUpload(info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.success(`${info.file.name} file upload successfully.`);
        }
    }
    render() {
        const props = {
            accept: 'application/gzip',
            multiple: true,
            action: 'http://10.54.250.10:3005/api/file/uploadfile'
        }


        return (
            <Dragger {...props} onChange={this.handleChange}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </Dragger>
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
) (Pipeline);
