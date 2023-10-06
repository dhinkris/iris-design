import React, { Component } from 'react';
import {CloseCircleOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined,QuestionCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import Dialog from '../../Viewer/Viewer';

import {Button, Collapse, Spin, Row} from 'antd';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as AllActions from "../../../actions";
import connect from "react-redux/es/connect/connect";
import {withStyles} from "@material-ui/core";
import styles from "../../../style";

const { Panel } = Collapse;

const customePanelStyle={
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
    margin: 24
}

function StatusIcon(status) {
    if (status !==undefined) {
        switch (status.trim()){
            case "CANCELLED+":
                return <span style={{color: 'red', marginLeft:20}}>Cancelled <CloseCircleOutlined theme="filled" style={{color: 'red', marginLeft:20}}/></span>
            case "FAILED":
                return <span style={{marginLeft: 20}}>Failed<CloseCircleOutlined theme="filled" style={{color: 'red', marginLeft:20}}/></span>
            case "RUNNING":
                return <span style={{marginLeft: 20}}>In progress <SyncOutlined spin style={{color: 'blue', marginLeft:20}}/></span>
            case "R":
                return <span style={{marginLeft: 20}}>In progress <SyncOutlined spin style={{color: 'blue', marginLeft:20}}/></span>
            case "COMPLETED":
                return <span style={{marginLeft: 20}}>Completed<CheckCircleOutlined theme="filled" style={{color: 'green', marginLeft:20}}/></span>
            case "PD":
                return <span style={{marginLeft: 20}}>Pending for Dependency<ExclamationCircleOutlined theme="filled" style={{color: 'yellow', marginLeft:20}}/></span>
        }
        return <QuestionCircleOutlined style={{marginLeft:20}}  theme="filled"/>
    }

}
class UserPipeline extends React.Component{
    state={
        showDialog: false,
        imageToOpen: '',
        header:null,
        folderToOpen: '',
    }
    static getDerivedStateFromProps=(nextProps, prevState) => {
        if (nextProps.getFile.header !== prevState.header){
            return{
                header:nextProps.getFile.header
            }
        }
    }

    handleClosed = () => {
        this.setState({
            showDialog: false,
            imageToOpen:'',
            folderToOpen:''
        })
    };
    handleView = (file) => {
        // this.props.actions.fetchFiles(file.name);
        this.props.actions.fetchNiftiHeader(file)
        this.setState({
            showDialog: true,
            imageToOpen: file,
            folderToOpen: ''
        })
    }
    render() {
        const { showDialog , imageToOpen, header, folderToOpen} = this.state
        return(
            <div style={{padding: 40}}>
                <div id={this.props.status}></div>
                <Dialog open={showDialog} onClose={this.handleClosed} imageToOpen={imageToOpen} folderToOpen={folderToOpen} header={header} />
                <h2>Pipeline status</h2>

                {
                    this.props.userpipeline.pipelineList.map((pipeline, pindex) => {
                        return(
                            <React.Fragment>
                                <Collapse
                                    bordered={false}
                                    expandIcon={({ isActive}) => <CaretRightOutlined rotate={isActive? 90: 0} />}
                                    defaultActiveKey={['1']}
                                    style={{padding: 20}}
                                >
                                    <Panel header={<React.Fragment>{pipeline.pid}</React.Fragment>}>
                                        <Collapse
                                            bordered={false}
                                            expandIcon={({ isActive}) => <CaretRightOutlined rotate={isActive? 90: 0} />}
                                            defaultActiveKey={['1']}
                                        >
                                            {
                                                pipeline.commandsToExecute.map((commands, cindex)=> {
                                                    return(
                                                        <Panel header={
                                                            <React.Fragment>{commands.params.name}
                                                                {StatusIcon(commands.status)}
                                                            </React.Fragment>}
                                                               key={pindex+'_'+cindex}
                                                               style={customePanelStyle} >
                                                            <p>{commands.params.output_file} {commands.status==='COMPLETED'?<Button type="primary" onClick={()=>this.handleView(commands.params.output_file)}> View </Button>: null} </p>
                                                        </Panel>
                                                    )
                                                })
                                            }
                                        </Collapse>
                                    </Panel>
                                </Collapse>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        )
    }
}


UserPipeline.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (withStyles(styles)(UserPipeline));
