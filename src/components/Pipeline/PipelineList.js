import React, { Component } from 'react';
import { CloudOutlined, RightSquareOutlined, PlayCircleFilled, PaperClipOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Button, Card, Skeleton, Input, Divider, Tag } from 'antd';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Hashicon } from '@emeraldpay/hashicon-react'
import { pipelines }  from './List/' 
const { Meta } = Card;
const Search = Input.Search;

class PipelineList extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false }
    }

    render() {
        const { loading } = this.state
        return (
            <React.Fragment>
                <div style={{ background: '#fff', padding: 20, margin: 0, minHeight: 280 }}>
                    <Row gutter={24}>
                        {
                            Object.keys(pipelines).map((_) => {
                                let pipeline=pipelines[_]
                                return(
                                    <Col span={8} id={pipeline.name} style={{marginTop:40}} >
                                        <Card
                                            actions={[
                                                <Link to={`/pipeline/${_}`}> <Button type='link' icon={<PlayCircleFilled />}>Start</Button></Link>,
                                                <Link to='/publications'> <Button type='link' icon={<PaperClipOutlined />}>Publications</Button></Link>,
                                            ]}
                                        >
                                            <Skeleton loading={loading} avatar active>
                                                <Meta
                                                    // avatar={[]}
                                                    title={[<React.Fragment><span>{pipeline.name}</span><Tag style={{marginLeft: 10}} color={pipeline.type==='pipeline'? 'blue': 'yellow'}>{pipeline.type}</Tag></React.Fragment>]}
                                                    description={<>
                                                        <Row gutter={24}>
                                                            <Col span={20}>
                                                                <div style={{ marginTop: 20 }}>Input  <Tag color="magenta">{pipeline.inputModality}</Tag></div>
                                                                <div style={{ marginTop: 20 }}>Output <Tag color="magenta">{pipeline.outputModality}</Tag></div>
                                                                <div style={{ marginTop: 20 }}>{pipeline.name}</div>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Hashicon value={_} size={150} />
                                                            </Col>
                                                        </Row>
                                                    </>}
                                                />
                                            </Skeleton>
                                        </Card>
                                    </Col>)
                            })
                        }
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default PipelineList;