import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AllActions from '../../actions/index'
import styles from '../../style/index';
import FileExplorer from '../../pages/FileExplorer';

class Index extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const { classes, subjectList } = this.props;
        if (subjectList === null){
            return <div className={classes.content}>Loading...</div>
        }
        if (subjectList !== null){
            return (
                <div>
                    <FileExplorer data={subjectList.subjectList}/>
                </div>
            );
        }
    }
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
) (Index);