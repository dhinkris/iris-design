import React from 'react';
import PropTypes from 'prop-types';
import * as AllActions from "../../../../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { Input } from 'antd';


class CreateComment extends React.Component{

    handleComment = (e)  => {
        this.props.actions.addSubjectComments(this.props.subjectToShow.sname, e.target.value)
        // this.props.actions.getSubjectComments(this.props.subjectToShow.sname);
        this.setState({refresh:'refreshed'})
    }
    render(){
        return(
            <div>
                <Input
                    placeholder="Enter your Comment"
                    enterButton="Search"
                    size="large"
                    // onSearch={value => console.log(value)}
                    onPressEnter={this.handleComment}
                />
            </div>
        )
    }
}

Comment.propTypes = {
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
) (CreateComment);
