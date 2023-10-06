import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../../style/index'
import * as AllActions from "../../../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Tabs, Table, Collapse, Space, Typography, Tag } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import _ from 'lodash'
import Viewer from '../../../Viewer2/Viewer'

const { Text, Link, Title } = Typography;
const { Panel } = Collapse; 
const { TabPane } = Tabs;
class PreprocessedFiles extends React.Component {
    state = {
        refresh: false,
        visible: false,
        filepaths: []
    }
    handleComment = () => {
        return
    }
    async componentDidMount() {
        await this.props.actions.getDatasetFiles(this.props.basicInfo.ImagingScanDetails._id)
        let filepaths = await this.props.dataExplorer.filepaths
        filepaths = _.uniqBy(filepaths, v => v.ImagingFiles?[v.ImagingFiles.modality,v.ImagingFiles.organ].join():null)
        this.setState({ filepaths: filepaths })
    }
   
    componentWillReceiveProps(nextProps) {
        this.setState({ refresh: nextProps.refresh })
    }
    handleClosed = () => {
        this.setState({
            showDialog: false,
            imageToOpen: '',
            folderToOpen: '',
            loading: false
        })
    };
    handleView = async (file, allFiles) => {
        // this.props.actions.fetchFiles(file.name);
        this.setState({ loading: true })
        await this.props.actions.fetchNiftiHeader(file.name)
        let segmentation = false
        if (file.name.split('/').slice(-1)[0].endsWith('_extracted.nii.gz') || file.name.split('/').slice(-1)[0].endsWith('_extracted_brain.nii.gz')) {
            segmentation = true
        }
        let segmentation_file = null
        if (allFiles[0].segmentations[0].name) {
            segmentation_file = allFiles[0].segmentations[0].name
        } else {
            segmentation_file = allFiles[0].segmentation_mask[0].name
        }
        this.setState({
            showDialog: true,
            imageToOpen: '',
            folderToOpen: '',
            segmentation: segmentation_file,
            type: segmentation,
            loading: false
        })
    }

    changeModality = (key) => {

    }
    handleModal = (baseImage) => {
        let segmentation = []
        this.state.filepaths.map((filepath) => {
            filepath.ImagingFiles.filePaths.map((_filepaths) => {
                _filepaths['value'].map((_files) => {
                    segmentation.push(_files.name)
                })
            })
        })


        this.setState({ visible: true, baseImage: baseImage, segmentation: segmentation })
    }
    handleClose = () => {
        this.setState({ visible: false })
    }
    render() {
        const { classes, subjectData, refresh } = this.props
        const { baseImage, segmentation, filepaths } = this.state

        const columns = [
            {
                title: 'Filename',
                name: "name",
                render: obj => <React.Fragment>{obj.name.split('/').slice(-1)[0]}</React.Fragment>
            },
            {
                title: 'Date modified',
                dataIndex: 'date_modified',
                key: 'date_modified'
            },
            {
                title: 'Modified By',
                dataIndex: 'owner',
                key: 'owner'
            },
            {
                title: 'Size',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: 'Action',
                name: 'action_buttons',
                render: name => <React.Fragment><Button type="primary" onClick={() => this.handleView(name, subjectData.subjectFileData)}> View</Button> <Button type="secondary">Copy Path</Button></React.Fragment>
            }
        ]

        return (
            <React.Fragment>
                <Viewer baseImage={baseImage}
                    segmentation={segmentation}
                    visible={this.state.visible} handleClose={this.handleClose} />
                <h3> Files </h3>
                <Tabs tabPosition="top">
                    {
                        filepaths.map((_filepaths, index)=> 
                            _filepaths.ImagingFiles?
                                    <TabPane tab={_filepaths.ImagingFiles.organ+' '+_filepaths.ImagingFiles.modality+' '+_filepaths.ImagingFiles.metricType} key={index}>
                                    {
                                        _filepaths.ImagingFiles.filePaths.map((_filepaths, _index) => {
                                            return (
                                                <Collapse>
                                                    <Panel header={_filepaths.name +"["+_filepaths['value'].length+"]"} key={_index}>
                                                    {
                                                        _filepaths['value'].map((_files) => {
                                                            return (
                                                                <Tag color="processing">
                                                                    <a type="primary" onClick={() => this.handleModal(_files.name)}>{_files.name.split('/').slice(-1)[0]}</a>
                                                                    <br />
                                                                </Tag>
                                                            )
                                                        })
                                                    }
                                                    </Panel>
                                                </Collapse>
                                            )
                                        })
                                    }
                                    </TabPane>: <p>No data</p>
                        )
                    }
                </Tabs>
            </React.Fragment>
        )
    }
}

Comment.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStatetoProps = (state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
)(withStyles(styles)(PreprocessedFiles));
