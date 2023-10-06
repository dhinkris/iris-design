import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot, ReferenceArea, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import Label from "recharts/es6/component/Label";

class LineCharts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plots: null
        }
    }
    componentDidMount() {
        const residual = _.find(this.props.residuals, { metricType: this.props.metricType, modality: this.props.modality, organ: this.props.organ, roi: this.props.roi, type: this.props.type }).residual

        // const { toPlot, title } = this.props
        var tbv_results = []
        _.range([Math.floor(residual.minRange)], Math.floor(residual.maxRange), 1).map((ga) => tbv_results.push(
            {
                "GA": ga,
                "normal_": (residual.m.b0) + (residual.m.b1 * ga) + (residual.m.b2 * ga * ga),
                "upper_": (residual.h.b0) + (residual.h.b1 * ga) + (residual.h.b2 * ga * ga),
                "lower_": (residual.l.b0) + (residual.l.b1 * ga) + (residual.l.b2 * ga * ga),
            }
        ))
        this.setState({ plots: tbv_results })
    }
    render() {

        const { plots } = this.state

        // tbv_results = _.filter(tbv_results, (o)=>{return o.upper_ >0})
        // tbv_results = _.filter(tbv_results, (o)=>{return o.normal_ >0})
        // tbv_results = _.filter(tbv_results, (o)=>{return o.lower_ >0})
        return (
            <div style={{ padding: 20, zIndex: 99 }}>
                <React.Fragment >
                    <p style={{ fontSize: 30, textAlign: 'center' }}>{this.props.name}</p>
                    {
                        plots !== null ?
                            <ResponsiveContainer height={600}>
                                <LineChart data={plots} style={{ textAlign: 'center' }}>
                                    <CartesianGrid strokeDasharray="4 4" />
                                    <YAxis dataKey="normal_"><Label position='insideLeft' angle={-90} value="Volume (in CC)" /></YAxis>
                                    <XAxis dataKey="GA"> <Label position='insideBottom' offset={-5} value="Gestational Age (in weeks)" /> </XAxis>
                                    <Tooltip />
                                    <Line type="monotone" dataKey="normal_" stroke="#8884d8" dot={false} strokeWidth={5} />
                                    <ReferenceDot x={this.props.gestationalAgeAtScan} y={this.props.value} />
                                    <ReferenceDot x={this.props.gestationalAgeAtScan} y={this.props.value} fill='red' r={5} strokeWidth={0} />
                                    <Line type="monotone" dataKey="upper_" stroke="#8884d8" dot={false} />
                                    <Line type="monotone" dataKey="lower_" stroke="#8884d8" dot={false} />
                                </LineChart>
                            </ResponsiveContainer> : <div>Unable to render plots</div>
                    }
                </React.Fragment>
            </div>
        );
    }
}

export default LineCharts;
