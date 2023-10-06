import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../../actions/index'
import { Drawer, Slider, Form, Checkbox, Button, Col, Row, Select, Divider, Tag } from 'antd';
import { FilterOutlined } from '@ant-design/icons'
import _ from 'lodash'
const { Option } = Select;
const { CheckableTag } = Tag;

class FilterUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            disabled: false,
            attributes: ['study_group', 'gender', 'cohort', 'scan', 'type', 'modalities_available'],
            logicalFilters: [],
            selectedTags: [],
        };
        this.filterObj = {
            "condition": "checkbox",
            "gender": "checkbox",
            "studyName.name": "checkbox",
            "gestationalAgeAtScan": "slider",
            "diagnosis": "checkbox",
            "type": "checkbox",
            "modality": "checkbox",
            "organ": "checkbox",
            "metrics": "slider",
        }
        this.selectedFilters = []
    }


    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    async componentDidMount() {
        await this.props.actions.getAllFilters()
        this.setState({
            filters: this.props.filters.filters,
            visible: this.props.visible
        })

        console.log(this.state.filters)
    }
    async componentDidUpdate(prevProps, prevState){
        if (prevProps.visible!==this.props.visible){
            this.setState({visible: this.props.visible})
        }
    }
    // handleFilters = () => {
    //     return {
    //         'min_ga': _.min(this.state.subjectList,'gestational_age').gestational_age,
    //         'max_ga': _.max(this.state.subjectList,'gestational_age').gestational_age,
    //         'cohort': _.filter(Object.keys(_.groupBy(this.state.subjectList, (s) => {return s.cohort})), (s)=> {return s!=="null"}),
    //         'gender':  _.filter(Object.keys(_.groupBy(this.state.subjectList, (s) => {return s.gender})), (s)=> {return s!=="null"}),
    //         'type':  _.filter(Object.keys(_.groupBy(this.state.subjectList, (s) => {return s.type})), (s)=> {return s!=="null"}),
    //         'study_group':  _.filter(Object.keys(_.groupBy(this.state.subjectList, (s) => {return s.study_group})), (s)=> {return s!=="null"}),
    //         'scan':  _.filter(Object.keys(_.groupBy(this.state.subjectList, (s) => {return s.scan})), (s)=> {return s!=="null"}),
    //         'modalities_available':  ['placental volume', 'brain volume']
    //     }
    // }

    handleSubmit = async (e) => {
        e.preventDefault()
        await this.props.actions.getFilteredData(this.selectedFilters)
        await this.props.updateDataset()

        console.log(this.selectedFilters)
    }

    handleAddGAFilter = (e) => {
        // selectedFilters = selectedFilters.filter((obj) => { return obj.attr !== 'gestational_age' })
        // selectedFilters.push({ 'attr': 'gestational_age', 'selected': e, 'type': 'range' })
        // this.props.filterHandle(selectedFilters)
    }
    
    handleAddFilterRadio = (e) => {
        // if (e.target.checked === true) {
        //     selectedFilters.push(e.target.value)
        // } else {
        //     const index = selectedFilters.indexOf(e.target.value)
        //     selectedFilters.splice(index, 1)
        // }
        // this.props.filterHandle(selectedFilters)
    }

    handleDisabledChange = (disabled) => {
        this.setState({ disabled });
    }

    handleTagChange = (tag, checked) => {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t != tag)
        this.setState({ selectedTags: nextSelectedTags })
    }

    onChange = (value) => {
        // console.log('onChange: ', value);
    }

    onAfterChange = (value) => {
        // console.log('onAfterChange: ', value);
    }

    findByMatchingProperties = (set, properties) => {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                return entry[key] === properties[key];
            });
        });
    }

    removeEmpty = (filters, params) => {
    }

    handleAddFilter = (selectedCheckBoxes) => {
        console.log(selectedCheckBoxes)
        let value = Object.keys(_.groupBy(selectedCheckBoxes, 'value'))
        
        selectedCheckBoxes.map((_selected) => {
            if (this.findByMatchingProperties(this.selectedFilters, { 'collection': _selected['collection'] }).length !== 0) {
                this.selectedFilters.map((_filterParent, _filterParentIndex) => {
                    if (_filterParent['collection'] == _selected['collection']) {
                        if (this.findByMatchingProperties(_filterParent['filters'], { 'attr': _selected['attr'] }).length !== 0) {
                            _filterParent['filters'].map((_filterChild, _filterChildIndex) => {
                                if (_filterChild['attr'] == _selected['attr']) {
                                    this.selectedFilters[_filterParentIndex]['filters'][_filterChildIndex]['value'] = value
                                    this.selectedFilters[_filterParentIndex]['filters'][_filterChildIndex]['operator'] = '$in'
                                }
                            })
                        } else {
                            let filterChild = {}
                            filterChild['attr'] = _selected['attr']
                            filterChild['value'] = value
                            filterChild['operator'] = '$in'
                            this.selectedFilters[_filterParentIndex]['filters'].push(filterChild)
                        }
                    }
                })
            } else {
                let filterParent = {}
                filterParent['collection'] = _selected['collection']
                filterParent['filters'] = []
                let filterChild = {}
                filterChild['attr'] = _selected['attr']
                filterChild['value'] = value
                filterChild['operator'] = '$in'
                filterParent['filters'].push(filterChild)
                this.selectedFilters.push(filterParent)
            }
        })
    }

    render() {
        console.log("Render")
        const { disabled, selectedTags, visible } = this.state;
        const { filters } = this.state
        console.log(filters)
        return (
            (filters) ?

                <div>
                    {/* <Button type="primary" onClick={this.showDrawer}>
                        <FilterOutlined /> Filter
                    </Button> */}
                    <Drawer
                        title="Filters"
                        width={550}
                        onClose={this.props.handleClose}
                        visible={visible}
                        style={{
                            overflow: 'auto',
                            // height: 'calc(100% - 108px)',
                            // paddingBottom: '108px',
                        }}
                    >
                        <Form layout="vertical" hideRequiredMark>
                            {filters.map((category, i) => {
                                return (
                                    <React.Fragment>
                                        <Divider orientation="left" plain=" true"> {category.name} </Divider>
                                        {
                                            category.filters.map((filter) => {
                                                if (this.filterObj[filter.attr] === 'checkbox') {
                                                    return (
                                                        <Form.Item>
                                                            <h4> {filter.name} </h4>
                                                            <Checkbox.Group filter={filter.name} onChange={(e) => this.handleAddFilter(e, { collection: category, filter: filter })}>
                                                                {
                                                                    (Array.isArray(filter.value) && filter.value.length > 0) ?
                                                                        filter.value.map((_value) => {
                                                                            return (!('minVal' in filter.value) ? (<Checkbox key={category.collection+filter.attr+_value} onChange={()=>this.handleAddFilter} value={{ collection: category.collection, attr: filter.attr, value: _value }}>{_value}</Checkbox>) : null)
                                                                        })
                                                                        : null
                                                                }
                                                            </Checkbox.Group>
                                                            <br />
                                                            <br />
                                                        </Form.Item>
                                                    )
                                                } else if (this.filterObj[filter.attr] === 'slider') {
                                                    return (
                                                        <Form.Item>
                                                            {
                                                                (Array.isArray(filter.value) && filter.value.length > 0) ?
                                                                    filter.value.map((_value) => {
                                                                        return (
                                                                            <React.Fragment>
                                                                                <h4> {_value.name} </h4>
                                                                                <Slider
                                                                                    range
                                                                                    step={0.01}
                                                                                    defaultValue={[_value.minVal, _value.maxVal]}
                                                                                    min={_value.minVal}
                                                                                    max={_value.maxVal}
                                                                                    onChange={this.onChange}
                                                                                    onAfterChange={this.onAfterChange}
                                                                                />
                                                                                <br />
                                                                            </React.Fragment>)
                                                                    }) : null
                                                            }
                                                        </Form.Item>
                                                    )
                                                }
                                            })
                                        }
                                    </React.Fragment>
                                )
                            })}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0,
                                    width: '100%',
                                    borderTop: '1px solid #e9e9e9',
                                    padding: '10px 16px',
                                    background: '#fff',
                                    textAlign: 'right',
                                }}
                            >
                                <Form.Item>
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" onClick={this.handleSubmit} >
                                            Submit
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>

                    </Drawer>
                </div>
                : <div>Loading...</div>
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
)(FilterUI);
