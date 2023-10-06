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
                <Row>
                    <Col span={3}>
                        <div id='gui-container' ></div>
                    </Col>
                    <Col span={10} >
                        <Paper style={{ height: 1000 }} id='view1' className={classes.paper}>Axial</Paper>
                    </Col>
                    <Col span={5}>
                        <Col>
                            <Row>
                                <Paper style={{ height: 500 }} id='view2' className={classes.paper}>Coronal</Paper>
                            </Row>
                            <Row>
                                <Paper style={{ height: 500 }} id='view3' className={classes.paper}>Sagital</Paper>
                            </Row>
                        </Col>
                    </Col>
                    <Col span={5}>
                        <Row>
                            <Col span={10}>
                                <Paper style={{ height: '500px', width: '100%'}} id='view3d' className={classes.paper}>3D View</Paper>
                            </Col>
                        </Row>
                        <Row>
                            <div style={{ height: '500px', overflow:'auto', padding: '10px', marginTop: 20}}>
                                <h3>Header Information</h3>
                                {this.props.header!==null ? Object.keys(this.props.header).map((header_keys, index) => {
                                    return(
                                        <p style={{backgroundColor: index%2===0? "#ffffff":"#f5f5f5"}}> {header_keys+' : '+ JSON.stringify(this.props.header[header_keys])}</p>
                                    )
                                }):null}
                            </div>
                        </Row>

                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <div id="my-lut-container" style={{display: "none"}}>
                            <div><div id="my-lut-canvases-l1" className="my-lut-canvases"></div></div>
                            <div>Data LUT<div style={{width:1000, height: 400}} id="my-lut-canvases-l0" className="my-lut-canvases"></div></div>

                        </div>
                        <div id='r0Editor' className='ssrVisualizer'></div>
                        <div id='r3Editor'></div>
                    </Col>
                </Row>

                {/*<Row>*/}
                {/*    <div>{this.props.filename}</div>*/}
                {/*</Row>*/}
            </div>
        )
    }
}

RenderImage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RenderImage);
