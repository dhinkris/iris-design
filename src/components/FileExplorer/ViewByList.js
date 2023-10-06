import { Table, Tag, Progress, Modal } from 'antd';
import React from 'react';
import { SelectOutlined, NodeIndexOutlined } from "@ant-design/icons";
import SubjectModal from './ExplorerModal/SubjectModal';
import { Route, Link } from 'react-router-dom';
import Tree from "react-d3-tree";

import PropTypes from 'prop-types';
import _ from 'lodash';
const { Column } = Table
function onChange(pagination, filters, sorter) {
    // console.log('params', pagination, filters, sorter);
}

class ViewByList extends React.PureComponent {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        subjectToShow: null,
        openSubjectDetailsModal: false,
        redirect: false,
        isTreeVisible: false
    };

    componentDidMount() {
        this.setState({
            dataset: this.props.dataset
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataset.length!==this.props.dataset.length){
            this.setState({
                dataset: this.props.dataset
            })
        }
    }
    handleClose = () => {
        this.setState({ visible: false })
    }
    start = () => {
        this.setState({ loading: true });
        this.setState({
            selectedRowKeys: [],
            loading: false,
        });
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
        this.props.handleSelectedSubjects(selectedRowKeys);
    }

    handleSelectAll = () => {
        var selectedRowKeys = this.props.subjectList.map(({ sname }) => {
            return sname
        })
        this.setState({ selectedRowKeys });
        this.props.handleSelectedSubjects(selectedRowKeys);
    }

    handleSelectAll = () => {
        var selectedRowKeys = this.props.dataset.map(({ sname }) => {
            return sname
        })
        this.setState({ selectedRowKeys });
        this.props.handleSelectedSubjects(selectedRowKeys);
    }

    handleClose = () => {
        this.setState({ isTreeVisible: false })
    }
    renderTree = (data) => {
        // _.uniqBy(_.filter(this.state.dataset, _data => _data.ImagingBasicInfo.studyId === data), "ImagingBasicInfo._id")
        // console.log(_.uniqBy(_.filter(this.state.dataset, _data => _data.ImagingBasicInfo.studyId === data), ["ImagingBasicInfo._id","ImagingScanDetails.type"].join()))
        try {
            let treeObj = {}
            let filteredData = _.sortBy(_.filter(this.state.dataset, _data => _data.ImagingScanDetails.basicInfo === data._id), 'ImagingScanDetails.gestationalAgeAtScan')
            treeObj['name'] = data.studyId
            treeObj['children'] = []
            _.uniqBy(filteredData, v => [v.ImagingBasicInfo._id, v.ImagingScanDetails.type].join()).map((l1_data) => {
                let _treeObj1 = {}
                _treeObj1['name'] = l1_data.ImagingScanDetails.type
                _treeObj1['children'] = []
                treeObj['children'].push(_treeObj1)
                _.uniqBy(_.filter(filteredData, _v => _v.ImagingScanDetails.type === l1_data.ImagingScanDetails.type), v => [v.ImagingBasicInfo._id, v.ImagingScanDetails.type, v.ImagingScanDetails.scanNumber].join()).map((l2_data) => {
                    let _treeObj2 = {}
                    _treeObj2['name'] = "Scan" + l2_data.ImagingScanDetails.scanNumber
                    _treeObj2['children'] = []
                    _treeObj1['children'].push(_treeObj2)
                    _.uniqBy(_.filter(filteredData, _v => ((_v.ImagingScanDetails.scanNumber === l2_data.ImagingScanDetails.scanNumber) && (_v.ImagingScanDetails.type === l2_data.ImagingScanDetails.type))), v => v.ImagingFiles ? [v.ImagingBasicInfo._id, v.ImagingScanDetails.type, v.ImagingScanDetails.scanNumber, v.ImagingFiles.organ].join() : null).map((l3_data) => {
                        if (l3_data.ImagingFiles) {
                            let _treeObj3 = {}
                            _treeObj3['name'] = l3_data.ImagingFiles.organ
                            _treeObj3['children'] = []
                            _treeObj2['children'].push(_treeObj3)
                            _.uniqBy(_.filter(filteredData, _v => ((_v.ImagingScanDetails.scanNumber === l3_data.ImagingScanDetails.scanNumber) && (_v.ImagingScanDetails.type === l3_data.ImagingScanDetails.type) && (_v.ImagingFiles.organ === l3_data.ImagingFiles.organ))), v => v.ImagingMetrics ? [v.ImagingBasicInfo._id, v.ImagingScanDetails.type, v.ImagingScanDetails.scanNumber, v.ImagingFiles.organ, v.ImagingFiles.modality].join() : null).map((l4_data) => {
                                if (l4_data.ImagingFiles) {
                                    let _treeObj4 = {}
                                    _treeObj4['name'] = l4_data.ImagingFiles.modality
                                    _treeObj4['children'] = []
                                    _treeObj3['children'].push(_treeObj4)
                                    if (l4_data.ImagingMetrics.metrics.length !== 0) {
                                        _.uniqBy(_.filter(filteredData, _v =>
                                            ((_v.ImagingScanDetails.scanNumber === l4_data.ImagingScanDetails.scanNumber) &&
                                                (_v.ImagingScanDetails.type === l4_data.ImagingScanDetails.type) &&
                                                (_v.ImagingMetrics.organ === l4_data.ImagingFiles.organ) &&
                                                (_v.ImagingMetrics.modality === l4_data.ImagingFiles.modality) &&
                                                (_v.ImagingMetrics.metricType === l4_data.ImagingMetrics.metricType)
                                            )),

                                            v => v.ImagingMetrics ? [
                                                v.ImagingBasicInfo._id,
                                                v.ImagingScanDetails.type,
                                                v.ImagingScanDetails.scanNumber,
                                                v.ImagingMetrics.organ,
                                                v.ImagingMetrics.modality,
                                                v.ImagingMetrics.metricType,
                                                v.ImagingMetrics.metrics.length !== 0
                                            ].join()
                                                : null).map((l5_data) => {
                                                    let _treeObj5 = {}
                                                    _treeObj5['name'] = l5_data.ImagingMetrics.metricType
                                                    _treeObj5['children'] = []
                                                    _treeObj4['children'].push(_treeObj5)
                                                })
                                    }
                                }
                            })
                        }
                    })
                })
            })
            this.setState({ treeObj: treeObj, isTreeVisible: true })
        } catch (e) {
            this.setState({ treeObj: e, isTreeVisible: true })
        }

    }

    renderFilteredData = (data) => {
        return (_.sortBy(_.uniqBy((_.filter(this.state.dataset, _data => _data.ImagingBasicInfo.studyId === data.studyId & _data.ImagingBasicInfo.studyNameId === data.studyNameId)), 'ImagingScanDetails._id'), 'ImagingScanDetails.gestationalAgeAtScan')
            .map((item) => <Tag>
                {item.ImagingScanDetails.type + ':' + item.ImagingScanDetails.gestationalAgeAtScanString}
            </Tag>))
    }
    renderHealth = (data) => {
        return (<Progress
            width={'80%'}
            showInfo={false}
            size="small"
            percent={_.filter(this.state.dataset, _data => _data.ImagingScanDetails.basicInfo === data._id).length * 4}
            steps={20}
        />)
    }

    render() {
        const { dataset } = this.state
        const { loading, selectedRowKeys, isTreeVisible } = this.state;
        let filteredData = _.uniqBy(dataset, v => [v.ImagingBasicInfo._id, v.ImagingBasicInfo.studyName.name].join())

        const columns = [
            {
                title: 'Subject ID',
                dataIndex: ['ImagingBasicInfo', 'studyId'],
                sorter: (a, b) => a.ImagingBasicInfo.studyId - b.ImagingBasicInfo.studyId,
            },
            {
                title: 'Condition',
                dataIndex: ['ImagingBasicInfo', 'condition'],
                defaultSortOrder: 'descend',
            },
            {
                title: 'Study Group',
                dataIndex: ['ImagingBasicInfo', 'studyName', 'name'],
                defaultSortOrder: 'descend',
            },
            {
                title: 'Encounters',
                dataIndex: ['ImagingBasicInfo'],
                defaultSortOrder: 'descend',
                render: (item) => this.renderFilteredData(item)
            },
            {
                title: 'Data health',
                dataIndex: ['ImagingBasicInfo'],
                defaultSortOrder: 'descend',
                render: (item) => <> <a onClick={() => this.renderTree(item)} >{this.renderHealth(item)}<NodeIndexOutlined />  </a></>
            },
            {
                title: 'Action',
                key: 'action',
                dataIndex: ['ImagingScanDetails', 'studyId'],
                render: (a) => <Link to={{ pathname: `${this.props.match.url}/${a}`, state: { visible: true, id: a } }}>open</Link>
            }
        ]

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <Modal visible={isTreeVisible} onCancel={this.handleClose} width={1400} centered
                    style={{ height: '100vh' }} >
                    <div style={{ height: '100em' }}>
                        <Tree data={this.state.treeObj} orientation='vertical' translate={{ x: 600, y: 100 }} nodeSize={{ x: 100, y: 100 }} />
                    </div>
                </Modal>
                <Table rowSelection={rowSelection} style={{ marginTop: -10 }} columns={columns} rowKey={filteredData => filteredData.index} dataSource={filteredData} onChange={onChange} pagination={{ pageSize: 15 }} />
            </div>
        );
    }
}

export default ViewByList