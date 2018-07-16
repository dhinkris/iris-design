import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
// import tileData from '../data/Images';
// import Chips from '../chips/Chips'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ViewIcon from '@material-ui/icons/ViewCarousel';
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    column: {
        flexBasis: '33.33%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    alert: {
        color: 'red',
        fontSize: '5'
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    chip: {
        marginTop: '10'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

class SplitVolumes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            subjectList:[],
            isLoaded: false,
            inputImages:[],
            searchInput: [],
            alert:''
        }
    }
    componentWillMount(){
        fetch('/subjectslist')
            .then((res) => res.json())
            .then((response) =>{
                this.setState({
                    isLoaded: true,
                    subjectList: response
                })
            });
    }
    handleChange=(event)=> {
        this.setState({ [event.target.name]: event.target.value });
        this.setState({toSearch: event.target.value});
        fetch('/subjectslist')
            .then((res) => res.json())
            .then((response) => {
                this.setState({
                    searchInput: response.filter((res) =>{
                        return res.sname===event.target.value
                    }).map((res) =>{
                        return res.input
                    })[0]
                })
            });
    }

    handleDelete=(res) =>() => {
        this.setState(state => {
            const imgData = [...state.searchInput]
            const chipToDelete = imgData.indexOf(res);
            imgData.splice(chipToDelete, 1);
            return {searchInput: imgData}
        })
        // this.setState({
        //     searchInput: searchInput[indextodelete]
        // })
    }
    showPreview=image=> {
        // console.log(image)
    }
    openImage=image=> {
        // console.log(image)
    }
    runSplitVolume=(inputs) =>() => {
        if (inputs.length<=0){
            this.setState({alert: 'No Image selected to process'})
            return
        } else
            {
                this.setState({alert:'Run Split Volumes'})
            }
    }
    render(){
        const { classes } = this.props;
        const { isLoaded, subjectList, inputImages, searchInput, alert } = this.state;
        return(

        <div >
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.column}>
                        <Typography alignLeft className={classes.heading}>Split Volumes</Typography>
                        <Typography className={classes.alert}>{alert}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <div className={classes.column} >
                    <FormControl className={classes.formControl}>
                        {/*<InputLabel htmlFor="subject-helper">Subject</InputLabel>*/}
                        <Select
                            value={this.state.subject}
                            onChange={this.handleChange}
                            input={<Input name="subject" id="subject-helper" />}
                        >
                            {subjectList.map((subject, index) => <MenuItem value={subject.sname} key={subject.index}>{subject.sname}</MenuItem>)}
                        </Select>
                        <FormHelperText>Select a subject</FormHelperText>
                    </FormControl>
                    </div>
                    <div className={classes.column} >
                        {
                            searchInput.map((res, index) => {
                                return(<Chip label={res.name} className={classes.chip}  avatar={<Avatar button onHover={this.showPreview(res.name)} onClick={this.openImage(res)}><ViewIcon/></Avatar>} onDelete={this.handleDelete(res)} />)
                            })
                        }
                        </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small">Cancel</Button>
                    <Button size="small" color="primary" onClick={this.runSplitVolume(this.state.searchInput)} helperText="tezt">
                        Run SplitVolumes
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        </div>
        )}

}

SplitVolumes.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SplitVolumes);