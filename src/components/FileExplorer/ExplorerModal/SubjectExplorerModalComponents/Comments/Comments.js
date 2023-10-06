import React from 'react';
import PropTypes from 'prop-types';
import * as AllActions from "../../../../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Typography, Comment, Avatar, Form, Button, List, Input, Skeleton, Space
} from 'antd';


const TextArea = Input.TextArea;

const { Text, Link } = Typography;

class CommentArea extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    }
    // static getDerivedStateFromProps(nextProps, prevState){
    //     if (nextProps.subjectData.subjectCommentData!==null){
    //         if (nextProps.subjectData.subjectCommentData!==prevState.comments){
    //             return{
    //                 comments : nextProps.subjectData.subjectCommentData
    //             }
    //         }
    //     }
    // }
    async componentDidMount() { 
        await this.props.actions.getCommentsByRefId(this.props.basicInfo.ImagingScanDetails._id);
        this.setState({ comments: this.props.userComments.comments })
    }

    handleSubmit = async () => {
        await this.props.actions.addComments(this.props.basicInfo.ImagingScanDetails._id, this.state.value)
        await this.props.actions.getCommentsByRefId(this.props.basicInfo.ImagingScanDetails._id);
        this.setState({ comments: this.props.userComments.comments })
        if (!this.state.value) {
            return;
        }
        this.setState({
            submitting: true,
        });

        this.setState({
            submitting: false,
            value: ''
        });
    }
    handleDelete=async (id)=>{
        await this.props.actions.deleteComments(id)
        await this.props.actions.getCommentsByRefId(this.props.basicInfo.ImagingScanDetails._id);
        this.setState({ comments: this.props.userComments.comments })
    }
    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
    handleTimeFormat = (time) => {
        var date = new Date(time);
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
    }
    render() {
        const { comments, submitting, value } = this.state;

        return (
            <React.Fragment>
                <h3>Comments ({`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`})</h3>
                {
                    comments !== undefined && comments !== null ? <List
                        dataSource={comments}
                        // header={"Comments"+`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
                        itemLayout="horizontal"
                        renderItem={item => <li>
                            <Comment
                                actions={[<span onClick={()=>this.handleDelete(item._id)} key="comment-nested-reply-to">Delete</span>]}
                                author={item.userId}
                                avatar={<Avatar style={{marginRight: 20, color: '#ffffff', backgroundColor: '#ff2500'}}>{item.userId}</Avatar>}
                                content={item.text}
                                datetime={this.handleTimeFormat(item.createdAt)}
                            />
                        </li>}
                    /> : null
                }
                <TextArea onChange={this.handleChange} value={value} />
                <br/>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={this.handleSubmit}
                    type="primary"
                    style={{marginTop:10}}
                >
                    Add Comment
                </Button>
            </React.Fragment>
        )

    }
}


CommentArea.propTypes = {

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
)(CommentArea);
