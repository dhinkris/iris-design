import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Row, Col} from 'antd'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height:400,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor:'black',
        position:'relative'
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
                    <Row>
                        <div>{this.props.filename}</div>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <div id='gui-container' className={classes.guicontainer}></div>
                        </Col>
                        <Col span={5}>
                            <Paper id='view1' className={classes.paper}>Coronal</Paper>
                        </Col>
                        <Col span={5}>
                            <Paper id='view2' className={classes.paper}>Coronal</Paper>
                        </Col>
                        <Col span={5}>
                            <Paper id='view3' className={classes.paper}>Sagital</Paper>
                        </Col>
                        <Col span={15}>
                            <div style={{ height: '400px', overflow:'auto', padding: '10px'}}>
                                <h3>Header Information</h3>
                                {this.props.header!==null ? Object.keys(this.props.header).map((header_keys, index) => {
                                    return(
                                        <p style={{backgroundColor: index%2===0? "#ffffff":"#f5f5f5"}}> {header_keys+' : '+ JSON.stringify(this.props.header[header_keys])}</p>
                                    )
                                }):null}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

RenderImage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RenderImage);
