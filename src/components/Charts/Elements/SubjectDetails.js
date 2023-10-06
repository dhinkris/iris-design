import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Card, Input} from 'antd';

import * as AllActions from "../../../actions";

const { Meta } = Card;
const Search = Input.Search;

class SubjectDetails extends Component {
    render() {
        return (
            <div>Res</div>
        );
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
) (SubjectDetails);

