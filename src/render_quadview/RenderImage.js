import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TestAMI from './TestAMI';
import * as THREE from 'three';
import LoadNifti from './LoadNifti';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height:400,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor:'black',
        flexWrap:'wrap',
    },
    viewer: {
        width: '100%',
        height: '100%',
        // display: '-webkit-box',
        // display: '-ms-flexbox',
        display: 'flex',
        backgroundColor:'black',
        flexWrap:'wrap',
        // msFlex:'wrap'
    },
    guicontainer:{
        // paddingTop: theme.spacing.unit*2,
        backgroundColor:'black',
        height:400,
    }
});

class RenderImage extends React.Component{
    render() {
        const { classes } = this.props;
        return(
            <div>
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={2}>
                            <div id='gui-container' className={classes.guicontainer}></div>
                        </Grid>
                        <Grid item xs={10}>
                            <Grid container spacing={12}>
                                <Grid item xs={4}>
                                    <Paper id='view1' className={classes.paper}>Coronal</Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper id='view2' className={classes.paper}>Coronal</Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper id='view3' className={classes.paper}>Sagital</Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

RenderImage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RenderImage);