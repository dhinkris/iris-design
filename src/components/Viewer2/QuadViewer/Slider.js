import React from 'react';
import PropTypes from 'prop-types';

import { Slider, InputNumber, Row, Col } from 'antd';

class OpacitySlider extends React.Component {
    state = {
        inputValue: 1,
    };

    onChange = value => {
        this.setState({
            inputValue: value,
        });
        this.props.handleBrushSize(value)
    };

    render() {
        const { inputValue } = this.state;
        return (
            <Row>
                <Col span={16}>
                    <Slider
                        min={1}
                        max={100}
                        onChange={this.onChange}
                        style={{ width:200 }}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                </Col>
                <Col span={6}>
                    {/*<span style={{ margin: '0 30px' }}*/}
                          {/*value={inputValue}>*/}
                    {/*</span>*/}
                    <InputNumber
                        min={1}
                        max={100}
                        style={{ margin: '0 10px' }}
                        value={inputValue}
                        onChange={this.onChange}
                    />
                </Col>
            </Row>
        );
    }
}

export default OpacitySlider;