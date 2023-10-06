import {Row, Col} from 'antd';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from "react-redux";

import * as AllActions from '../../../actions';

class Status extends Component{
    render(){
        return(
            <div>

            </div>
        )
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
) (Status);