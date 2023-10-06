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
    Util,
} from "bizcharts";
import DataSet from "@antv/data-set";
import _ from "lodash";

const boxShadow = { boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', border: '0px', textAlign: 'left', fontColor: 'gray', fontWeight: 'bold', padding: 20 }
const { RegionFilter, DataMarker, Region } = Guide;

class Arearangeline extends React.Component {
    state = { data: [] }
    reframeResiduals = (residual) => {
        var data = []
        _.range([Math.floor(residual.minRange)], Math.floor(residual.maxRange), 1).map((ga) => {
            let pct50 = ((residual.m.b0) + (residual.m.b1 * ga) + (residual.m.b2 * ga * ga))
            let pct05 = ((residual.h.b0) + (residual.h.b1 * ga) + (residual.h.b2 * ga * ga))
            let pct95 = ((residual.l.b0) + (residual.l.b1 * ga) + (residual.l.b2 * ga * ga))

            if ((pct05 > 0.03) && (pct50 > 0.03) && (pct95 > 0.03)) {
                data.push(
                    {
                        "GA": ga,
                        "pct50": pct50,
                        "pct05": pct05,
                        "pct95": pct95,
                    }
                )
            }
        }
        )
        return data
    }
    reframeToPlot = (toPlot) => {
        var data = []
        if (toPlot) {
            Object.keys(toPlot).map((_) => {
                data.push(
                    {
                        "GA": toPlot[_]['gestationalAgeAtScan'],
                        "value": toPlot[_][this.props.residual.roi]
                    })
            }
            )
        }

        // {
        //     date: "2014-08-06",
        //     type: "Client",
        //     version: "2.0",
        //     value: 11
        // }
        return data
    }
    formatter = (text, item) => {
        var point = item.point;
        var type = point["type"];
        return (
            '<div style="width: 20px;text-align: center;font-size: 12px;line-height: 1.2;color: #fff;margin-left: -8px;"><span>' +
            type +
            "</span><br><span>" +
            text +
            "</span></div>"
        );
    }

    componentDidMount() {
        const { residual } = this.props.residual
        // const { toPlot, title } = this.props
        this.setState({ data: this.reframeResiduals(residual), loading: false, toPlot: this.props.toPlot })
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.toPlot) !== JSON.stringify(this.props.toPlot)) {
            this.setState({ toPlot: this.props.toPlot })
        }
        if (JSON.stringify(prevProps.residual) !== JSON.stringify(this.props.residual)) {
            const { residual } = this.props.residual
            this.setState({ data: this.reframeResiduals(residual), loading: false, toPlot: this.props.toPlot })
        }
    }

    render() {
        let { data } = this.state
        const toPlot = this.reframeToPlot(this.state.toPlot)

        var dv = new DataSet.View()
            .source(data)
            .transform({
                type: "map",
                callback: function (row) {
                    row["5% - 95%"] = [row.pct05, row.pct95];
                    //   row["25% - 75%"] = [row.pct25 / 1000, row.pct75 / 1000];
                    row["Median"] = row.pct50;
                    return row;
                }
            })
            .transform({
                type: "fold",
                fields: ["5% - 95%"],
                key: "grade",
                value: "times"
            });
        const view1Scale = {
            "GA": {
                tickCount: 5,
                formatter: data => Math.round(data),
                alias: "Gestational age",
                type: "linear"
            },
            times: {
                min: data.length > 0 ? _.minBy(data, 'pct05').pct05 : 0,
                max: data.length > 0 ? _.maxBy(data, 'pct95').pct95 : 0,
                nice: false,
                alias: "Time(s)",
                tickCount: 5,
            },
            Median: {
                min: data.length > 0 ? _.minBy(data, 'pct05').pct05 : 0,
                max: data.length > 0 ? _.maxBy(data, 'pct95').pct95 : 0,
                nice: false,
                tickCount: 5,
                alias: "Volume (cc)"
            }
        };
        const view2Scale = {
            "GA": {
                tickCount: 5,
                formatter: data => Math.round(data),
                alias: "Gestational age"
            },
            GA: {
                type: "linear"
            }
        }
        return (
            <div style={{ padding: 20 }} style={boxShadow}>
                <p style={{ fontSize: 15, textAlign: 'center' }}>{this.props.residual.name}</p>
                <Chart padding={[70, 70, 70, 70]} forceFit>
                    {/* <Tooltip crosshairs /> */}
                    <View data={dv} scale={view1Scale}>
                        <Axis name="GA"
                            title={{
                                // autoRotate: true, 
                                offset: 40,
                                textStyle: {
                                    fontSize: '13',
                                    textAlign: 'center',
                                    fill: '#999',
                                    fontWeight: 'bold',
                                    //   rotate: {角度}
                                },
                                position: 'center',
                            }}
                        // autoRotate={true}
                        />
                        <Axis name="Median"
                            title={{
                                // autoRotate: true, 
                                offset: 40,
                                textStyle: {
                                    fontSize: '13',
                                    textAlign: 'center',
                                    fill: '#999',
                                    fontWeight: 'bold',
                                    //   rotate: {角度}
                                },
                                position: 'center',
                            }}
                        // autoRotate={true} 
                        />
                        <Geom
                            type="area"
                            position="GA*times"
                            color={["grade", ["#6060ff"]]}
                            shape="smooth"
                            opacity={0.5}
                        />
                        <Geom
                            type="line"
                            position="GA*Median"
                            color="#6060ff"
                            shape="smooth"
                            size={3}
                        />
                        <Guide>
                            {
                                toPlot.map((_toPlot) => (
                                    <DataMarker
                                        top
                                        position={[_toPlot['GA'], _toPlot['value']]}
                                        lineLength={1}
                                        style={{
                                            text: {
                                                textAlign: 'right',
                                                fontSize: 13,
                                            },
                                            point: {
                                                stroke: '#FF4D4F',
                                            },
                                        }}
                                    />
                                ))
                            }
                        </Guide>
                    </View>
                    {/* <View data={toPlot} scale={view2Scale}>
                        {/* <Tooltip visible={false} /> */}
                    {/* <Geom
                            type="interval"
                            position="GA*value"
                            color={["type", ["#ff7f00", "#093"]]}
                            size={3}
                        /> */}
                    {/* <Geom
                            type="interval"
                            position="GA*value"
                            color={["type", ["#ff7f00", "#093"]]}
                            size={10}
                        >

                        </Geom>
                    </View> */}
                </Chart>
            </div>
        )

    }
}

export default Arearangeline