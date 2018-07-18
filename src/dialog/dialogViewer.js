import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import RenderImage from '../render_quadview/RenderImage';
import LoadNifti from '../render_quadview/LoadNifti';
import {withStyles} from "@material-ui/core/styles/index";

const emails = ['username@gmail.com', 'user02@gmail.com'];

const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 2,
        width:1600,
    }
})
class SimpleDialogDemo extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClose=()=>{
        this.props.onClose()
    }

    render(){
        const { classes, onClose, selectedValue, ...other } = this.props;
        console.log(classes.root)
        return(
                <Dialog maxWidth='100%' onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                    <div className={classes.root}>
                    {/*<div>*/}
                        {/*<p>{this.props.folderToOpen+'/'+this.props.imageToOpen}</p>*/}
                    {/*</div>*/}
                     <div>
                         <RenderImage/><LoadNifti image={this.props.folderToOpen+'/'+this.props.imageToOpen}/></div>
                    </div>
                </Dialog>
        )
    }
}

SimpleDialogDemo.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};


export default withStyles(styles)(SimpleDialogDemo);