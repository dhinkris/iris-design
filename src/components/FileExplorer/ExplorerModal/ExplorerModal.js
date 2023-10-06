import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import styles from '../../../style/index'
import * as AllActions from "../../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import data from '../../../data/T2W'
import _ from 'underscore'
import TextField from '@material-ui/core/TextField';

import Comments from './ExplorerModal/SubjectExplorerModalComponents/Comments/Comments';
import CreateComments from './ExplorerModal/SubjectExplorerModalComponents/Comments/CreateComment';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ExplorerModal extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            open:false
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        this.setState({ open: nextProps.open });
    }
    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { classes, subjectToShow, subjectFileData, subjectROIData,  modality } = this.props;
        const { open } = this.state
        var subjectFiles = _.find(data, function(e){
            return (e.subject_id === subjectToShow)
        })
        if (subjectFiles===undefined){
            return(null)
        } else{
            return (
                <div>
                    <Dialog
                        fullScreen
                        open={open}
                        onClose={this.handleClose}
                        TransitionComponent={Transition}
                    >
                        <AppBar className={classes.appBarModal}>
                            <Toolbar>
                                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6" color="inherit" className={classes.flexModal}>
                                    {subjectToShow}-{modality}
                                </Typography>
                                <Button color="inherit" onClick={this.handleClose}>
                                    save
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <List>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Subject Details
                                </Typography>
                                <Typography component="p">
                                    ID: {subjectFiles.subject_id}
                                </Typography>
                                <Typography component="p">
                                    Gestational Age: {subjectFiles.subject_id}
                                </Typography>
                                <Typography component="p">
                                    Number of scans: {subjectFiles.subject_id}
                                </Typography>
                                <Typography component="p">
                                    Gender: {subjectFiles.subject_id}
                                </Typography>
                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Graph (coming soon)
                                </Typography>

                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Results(in CC)
                                </Typography>
                                {
                                    subjectFiles.results.map((data) => {
                                        return(<Typography>{Object.keys(data)[0]+':'+Object.values(data)[0]}</Typography>)
                                    })
                                }
                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Post processed files
                                </Typography>
                                {
                                    subjectFiles.results.map((data) => {
                                        return(<Typography>{Object.keys(data)[0]+':'+Object.values(data)[0]}</Typography>)
                                    })
                                }
                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Pre Processed files
                                </Typography>

                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Raw files
                                </Typography>
                            </Paper>
                            <Paper className={classes.paperModal} elevation={5}>
                                <Typography variant="h5" component="h3">
                                    Previous Comments (0)
                                </Typography>
                            </Paper>
                            <Comments subjectToShow={subjectToShow}/>
                            <CreateComments subjectToUpdate={subjectToShow} updatedBy='user_0001' />
                            {/*Add comment only if the user is authorized to handle this scan*/}
                        </List>
                    </Dialog>
                </div>
            );
        }
    }
}

ExplorerModal.propTypes = {
    classes: PropTypes.object.isRequired,
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
) (withStyles(styles)(ExplorerModal));
