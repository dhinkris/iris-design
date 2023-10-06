import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

class Error extends React.Component  {
    render() {
        return(
            <div>
                <Alert message={this.props.error} type="error" />
            </div>
        )
    }
}

export default Error;