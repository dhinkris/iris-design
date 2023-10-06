import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../../../actions/index';
import SubjectTabs from './ReportTabs'

import { Drawer, Card, Form, Radio, Checkbox, Button, Col, Row, Input, Select, DatePicker, Switch, Steps, message, Result, Popconfirm, Modal } from 'antd';
import { FilterOutlined, SettingOutlined, PrinterOutlined, InfoCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
const { Option } = Select;
const { TextArea } = Input
var selectedFilters = [];

const { Step } = Steps;


class Main extends React.Component {
    state = {
        disabled: false,
        current: 0,
        selected: [],
        residuals: this.props.residuals.residuals,
    };
    reset = () => {
        this.setState({ filteredData: {} })
        this.setState({
            filteredData: {
                0: {
                    prev: null,
                    next: this.props.residuals.residuals,
                    selected: [],
                    grouped: {}
                }
            }
        })
    }
    showDrawer = () => {
        this.setState({
            showDrawer: true,

        })
    }

    onClose = () => {
        this.setState({
            showDrawer: false,
        });
    }

    componentDidMount() {
        this.reset()
        this.setState({ residuals: this.props.residuals.residuals })
    }

    componentDidUpdate(prevProps, prevState) {
        if(JSON.stringify(prevProps.residuals)!==JSON.stringify(this.props.residuals)){
            console.log('Updated...')
            this.reset()
            this.setState({ residuals: this.props.residuals.residuals })
        }
    }

    addItem = (key, value) => {
        let selected = this.state.filteredData[this.state.current].selected
        selected.push({ key: key, value: value })

        let grouped = selected.reduce((r, e) => {
            (r[e.key] || (r[e.key] = [])).push(e.value)
            r[e.key] = _.uniq(r[e.key])
            return r
        }, {})

        this.state.filteredData[this.state.current].grouped = grouped
    }

    removeItem = (key, value) => {
        let grouped = this.state.filteredData[this.state.current].grouped
        let selected = this.state.filteredData[this.state.current].selected
        let gidx = grouped[key].indexOf(value)
        let sidx = selected.findIndex(item => { return item.key === key && item.value === value })
        if (gidx > -1) {
            grouped[key] = grouped[key].filter(item => { return item !== value })
            selected.splice(sidx, 1)
            if (grouped[key].length === 0) {
                delete grouped[key]
            }
        }
        this.state.filteredData[this.state.current].grouped = grouped

        // this.setState({ [this.state.filteredData[this.state.current].selected] : selected, [this.state.filteredData[this.state.current].grouped]: grouped})
    }

    handleSelected = (key, value, index, e) => {
        try {
            if (e == undefined) {
                this.setState({ [value + index]: 'primary' })
                this.addItem(key, value)
            } else if (e == 'primary') {
                this.setState({ [value + index]: 'secondary' })
                this.removeItem(key, value)
            } else if (e == 'secondary') {
                this.setState({ [value + index]: 'primary' })
                this.addItem(key, value)
            }
        } catch (e) {
            this.init()
            this.setState({ current: 0 })
        }
    }

    handleSave = () => {
        this.setState({ showDialog: true })
    }
    handleOk = () => {
        this.props.handleSaveReport();
        this.setState({ showDialog: false })
    }
    handleCancel = () => {
        this.setState({ showDialog: false })
    }

    handleChange = (roi) => (e) => {
        this.props.handleCreateReport(this.props.objectHandler, roi, e.target.value, '')
    }
    handleSaveChange =(e)=> {
        this.props.handleCreateReport('name', e.target.value)
    }
    next = () => {
        this.state.filteredData[this.state.current].prev = this.state.filteredData[this.state.current].next
        let data = this.state.filteredData[this.state.current].next
        let filters = this.state.filteredData[this.state.current].grouped
        let res = _.filter(data, (_data) => {
            return _.includes(filters[Object.keys(filters)[0]], _data[Object.keys(filters)[0]])
        })

        this.state.filteredData[this.state.current + 1] = {}
        this.state.filteredData[this.state.current + 1].next = res
        this.state.filteredData[this.state.current + 1].grouped = {}
        this.state.filteredData[this.state.current + 1].selected = []
        this.setState({ current: this.state.current += 1, residuals: res });
        this.props.handleCreateReport('residuals', res)
    };

    prev = () => {
        // this.state.filteredData[this.state.current].prev = this.state.filteredData[this.state.current].next
        let data = this.state.filteredData[this.state.current - 1].next
        let filters = this.state.filteredData[this.state.current - 1].grouped
        let res = data

        // this.state.filteredData[this.state.current-1]={}
        // this.state.filteredData[this.state.current-1].next = res
        // this.state.filteredData[this.state.current-1].grouped={}
        // this.state.filteredData[this.state.current-1].selected = []
        this.setState({ current: this.state.current -= 1, residuals: res });
    };

    generateChart = () => {
        this.setState({ showDrawer: false })
    }
    render() {
        const { toLoad } = this.props
        const { selected, current, residuals } = this.state;
        const type = _.groupBy(residuals, 'type')
        const organ = _.groupBy(residuals, 'organ')
        const biomarkers = _.groupBy(residuals, 'name')


        const steps = [
            {
                title: 'Category',
                content: <>Type: <div style={{ margin: 10 }}>{Object.keys(type).map((_, index) => { return (<Button style={{ margin: 10 }} key={this.state[_ + index]} type={this.state[_ + index]} onClick={(e) => this.handleSelected('type', _, index, this.state[_ + index])}>{_}</Button>) })}</div></>,
            },
            {
                title: 'Organ',
                content: <>Organ: <div style={{ margin: 10 }}>{Object.keys(organ).map((_, index) => { return (<Button style={{ margin: 10 }} key={this.state[_ + index]} type={this.state[_ + index]} onClick={(e) => this.handleSelected('organ', _, index, this.state[_ + index])}>{'organ', _}</Button>) })}</div></>,
            },
            {
                title: 'Select the biomarkers to analyze',
                content: <>Biomarkers: <div style={{ margin: 10 }}>{Object.keys(biomarkers).map((_, index) => { return (<Button style={{ margin: 10 }} key={this.state[_ + index]} type={this.state[_ + index]} onClick={(e) => this.handleSelected('name', _, index, this.state[_ + index])}>{'name', _}</Button>) })}</div></>,
            },
            {
                title: 'Enter the values',
                content: <>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8}>
                            <Card hoverable style={{ width: 500 }} >
                                <SubjectTabs residuals={this.state.residuals} handleCreateReport={this.props.handleCreateReport} />
                            </Card>
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </>
            }
        ];
        return (
            <>
                <Modal title="Save your report" visible={this.state.showDialog} onCancel={this.handleCancel} footer={null}>
                    <Form
                        name="basic"
                        initialValues={{remember: true}}
                        onFinish={this.handleOk}
                    >
                        <Form.Item 
                            label="Report name"
                            name="reportname"
                            rules={[{ required: true, message: 'Please input a valid report name'}]}
                        >
                            <Input onChange={this.handleSaveChange} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Save</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Row gutter={24}>
                    <Col span={6} >
                        <h2> { this.props.savedState? "Report name: "+this.props.savedState.name: null } </h2>
                    </Col>
                    <Col span={10} offset={14} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.showDrawer}>
                            <FilterOutlined /> Create your report
                        </Button>
                        {/* onClick={this.props.handleSaveReport} */}
                        <Button style={{ marginLeft: '5px' }} type="primary" onClick={this.handleSave}>
                            <PrinterOutlined /> Save
                        </Button>
                        <Button style={{ marginLeft: '5px' }} type="primary">
                            <PrinterOutlined /> Print
                        </Button>
                        <Button style={{ marginLeft: '5px' }} type="Reset" onClick={this.props.handleReset}>
                            <InfoCircleOutlined /> Reset
                        </Button>
                    </Col>
                </Row>
                <Drawer
                    title="Generate Chart"
                    width="50%"
                    onClose={this.onClose}
                    visible={this.state.showDrawer}
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 10px)',
                        // paddingBottom: '108px',
                    }}
                >
                    <p style={{ marginTop: 10 }}>Enter the volumentric results (in CC)</p>
                    <>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[current].content}</div>
                        <div className="steps-action">
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    Next
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                                    Previous
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <>
                                    <Button style={{ margin: '0 8px' }} onClick={() => this.generateChart()} type="primary" icon={<SettingOutlined />} >Generate chart</Button>
                                </>
                            )}


                        </div>
                    </>
                </Drawer>
            </>
        )

    }
}
// const Filter = Form.create()(Main);

const mapStatetoProps = (state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
)(Main);
