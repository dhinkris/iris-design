import {Card, Col, Row, Tag, List} from "antd";
import React from "react";
import {Route, Link, withRouter, Redirect} from 'react-router-dom';
import SubjectModel from './ExplorerModal/SubjectModal';
import {bindActionCreators} from "redux";
import * as AllActions from "../../actions";
import connect from "react-redux/es/connect/connect";

class ViewByID extends React.Component {
    state={
        subjectToShow: null,
        openSubjectDetailsModal: false,
        redirect: false
    }
    handleOpenModal = (subjectToShow)=> {
        this.props.actions.getSubjectROIs(subjectToShow.sname);
        this.props.actions.getSubjectFile(subjectToShow.sname);
        this.props.actions.getSubjectComments(subjectToShow.sname);
        this.setState({openSubjectDetailsModal: true, subjectToShow: subjectToShow})
    }
    handleClose=()=>{
        this.setState({openSubjectDetailsModal: false})
    }
    render(){
        return(
            <React.Fragment>
                {/* <SubjectModel subjectToShow={this.state.subjectToShow} visible={this.state.openSubjectDetailsModal} handleClose={this.handleClose}/> */}
                {/*{*/}
                    {/*this.state.redirect? <Redirect to='/fileexplorer/gridView/' /> : null*/}
                {/*}*/}
                {/*<Route path="/fileexplorer/gridView/:visible/:sname" component={(props) => <SubjectModel {...props} subjectToShow={this.state.subjectToShow} visible={{...props.match.params.visible}} handleClose={this.handleClose}/>}/>*/}

                <Route path="/fileexplorer/listView/:id" component={(props)=><SubjectModel subjectToShow={this.state.subjectToShow} visible={this.state.openSubjectDetailsModal} handleClose={this.handleClose} {...props} />}/>
                <Row gutter={24}>
                    <List
                        itemLayout='vertical'
                        size='large'
                        pagination={{pageSize: 10}} //onChange:(page)=>{console.log(page)}
                        dataSource={Object.keys(this.props.groped_by_subject_id)}
                        renderItem={subject=>(
                            <List.Item
                                key={subject.title}
                                // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                            >
                                <List.Item.Meta
                                    title={subject}
                                />
                                <Card style={{ marginTop: 16 }}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            {
                                                this.props.groped_by_subject_id[subject].map((eachSubject) => {
                                                    return(
                                                        <Tag color="red"  onClick={() => this.handleOpenModal(eachSubject)} key={eachSubject.sname}>{eachSubject.sname+' | '+eachSubject.cohort}</Tag>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Row>
            </React.Fragment>)
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
) (withRouter(ViewByID));