import { Skeleton, Switch, Card, Modal, Radio, Table, Tag, Button, notification, Popover } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as AllActions from '../actions'
import PropTypes from "prop-types";
import Input from "antd/es/input";
import ChartModal from "../components/Charts/ChartModal/ChartModal";
import { Link } from 'react-router-dom';
// import roi from "../data/roi_residuals"
import _ from "lodash";
import Share from '../components/Charts/GenerateReport/Share';
const confirm = Modal.confirm

class MyReports extends Component {
    constructor(props) {
        super();
        this.state = {
            visible: false
        }
    }

    async componentDidMount() {
        await this.props.actions.getUserReport()
        this.setState({ userReport: this.props.reports.userReport })
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props.reports.fetchedReportsData !==prevState.userReport) {
    //         this.setState({
    //             userReport: this.props.reports.fetchedReportsData
    //         })
    //     }
    // }

    // componentWillMount(){
    //     this.props.actions.fetchUserReport(localStorage.getItem('userDetails'))
    // }

    // handleChange = (e) => {
    //     this.setState({
    //         assigntoID: e.target.value
    //     })
    // }
    // handleAssignID=(report) => (e) => {
    // }

    handleAssign = (id) => {
        this.setState({ visible: true, reportId: id })
    }

    // handleCloseAssignTab=()=>{
    //     this.setState({
    //         visibleAssign: false
    //     })
    // }

    // handleOk = () => {
    //     if (this.state.assigntoID!==null) {
    //         let assignreport = this.state.report
    //         assignreport.assigned_by = this.state.report.user_id
    //         assignreport.user_id = this.state.assigntoID
    //         this.props.actions.saveUserReport(assignreport)
    //         this.props.actions.fetchUserReport(localStorage.getItem('userDetails'))
    //         this.setState({visibleAssign: false})
    //     }
    // }
    
    handleOk = async (user) => {
        let report = _.find(this.props.reports.userReport, data => data._id === this.state.reportId)
        await this.props.actions.shareUserReport({ 'state': report.state, 'userId': user._id })
        await this.props.actions.getUserReport()
        await this.setState({ userReport: this.props.reports.userReport, visible: false })
    }

    handleClose = () => {
        console.log('Close')
        this.setState({ showModal: false })
    }

    handleView = async (id) => {
        this.setState({ showModal: true})
        await this.props.actions.getUserReport()
        await this.setState({ selectedUserReport:  _.find(this.props.reports.userReport, data => data._id === id).state })
    }
    handleDelete = async (id) => {
        await this.props.actions.deleteUserReport(id)
        await this.props.actions.getUserReport()
        if (this.props.reports.error===null){
            this.setState({ userReport: this.props.reports.userReport })
        } else {
            this.setState({ userReport: [] })
        }
    }

    render() {
        const { userReport, visible, reportId } = this.state
        const columns = [{
            title: 'Report name',
            dataIndex: 'state',
            render: state=> <>{state.name}</>
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
        },
        {
            title: 'User',
            dataIndex: 'user',
            render: user=> <>{user.firstName}</>
        },
        {
            title: 'Assigned by',
            dataIndex: 'sharedBy',
            render: sharedBy=> <>{sharedBy? sharedBy.firstName : null}</>
        },
        {

        },
        {
            title: 'Actions',
            dataIndex: '_id',
            render: id => <React.Fragment>
                <Button type="primary" onClick={()=> this.handleView(id)}> View </Button>
                <Button onClick={() => this.handleAssign(id)} type="secondary" style={{ marginLeft: '10px' }}>Share</Button>
                <Button onClick={() => this.handleDelete(id)} type="danger" style={{ marginLeft: '10px' }}>Delete</Button>
            </React.Fragment>
        }
        ]
        return (
            <div style={{ padding: '40px' }}>
                <Share visible={this.state.visible} handleOk={this.handleOk} handleCancel={this.handleCancel} reportId={reportId} />
                <Table style={{ marginTop: 10 }} columns={columns} rowKey={userReport => userReport} dataSource={userReport} pagination={{ pageSize: 15 }} />
                <Modal
                    title=""
                    visible={this.state.visibleAssign}
                    onOk={this.handleOk}
                    onCancel={this.handleCloseAssignTab}
                >
                    <p>Enter the user id</p><Input onChange={this.handleChange}/>
                </Modal>
                { this.state.selectedUserReport !==null ? 
                        <ChartModal userReport={this.state.selectedUserReport} 
                                    visible={this.state.showModal} 
                                    handleClose={this.handleClose}
                                    />: null}
            </div>
        )
    }
}

MyReports.propTypes = {
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
)((MyReports));
