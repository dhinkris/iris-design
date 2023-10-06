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
import { Row, Col } from 'antd';
import _ from 'lodash';

const boxShadow = { boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 40 }

class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { DataView } = DataSet;
        const { dataset, title, span, transpose, scale, padding } = this.props
        const cols = {
            percent: {
                formatter: val => {
                    return (val * 100).toFixed(2) + "%";
                }
            }
        }

        const styles = {
            subTitle: {
                fontSize: 18,
                color: '#333',
                display: 'block',
                padding: 10,
                textAlign: 'center'
            }
        }

        let id = 0
        
        return (
            <>
                <Col span={span} style={boxShadow}>
                    <h2> {title} </h2>
                    <Chart
                        data={dataset}
                        padding={padding}
                        scale={scale}
                        forceFit
                    >
                        <Coord transpose={transpose} />
                        <Axis
                            labels="name"
                            title="name"
                        />
                        <Axis
                            labels="count"
                            title="count"
                        />
                        <Geom
                            type="interval"
                            position="name*count"
                            color={["name", ["#db4c3c"]]}
                        >
                        </Geom>
                        <Tooltip />
                    </Chart>
                </Col>
            </>
        );
    }
}

export default PieChart;

