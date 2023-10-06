import React, { Component } from 'react'
import WordCloud from 'react-d3-cloud';
import {Row, Col} from 'antd';

const boxShadow = { boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 30 }

class SimpleWordcloud extends Component{
    componentWillMount() {
        this.setState({ _dataset: this.props.dataset})
    }
    render(){
        const { _dataset, title, span } = this.state
        const fontSizeMapper = word => Math.log2(word.value) * 5;

        return(
            <Col span={span} style={boxShadow}>{_dataset ? <WordCloud
                data={_dataset}
                width={500}
                height={500}
                fontSizeMapper={fontSizeMapper}
              /> : <span>No data...</span>} </Col>
        )
    }
}

export default SimpleWordcloud;