import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Modal, Spin} from 'antd';
// import RenderImage from './QuadViewer2/UpdatedWrapper'
// import LoadNifti from '../Viewer/render_quadview/LoadNiftiAdvanced';
// import SimpleLoadNifti from '../Viewer/render_quadview/LoadNifti';

import {withStyles} from "@material-ui/core/styles/index";
import nifti from 'nifti-reader-js';
import {bindActionCreators} from "redux";
import * as AllActions from "../../actions";
import {connect} from "react-redux";

const emails = ['username@gmail.com', 'user02@gmail.com'];

const styles = theme => ({
    root: {
        width:'100%',
    }
})
class SimpleDialogDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: null,
            raw_data: null,
            header: null,
            filename: null
        }
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.getFile.header !==null) {
    //         if (nextProps.getFile.header.body.filename !== this.state.filename){
    //             var data = nifti.Utils.toArrayBuffer(nextProps.getFile.header.body.raw_data.data)
    //             var header = nifti.readHeader(data)
    //             var img_data = nifti.readImage(header, data)
    //             this.setState(
    //                 {
    //                     data: nextProps.getFile.header.body.raw_data.data,
    //                     header: header,
    //                     raw_data: nifti.decompress(data),
    //                     filename: nextProps.getFile.header.body.filename
    //             })
    //         }
    //     }
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.getFile.header !==null) {
            if (nextProps.getFile.header.body.filename !== prevState.filename){
                var data = nifti.Utils.toArrayBuffer(nextProps.getFile.header.body.raw_data.data)
                var header = nifti.readHeader(data)
                var img_data = nifti.readImage(header, data)
                return (
                    {
                        data: nextProps.getFile.header.body.raw_data.data,
                        header: header,
                        raw_data: data,
                        filename: nextProps.getFile.header.body.filename,
                        loading: nextProps.loading
                    })
            }
        }
    }
    handleClose=()=>{
        this.setState({
            data: null,
            raw_data: null,
            header: null
        })
        this.props.onClose()
    }

    render(){
        const { classes, onClose, selectedValue, type, segmentation, ...other } = this.props;
        return(
                <Modal width='100%' visible={this.props.open} onCancel={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                    {/* <RenderImage /> */}
                    {/* <div className={classes.root}>
                        {this.state.raw_data !==null ? <div> <RenderImage header={this.state.header} filename={this.state.filename}/>
                            { this.props.type? <LoadNifti segmentation={segmentation} header={this.state.header} filename={this.state.filename} maindata={this.state.raw_data} image={this.props.folderToOpen+'/'+this.props.imageToOpen}/>:
                                <SimpleLoadNifti segmentation={segmentation} header={this.state.header} filename={this.state.filename} maindata={this.state.raw_data} image={this.props.folderToOpen+'/'+this.props.imageToOpen}/>}</div> :
                                       null
                        }
                    </div> */}
                </Modal>
        )
    }
}

SimpleDialogDemo.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})

export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (withStyles(styles)(SimpleDialogDemo))
