import { Skeleton, Switch, Card, Avatar, Tabs, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../actions'
import { Input } from 'antd';
import { Row, Col, Button } from 'antd';
import FetalGrowth from '../components/Charts/Groups/FetalGrowth';
import PlacentalGrowth from '../components/Charts/Groups/PlacentalGrowth';
import GenerateReport from '../components/Charts/GenerateReport/Content'
import MRS from '../components/Charts/Groups/MRS';
import Nomograms from '../components/Charts/Elements/_Nomogram';

import _ from 'lodash';
import { getUserReport } from '../actions/report';

const { TabPane } = Tabs;
const { Meta } = Card;
const Search = Input.Search;
let k = 0
class VolumeCalculator extends React.Component {
    constructor(props) {
        super();
        this.state = {
            subject_id: '',
            roi: [],
            updateFlag: '',
            residuals: [],
            loading: true,
            _savedState: null
        }
    }

    async componentDidMount() {
        await this.props.actions.getResiduals()
        this.setState({ ...this.props.residuals, loading: false })
    }

    handleSwitch = (e) => {
        this.setState({ selected: e.target.value })
    }

    handleCreateReport = (key, data) => {
        this.setState({ [key]: data })
    }

    handleSaveReport = () => {
        this.props.actions.saveReport(this.state)
    }

    handleReset = async () => {
        this.setState({ loading: true })
        await this.props.actions.getResiduals()
        this.setState({ ...this.props.residuals, loading: false })
    }

    render() {
        const { loading, residuals, selected, toPlot } = this.state
        let _residuals = _.groupBy(residuals, v => [v.type, v.organ, v.metricType, v.modality].join())

        return (
            residuals.length > 0 ?
                <div style={{
                    padding: 24, margin: 0, minHeight: 280, fontColor: "#fff"
                }}>
                    <GenerateReport residuals={residuals} handleCreateReport={this.handleCreateReport} handleSaveReport={this.handleSaveReport} handleReset={this.handleReset} />
                    <Row gutter={24}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Tabs defaultValue={Object.keys(_residuals)[0]} buttonStyle="solid" defaultActiveKey="0" centered>
                                {
                                    Object.keys(_residuals).map((_residual, index) => {
                                        return (
                                            <TabPane tab={_residual} key={index}>
                                                <Row gutter={24}>
                                                    {
                                                        _residuals[_residual].map((_) => {
                                                            return (<Col span={8} style={{ padding: 35}}><Nomograms residual={_} toPlot={toPlot}></Nomograms></Col>)
                                                        })
                                                    }
                                                </Row>
                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                        </Col>
                    </Row>
                </div> : <Spin spinning={loading} />
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
)(VolumeCalculator);