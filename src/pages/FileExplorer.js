import { Table, Input, InputNumber, Popconfirm, Form, notification, Card, Col, Skeleton, Avatar, Row, Tag, Radio, Button } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Spin, Layout, Badge } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BrowserRouter, Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import _ from 'lodash';
import { FilterOutlined } from '@ant-design/icons'
import * as AllActions from "../actions";
import Filter from '../components/Filter/Filter';

// import GridView from '../components/FileExplorer/ViewByID';
import ListView from '../components/FileExplorer/ViewByList';
import ChartView from '../components/FileExplorer/ViewByCharts';
import DownloadCSVModal from '../components/FileExplorer/DownloadCSV/DownloadCSV'
import SavedFilters from '../components/FileExplorer/SavedFilters'
import params from "../data/dataModel";
import TopStats from '../components/FileExplorer/TopStats';
import SubjectModal from '../components/FileExplorer/ExplorerModal/SubjectModal';

const data = [];
const Search = Input.Search;
const { Meta } = Card;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const { Header, Content, Footer, Sider } = Layout;

const openNotification = () => {
    notification.open({
        message: 'Successfully logged in',
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};
class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { toView: 'listView', searched: false, filter: false, datasetLoader: false, openFiltersModal: false } //default views
    }

    async componentDidMount() {
        await this.props.actions.getDatasetBasicInfo();
        this.updateDataset();
    }

    updateDataset =   () => {
        this.setState({ datasetLoader: true })
        this.setState({ dataset: this.props.dataExplorer.dataset })
        this.setState({ datasetLoader: false })
    }

    componentWillUnmount = () => {
        // this.props.dataExplorer.dataset = null
    }

    openLoader = () => {
        return (
            <Content style={{
                background: '#fff', padding: 24, marginTop: 20, minHeight: 280, textAlign: 'center'
            }}>
                <Spin size="large" />
            </Content>
        )
    }

    handleSearch = async (e) => {
        // if (e.keyCode == 8) { 
        //     console.log('Backspace')
        // }    
        await this.setState({ dataset: this.props.dataExplorer.dataset, searched: true })
        if (e.length > 0) {
            var searchedSubject = _.filter(this.state.dataset, (subject) => {
                if (new RegExp(e + "$").test(subject.ImagingScanDetails.studyId)) {
                    return (subject.ImagingScanDetails.studyId)
                }
            })
            this.setState({ dataset: searchedSubject, searched: true })
        } else {
            this.setState({ dataset: this.props.dataExplorer.dataset, searched: true })
        }
    }
    onKeyDown = () => {
        console.log('Down')
    }

    handleOpenModal = (subject) => {
        this.setState({ openSubjectDetailsModal: true, subjectToShow: subject })
    }

    handleSwitch = (e) => {
        this.setState({
            toView: e.target.value
        })
    }

    filterSliderHandle = (selected_filters) => {
        var filteredSubject = null
        var result = selected_filters.map((eachFilter) => {
            if (this.state.checkbox === true) {
                filteredSubject = _.filter(this.state.dataset, (dataset) => {
                    return dataset[eachFilter.attr] >= eachFilter.selected[0] && dataset[eachFilter.attr] <= eachFilter.selected[1]
                })
                this.setState({ dataset: filteredSubject, filter: true, slider: true, lengthOfSubjects: filteredSubject.length })
            } else {
                filteredSubject = _.filter(this.props.dataExplorer.dataset, (dataset) => {
                    return dataset[eachFilter.attr] >= eachFilter.selected[0] && dataset[eachFilter.attr] <= eachFilter.selected[1]
                })
                this.setState({ dataset: filteredSubject, filter: true, slider: true, lengthOfSubjects: filteredSubject.length })
            }

        })
        // console.log(_.filter(this.state.dataset, (dataset) => {
        //     return dataset[selected_filters.attr] >= selected_filters.selected[0] && dataset[selected_filters.attr] <= selected_filters.selected[0]
        // }))
    }

    filterHandle = (selected_filters) => {
        var filteredSubject = null
        var groupedRangeObject = {}
        var groupedCheckBoxObject = {}
        //refresh the dataset everytime onChange
        var dataset = this.props.dataExplorer.dataset

        // split range and checkbox in to two group
        var groupedFilterbyRangeType = _.filter(selected_filters, function (filters) {
            return filters.type === 'range'
        })
        var groupedFilterbyCheckBoxType = _.groupBy(_.filter(selected_filters, function (filters) {
            return filters.type === 'checkbox'
        }), function (filters) { return filters.attr })

        // apply range filter
        groupedFilterbyRangeType.map((eachFilter) => {
            dataset = _.filter(this.props.dataExplorer.dataset, (dataset) => {
                return dataset[eachFilter.attr] >= eachFilter.selected[0] && dataset[eachFilter.attr] <= eachFilter.selected[1]
            })
        })

        //restructure the filter parameters data into object
        //(INITIAL)  {cohort: {selected: "case", attr: "cohort", type: "checkbox"}
        //                   {selected: "control", attr: "cohort", type: "checkbox"}
        //          study_group: {selected: "ABC", attr: "study_group", type: "checkbox"}}
        //(RESTRUCTURING}   {cohort : ["case", "control"], study_group : ["ABC"]}
        Object.keys(groupedFilterbyCheckBoxType).map((filterKeys) => {
            var filterArray = []
            groupedFilterbyCheckBoxType[filterKeys].map((filterValues) => {
                filterArray.push(filterValues.selected)
            })
            groupedCheckBoxObject[filterKeys] = filterArray
        })
        var nestedFilter = (targetArray, filters) => {
            var filterKeys = Object.keys(filters);
            return targetArray.filter(function (eachObj) {
                return filterKeys.every(function (eachKey) {
                    if (!filters[eachKey].length) {
                        return true;
                    }
                    return filters[eachKey].includes(eachObj[eachKey]);
                })
            })
        }
        filteredSubject = nestedFilter(dataset, groupedCheckBoxObject)
        this.setState({ dataset: filteredSubject, filter: true, lengthOfSubjects: filteredSubject.length })
    }

    handleOpenModal = () => {
        this.setState({ openSubjectDetailsModal: true })
    }

    handleFiltersModel = () => {
        this.setState({ openFiltersModal: true })
    }
    handleSavedFiltersModel = () => {
        this.setState({ openSavedFiltersModal: true })
    }
    handleClose = () => {
        this.setState({ openFiltersModal: false, openSavedFiltersModal: false })
    }
    handleSelectedSubjects = (selectedSubjects) => {
        this.setState({ selectedSubjects: selectedSubjects })
    }
    handleReset = async () => {
        this.setState({ datasetLoader: true })
        await this.props.actions.getDatasetBasicInfo();
        this.updateDataset();
    }
    render() {
        const { openFiltersModal, selectedSubjects, datasetLoader, openSavedFiltersModal } = this.state;
        let { dataset } = this.state
        // dataset = _.uniqBy(dataset, 'ImagingScanDetails._id')
        if (this.props.dataExplorer.error) {
            { console.log('redict') }
            return (<Redirect to={{ pathname: '/login' }} />)
        }
        else if (!dataset) {
            return (
                <Content style={{
                    background: '#fff', padding: 24, marginTop: 20, minHeight: 280, textAlign: 'center'
                }}>
                    <Spin size="large" />
                </Content>
            )
        } else {
            return (
                <React.Fragment>
                    <DownloadCSVModal selectedSubjects={selectedSubjects} visible={this.state.openSubjectDetailsModal} handleClose={this.handleClose} />
                    <SavedFilters handleClose={this.handleClose} visible={openSavedFiltersModal} updateDataset={this.updateDataset} />
                    <div style={{ padding: 20 }}>
                        <div style={{
                            background: '#fff', margin: 0, minHeight: 220
                        }}>
                            <Row gutter={24}>
                                <Col span={10}>
                                    <Filter filterHandle={this.filterHandle} visible={openFiltersModal} handleClose={this.handleClose} updateDataset={this.updateDataset} />
                                    <>
                                        <Button type="primary" onClick={this.handleFiltersModel} > <FilterOutlined /> Filter </Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.handleSavedFiltersModel}>Saved filters</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.handleReset}>Reset</Button>
                                    </>
                                </Col>
                                <Col span={10} offset={4} style={{ textAlign: 'right' }}>
                                    <Radio.Group style={{ marginLeft: 10 }} onChange={this.handleSwitch}>
                                        {/* <Link to='/fileexplorer/gridView'><Radio.Button value="gridView">Grid View</Radio.Button></Link> */}
                                        <Radio.Button value="listView"><Link to={`${this.props.match.url}/listview`}>List View</Link></Radio.Button>
                                        <Radio.Button value="chartView"><Link to={`${this.props.match.url}/chartview`}>Chart View</Link></Radio.Button>
                                    </Radio.Group>
                                </Col>
                                {/* <Col span={8}>
                                    <Button type="danger" onClick={this.handleOpenModal}>Download as CSV</Button>
                                </Col> */}

                            </Row>
                            <Search
                                style={{ marginTop: 10 }}
                                placeholder="Enter your Subject ID"
                                enterButton="Search"
                                size="large"
                                onSearch={this.handleSearch}
                            />
                            <TopStats dataset={dataset} />
                        </div>
                        { console.log(datasetLoader) }
                        <Spin style={{ marginTop: 5 }} spinning={datasetLoader}>
                            <Content style={{
                                background: '#fff', margin: 0, minHeight: 280, padding: 20
                            }}>
                                {/* <Route path='/fileexplorer/gridView' render={props => <Content><GridView actions={{...props.actions}} groped_by_subject_id={groped_by_subject_id}/></Content>} /> */}
                                {/* <Route path='/fileexplorer/listView:id' render={props => <Content><ChartView dataset={dataset}/></Content>}/> */}
                                <Switch>
                                    <Route path={`${this.props.match.url}/listview`} exact render={props => <Content><ListView dataset={dataset} handleSelectedSubjects={this.handleSelectedSubjects} {...props} /></Content>} />
                                    <Route path={`${this.props.match.url}/chartview`} exact render={props => <Content><ChartView dataset={dataset} {...props} /></Content>} />
                                    <Route path={`${this.props.match.url}/listview/:id`} render={props => <SubjectModal {...props} />} />
                                </Switch>
                                {/*{ toView === 'gridView' ? <GridView actions={this.props.actions} groped_by_subject_id={groped_by_subject_id}/>:toView === 'listView'? <ListView dataset={dataset} handleSelectedSubjects={this.handleSelectedSubjects} />: <ChartView dataset={dataset}/> }*/}
                            </Content>
                        </Spin>
                    </div>

                </React.Fragment>
            );
        }
    }
}

ListTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
)((ListTable));
