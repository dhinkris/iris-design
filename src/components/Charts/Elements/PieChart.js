import React from "react";
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import {Row, Col} from 'antd';
import _ from 'lodash';

const boxShadow = { boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 30 }

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            churned: null
        }
    }

    componentDidMount() {
    //    this.churnData(this.props.dataset)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.dataset!==this.props.dataset){
        //    this.churnData(this.props.dataset)
        // }
    }

    render() {
        const { DataView } = DataSet;
        const { dataset, title, span } = this.props
        const cols = {
            percent: {
                formatter: val => {
                    return (val * 100).toFixed(2) + "%";
                }
            }
        };
        let id = 0;
        return (
            <>
                <Col span={span} style={boxShadow}>
                    <h2> {title} </h2>
                        <Chart
                            data={dataset}
                            forceFit
                            padding={[80,80,80,80]}
                            onIntervalClick={ev => {
                                const data = ev.data;
                                if (data) {
                                    const name = data._origin['name'];
                                }
                            }}
                        >
                            <Coord type="theta" />
                            <Tooltip showTitle={false} />
                            <Geom
                                type="intervalStack"
                                position="count"
                                color={["name", ["#7f8da9", "#fec514", "#db4c3c", "#daf0fd", "#F4F1DE", "#E07A5F","#3D405B", "#81B29A", "#F2CC8F"]]}
                            >
                                <Label content="name" textStyle={{
                                    fontSize: '20'
                                }} />
                            </Geom>
                    </Chart>
                </Col>
            </>

        );
    }
}

export default PieChart;