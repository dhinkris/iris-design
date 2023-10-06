import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import CreateChart from './ReportVariables'
import { Tabs, Button } from 'antd';
const TabPane = Tabs.TabPane;

class ROIInput extends React.Component {
    constructor(props) {
        super(props)
        this.newTabIndex = 1;
        const panes = [
            { title: `Scan${this.newTabIndex}`, key: `${this.newTabIndex}` },
        ]
        this.state = {
            residuals: this.props.residuals,
            activeKey: panes[0].key,
            objectHandler: { [panes[0].key]: {} },
            panes,
        }
        this.handleChange()
    }
    handleChange=()=>{
        this.props.handleCreateReport('panes', this.state.panes)
        this.props.handleCreateReport('activeKey', this.state.activeKey)
    }
    onChange = (activeKey) => {
        this.setState({ activeKey });
        this.handleChange()
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
        this.handleChange()
    }

    add = () => {
        const panes = this.state.panes;
        this.newTabIndex = parseInt(panes[panes.length - 1].key) + 1
        panes.push({ title: `Scan${this.newTabIndex}`, key: `${this.newTabIndex}` });
        let objectHandler = this.state.objectHandler
        objectHandler[`${this.newTabIndex}`] = {}
        this.setState({ panes, objectHandler });
        this.setState({ activeKey: `${this.newTabIndex}` })
        this.handleChange()
    }

    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
        this.handleChange()
    };


    render() {
        return (
            <div style={{ marginTop: 10 }}>
                <div >
                    <Button onClick={() => this.add()}>ADD</Button>
                </div>
                <Tabs
                    hideAdd
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                >
                    {
                        this.state.panes.map(pane =>
                            <TabPane tab={pane.title} key={pane.key}>
                                <CreateChart
                                    residuals={this.state.residuals}
                                    activeKey={pane.key}
                                    objectHandler={this.state.objectHandler}
                                    handleCreateReport={this.props.handleCreateReport}
                                // activeKey={pane.key} 
                                // handleCreateReport={this.props.handleCreateReport} 
                                // toLoad={this.props.toLoad}
                                />
                            </TabPane>)
                    }
                </Tabs>
            </div>
        );
    }
}

export default ROIInput