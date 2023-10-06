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

const boxShadow = { boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 30 }

export default class Stacked extends React.Component {
  render() {
    const { dataset, title, span } = this.props
    const ds = new DataSet();
    const dv = ds.createView().source(dataset);
    dv.transform({
      type: "fold",
      fields: this.props.fields,
      key: "年龄段",
      value: "count",
      retains: ['name'],
    });
    return (
        <>
            <Col span={span} style={boxShadow}>
                <div>
                    <h2> {title} </h2>
                    <Chart height={400} data={dv} forceFit>
                    <Legend />
                    <Coord transpose />
                    <Axis
                        name="State"
                        label={{
                        offset: 12
                        }}
                    />
                    <Axis name="人口数量" />
                    <Tooltip />
                    <Geom
                        type="intervalStack"
                        position="name*count"
                        color={"年龄段"}
                    />
                    </Chart>
                </div>
            </Col>
        </>
    );
  }
}