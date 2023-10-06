import {Upload, Button, Radio, Form} from 'antd';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from "react-redux";
import * as AllActions from "../../../actions";
import FileUpload from './FileUploadHandler';
import DirectoryTree from './DirectoryTree';
import YourUploads from './YourUploads';

class FileUploadHandler extends React.Component {
    state={
        component: 'projects'
    }
    handleChange=(e) => {
        this.setState({
            component: e.target.value
        })
    }
    render(){
        return(
            <div>
                <Radio.Group onChange={this.handleChange} defaultValue="projects" buttonStyle="solid">
                    <Radio.Button value="projects">Projects</Radio.Button>
                    <Radio.Button value="uploads">Your uploads</Radio.Button>
                    <Radio.Button value="uploadfiles">Upload Files</Radio.Button>
                </Radio.Group>
                {this.state.component==='projects'? <DirectoryTree/>:this.state.component==='uploads' ? <YourUploads/>:<FileUpload/>}
            </div>
        )
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
) (FileUploadHandler);