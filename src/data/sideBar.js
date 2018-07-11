import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandRight from '@material-ui/icons/KeyboardArrowRight'
import StarBorder from '@material-ui/icons/StarBorder';
import PipelineIcon from '@material-ui/icons/SettingsInputComposite'
import CreatePLIcon from '@material-ui/icons/Create'
import LoadPLIcon from '@material-ui/icons/FileUpload'
import SharePLIcon from '@material-ui/icons/Share'
import AlgoIcon from '@material-ui/icons/Code'
import SplitVolIcon from '@material-ui/icons/CallSplit'
import ReconstructIcon from '@material-ui/icons/Casino'
import BrainExtractIcon from '@material-ui/icons/ContentCut'
// import SplitVolumes from './components/algorithms/SplitVolumes'
const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class NestedList extends React.Component {
    state = { open: false };

    handleClickAlgorithms = () => {
        this.setState({ openAlgo: !this.state.openAlgo });
    };

    handleClickPipeline = () => {
        this.setState({ openPipe: !this.state.openPipe });
    };

    handleSplitVolumes = () => {

    };

    handleSVRRecon = () => {
        console.log("SVRRecon")
    };

    handleBrainExtraction = () => {
        console.log("BrainExtract")
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <List component="nav" subheader={<ListSubheader component="div">Return to Home</ListSubheader>}>
                    <ListItem button onClick={this.handleClickAlgorithms}>
                        <ListItemIcon>
                            <AlgoIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Algorithms" />
                        {this.state.openAlgo ? <ExpandMore /> : <ExpandRight />}
                    </ListItem>
                    <Collapse in={this.state.openAlgo} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <SplitVolIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="SplitVolumes" button onClick={this.handleSplitVolumes}/>
                            </ListItem>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <ReconstructIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="SVR Reconstruction" button onClick={this.handleSVRRecon}/>
                            </ListItem>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <BrainExtractIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="Brain Extraction" button onClick={this.handleBrainExtraction}/>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button onClick={this.handleClickPipeline}>
                        <ListItemIcon>
                            <PipelineIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Pipeline" />
                        {this.state.openPipe ? <ExpandMore /> : <ExpandRight />}
                    </ListItem>
                    <Collapse in={this.state.openPipe} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <CreatePLIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="Create Pipeline" />
                            </ListItem>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <LoadPLIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="Load Pipeline" />
                            </ListItem>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <SharePLIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="Share Pipeline" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Explore Files" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Submit a Job" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Results" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Logout" />
                    </ListItem>
                </List>
            </div>
        );
    }
}

NestedList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NestedList);