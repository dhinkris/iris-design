import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../../../actions/index'
import rois from '../../../data/roi_residuals'
import { Drawer, Slider, Form, Radio, Checkbox, Button, Col, Row, Input, Select, DatePicker, Switch } from 'antd';
import InputNumber from '../Helper/InputNumber';

import _ from 'lodash'
import { keys } from '@material-ui/core/styles/createBreakpoints';
const { Option } = Select;
const { TextArea } = Input

var selectedFilters = [];
class ReportVariables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            disabled: false,
            residuals: this.props.residuals,
            selectedValue: [],
            activeKey: this.props.activeKey,
            objectHandler: this.props.objectHandler
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
            selectedValue: [],
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onSubmit = () => {
        this.setState({

        })
    }

    handleDisabledChange = (disabled) => {
        this.setState({ disabled });
    }

    // handleChange = (key) => (e) => {
    //     this.props.handleCreateReport(this.props.objectHandler, key, e.target.value, this.props.activeKey)
    // }

    onChange = (e, i, key) => {
        this.state.selectedValue[key] = e._isAMomentObject !== undefined ? e : e.target.value
        this.state.objectHandler[this.state.activeKey][key] = this.state.selectedValue[key]
        this.setState({ selectedValue: this.state.selectedValue, objectHandler: this.state.objectHandler });
        this.props.handleCreateReport('toPlot', this.state.objectHandler)
        this.props.handleCreateReport('selectedValue', this.state.selectedValue)
    }

    render() {
        const { disabled, residuals } = this.state
        return (
            <div style={{ marginTop: 10 }}>
                <Input style={{ marginTop: 10 }} value={this.state.selectedValue.name} onChange={(e) => this.onChange(e, 0, "name")} placeholder="Name" />
                <Input style={{ marginTop: 10 }} value={this.state.selectedValue.gestationalAgeAtScan} onChange={(e) => this.onChange(e, 1, "gestationalAgeAtScan")} placeholder="Gestational age" />
                <Input style={{ marginTop: 10 }} value={this.props.activeKey} onChange={(e) => this.onChange(e, 2, "scanNumber")} placeholder="Scan number" disabled />
                <DatePicker style={{ width: "100%", marginTop: 10 }} onChange={(e) => this.onChange(e, 2, "date")} placeholder="Date" />
                {
                    residuals.map((_residual, index) => {
                        return (<Input style={{ marginTop: 10 }} value={this.state.selectedValue[_residual]} onChange={(e) => this.onChange(e, 3 + index, _residual.roi)} placeholder={_residual.name} key={_residual.name} />)
                    })
                }

                <TextArea value={this.state.selectedValue.comments} onChange={(e) => this.onChange(e, residuals.length + 3, "comments")} placeholder="Comments" style={{ marginTop: 10 }} autosize={{ minRows: 2, maxRows: 6 }} />
            </div>
        )
    }
}

export default ReportVariables
