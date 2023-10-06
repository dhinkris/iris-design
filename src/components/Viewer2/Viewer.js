import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Modal, Spin} from 'antd';
import RenderImage from './QuadViewer/UpdatedWrapper'
// import LoadNifti from '../Viewer/render_quadview/LoadNiftiAdvanced';
// import SimpleLoadNifti from '../Viewer/render_quadview/LoadNifti';

import {withStyles} from "@material-ui/core/styles/index";
import nifti from 'nifti-reader-js';
import {bindActionCreators} from "redux";
import * as AllActions from "../../actions";
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        width:'100%',
    }
})
class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            data: null,
            raw_data: null,
            header: null,
            filename: null
        }
    }
    componentDidMount() {
        this.setState({visible: this.props.visible})
    }
    componentDidUpdate(prevProps, prevState){
        if (prevProps.visible!==this.props.visible){
            this.setState({visible: this.props.visible})
        }
    }

    render(){
        const { classes, onClose, selectedValue, type, segmentation, ...other } = this.props;
        const { visible } = this.state
        return(
                <Modal width='100%' 
                    centered  
                        style={{margin:0, top: 0, bottom: 0, left: 0, right: 0, height: '100vh' }} 
                        bodyStyle={{margin:0, padding:0}}
                        visible = {visible}
                        aria-labelledby="simple-dialog-title" 
                        mask={false}
                        footer={null}
                        destroyOnClose={true}
                        >
                        <RenderImage baseImage={this.props.baseImage} segmentation={this.props.segmentation} handleClose={()=>this.props.handleClose()}/>
                </Modal>
        )
    }
}

Viewer.propTypes = {
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
) (withStyles(styles)(Viewer))
