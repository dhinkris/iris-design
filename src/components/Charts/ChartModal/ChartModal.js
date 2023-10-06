import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {Modal, Button, List, Tag, Tabs, Row, Col} from 'antd';
import FetalGrowth from "../../../components/Charts/Groups/FetalGrowth";
import _ from 'lodash'
import Nomograms from '../Elements/_Nomogram';

const { TabPane } = Tabs;

class ChartModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        this.setState({ visible: this.props.visible })
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.visible!==this.props.visible){
            this.setState({
                visible: this.props.visible,
            })
        }

        if (prevState.userReport!==this.props.userReport){
            this.setState({
                userReport: this.props.userReport
            })
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false
        });
    }

    render() {
        const {classes , residuals, toPlot} = this.props;
        const { userReport } = this.state
        let _residuals = userReport? _.groupBy(userReport.residuals, v => [v.type, v.organ, v.metricType, v.modality].join()): null
        console.log(_residuals)
        const {visible} = this.state
        return(
            <>
                {
                    _residuals?
                    <Modal
                        title={this.props.subjectID}
                        visible={visible}
                        onCancel={this.props.handleClose}
                        width='100%'
                        bodyStyle={{height:'100%'}}
                    >
                        <Row gutter={24}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Tabs defaultValue={Object.keys(_residuals)[0]} buttonStyle="solid" defaultActiveKey="0" centered>
                                    {
                                        Object.keys(_residuals).map((_residual, index) => {
                                            return (
                                                <TabPane tab={_residual} key={index}>
                                                    <Row gutter={24}>
                                                        {
                                                            _residuals[_residual].map((_) => {
                                                                return (<Col span={6}><Nomograms residual={_} toPlot={userReport.toPlot}></Nomograms></Col>)
                                                            })
                                                        }
                                                    </Row>
                                                </TabPane>
                                            )
                                        })
                                    }
                                </Tabs>
                            </Col>
                        </Row>
                    </Modal>: null
                }
            </>
        )
    }
}

export default ChartModal;
