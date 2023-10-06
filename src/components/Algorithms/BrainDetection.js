import { Upload, Button } from 'antd';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from "react-redux";

import * as AllActions from '../../actions/index';


const steps = [{
    title: 'First',
    content: 'First-content',
}, {
    title: 'Second',
    content: 'Second-content',
}, {
    title: 'Last',
    content: 'Last-content',
}];

class Pipeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }


    render() {

        const props2 = {
            action: '//jsonplaceholder.typicode.com/posts/',
            className: 'upload-list-inline'
        };

        const { current } = this.state;
        return (
            <div style={{
                background: '#fff', padding: 24, margin: 0, minHeight: 280
            }}>
                {/* <Upload {...props2}>
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                </Upload> */}
            </div>
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
) (Pipeline);