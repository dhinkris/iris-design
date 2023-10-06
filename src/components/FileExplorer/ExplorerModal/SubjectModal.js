import { Modal, Button, List, Tag, Tabs, Row, Col, Space, Divider } from 'antd';
import { Spin, Layout, Badge } from 'antd';

import { bindActionCreators } from "redux";
import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Route, Link, withRouter, Redirect } from 'react-router-dom';

import * as AllActions from "../../../actions/index";
import _ from 'lodash';
import SubjectDetails from './SubjectExplorerModalComponents/SubjectDetails';
import PreprocessedFiles from './SubjectExplorerModalComponents/PreprocessedFiles';
import PostProcessedFiles from './SubjectExplorerModalComponents/PostprocessedFiles';
import ROIView from './SubjectExplorerModalComponents/ROI';

import Comments from './SubjectExplorerModalComponents/Comments/Comments';

const { TabPane } = Tabs;
class SubjectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            id: null,
            loading: false,
            basicInfo: null
        }
    }

    openLoader = () => {
        return <Spin size="large" />
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    async componentDidMount() {
        await this.setState({ ...this.props.location.state })
        await this.props.actions.getDatasetBasicInfoById(this.state.id)
        this.setState({ basicInfo: this.props.dataExplorer.basicInfo })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.history.goBack();
    }
    handleOk = () => {
        this.setState({
            visible: false
        });
        this.props.history.goBack();
    }
    onChange = (key) => {
        console.log(key)
    }
    render() {
        const { visible, id } = this.state
        let { basicInfo } = this.state
        basicInfo = _.uniqBy(basicInfo, v=> [v.ImagingScanDetails._id, v.ImagingScanDetails.basicInfo, v.ImagingScanDetails.scanId].join())
        return (
            <Modal
                title={id}
                visible={visible}
                onCancel={this.handleCancel}
                width='100%'
                height='100%'
                centered
                style={{ height: '100vh' }}
            >
                <Tabs defaultActiveKey="0" centered>
                    {(!basicInfo) ? <Spin size="large" /> :
                        basicInfo.map((data, index) => {
                            return (
                                <TabPane tab={data.ImagingBasicInfo.studyId + " - " + data.ImagingScanDetails.scanNumber + " - " + data.ImagingScanDetails.type} key={index} rowKey={index}>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <ROIView basicInfo={data} />
                                        </Col>
                                        <Col span={12}>
                                            <PreprocessedFiles basicInfo={data} />
                                        </Col>
                                    </Row>
                                    <Divider/>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <SubjectDetails basicInfo={data} />
                                        </Col>
                                        <Col span={12}>
                                            <Comments basicInfo={data} />
                                        </Col>
                                    </Row>
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </Modal>
        );
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
)(SubjectModal);