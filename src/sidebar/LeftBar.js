import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PipelineIcon from '@material-ui/icons/SettingsInputComposite'
import CreatePLIcon from '@material-ui/icons/Create'
import LoadPLIcon from '@material-ui/icons/FileUpload'
import SharePLIcon from '@material-ui/icons/Share'
import AlgoIcon from '@material-ui/icons/Code'
import SplitVolIcon from '@material-ui/icons/CallSplit'
import ReconstructIcon from '@material-ui/icons/Casino'
import BrainExtractIcon from '@material-ui/icons/ContentCut'
import ListSubheader from '@material-ui/core/ListSubheader';
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

import MenuItems from '../data/sideBar';
// import Panel from '../panel/Panel';

// import TableExampleSimple from '../listdirectory/ListFiles';
// import RenderImage from '../renderImage/RenderImage';
// import SplitVolumes from '../algorithms/SplitVolumes';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'fixed',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        marginLeft: 240,
        padding: theme.spacing.unit * 2,
        minWidth: 0, // So the Typography noWrap works
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    toolbar: theme.mixins.toolbar,
});

class LeftBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
        };
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.setState({
            showComponent: true,
        });
    }
    state = { open: false };

    handleClickAlgorithms = () => {
        this.setState({ openAlgo: !this.state.openAlgo });
    };

    handleClickPipeline = () => {
        this.setState({ openPipe: !this.state.openPipe });
    };

    handleSplitVolumes = () => {
        console.log("HandleSplitVolumes")
    };

    handleSVRRecon = () => {
        console.log("SVRRecon")
    };

    handleBrainExtraction = () => {
        console.log("BrainExtract")
    };

    render(){
        const { classes } = this.props
        return(
            <div className={classes.root}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            IRIS
                        </Typography>
                        <Toolbar>
                        </Toolbar>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
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
                    <Divider/>
                    {/*<List>{otherMailFolderListItems}</List>*/}
                </Drawer>
                {/*<RenderImage/>*/}
            </div>
            )
    }
}

export default withStyles(styles)(LeftBar);