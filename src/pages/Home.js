import { Skeleton, Switch, Card, Avatar, Statistic, Tag } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../actions'
import { Link } from 'react-router-dom'
import { Input } from 'antd';
import { Row, Col, Button, Result } from 'antd';
import _ from 'lodash';

import LineChart from '../components/Charts/Elements/AreaChart'
import BarChart from '../components/Charts/Elements/BarChart'
import ListofJobs from '../components/Home/ListofJobs'
import PieChart from "../components/Charts/Elements/PieChart";
import TopStats from "../components/FileExplorer/TopStats";
import PipelineList from "../components/Pipeline/PipelineList"

const { Meta } = Card;
const Search = Input.Search;

class Home extends React.Component {
    state = {
        loading: false,
        dataset: []
    }

    async componentDidMount() {
        await this.props.actions.getDatasetBasicInfo();
        this.updateDataset();
    }
    updateDataset = () => {
        this.setState({ dataset: this.props.dataExplorer.dataset, datasetLoader: false })
    }
    onChange = (checked) => {
        this.setState({ loading: !checked });
    }

    render() {
        const { loading, } = this.state;
        let { dataset } = this.state;
        // dataset = _.uniqBy(dataset, 'ImagingScanDetails._id')
        return (
            <div style={{
                background: '#fff', padding: 24, margin: 0, minHeight: 280
            }}>
                {/*<Switch checked={!loading} onChange={this.onChange} />*/}
                {/*<Search*/}
                {/*    placeholder="Enter your command to search"*/}
                {/*    enterButton="Search"*/}
                {/*    size="large"*/}
                {/*    onSearch={value => console.log(value)}*/}
                {/*/>*/}
                {console.log(this.props)}
                <h1>
                    Welcome to IRIS
                </h1>
                <h3>
                    Integrate Research Information System is AI driven neuroimaging research platform for Fetal & Neonatal.
                </h3>
                <div style={{ marginTop: 20 }}>
                    <Row gutter={24}>
                        <Col span={24} id="biomarker">
                            <Card
                            >
                                <Skeleton style={{ fontColor: '#ffffff', fontsize: '40px' }} loading={loading} avatar active>
                                    <Row gutter={24} style={{ marginTop: 20 }}>
                                        <Col span={12}>
                                            <Meta
                                                title={[<h3>Explore Biomarkers</h3>]}
                                                description="This is a pool of biomarkers from different modalities of MR imaging that includes Structural, Functional and Spectroscopy imaging. "
                                            />
                                            <Link to='/volumecalculator'> <Button style={{ marginTop: 40 }} type='primary'>Explore now...</Button></Link>
                                        </Col>
                                        <Col span={3} id="topstats">
                                            <h2>Number of subjects analyzed</h2>
                                            <Statistic value={100} />
                                        </Col>
                                        <Col span={9}>
                                            <h2>Biomarkers used for the cases</h2>
                                            <Tag color="magenta">Ventriculomegaly </Tag>
                                            <Tag color="blue">Abnormal Head space </Tag>
                                            <Tag color="green">Microcephaly </Tag>
                                            <Tag color="red">IUGR </Tag>
                                            <Tag color="blue">Abnormal Head space </Tag>
                                            <Tag color="green">Microcephaly </Tag>
                                            <Tag color="red">IUGR </Tag>
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </Card>
                        </Col>

                    </Row>
                    <Row gutter={24} style={{ marginTop: 40 }}><Col span={24}><TopStats dataset={dataset} /></Col></Row>
                    <PipelineList/>
                </div>
                {this.state.dataset ?
                    <><Row gutter={24} style={{ marginTop: 40 }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <h1 > Fetal & Neonatal Data Distribution</h1>
                        </Col>
                    </Row>
                        {/* <div style={{ marginTop: 40 }}>
                            <BarChart dataset={this.state.dataset} />
                            <PieChart dataset={this.state.dataset} />
                        </div> */}
                        {/* <ListofJobs style={{ marginTop: 40 }} /> */}
                        </> :
                    <Result
                        status="warning"
                        title="Could't retrieve data. Register/Login to continue"
                        subTitle="If you are a cluster user, you can login with your cluster credentials"
                        extra={[
                            <Link to='/login'><Button type="primary" key="console"> Login </Button></Link>,
                        ]}
                    />

                }
                {/*<div style={{ marginTop: 16 }}>*/}
                {/*<Row gutter={18}>*/}
                {/*<Col span={6} ><BarChart/></Col>*/}
                {/*/!*<Col span={6} ><LineChart/></Col>*!/*/}
                {/*/!*<Col span={6} ><BarChart/></Col>*!/*/}
                {/*/!*<Col span={6} ><BarChart/></Col>*!/*/}

                {/*</Row>*/}
                {/*</div>*/}
            </div>
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
)(Home);