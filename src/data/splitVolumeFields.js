import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axiso from 'axios';

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
// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ViewIcon from '@material-ui/icons/ViewCarousel';
import Dialog from '../dialog/dialogViewer';

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
    input: {
        display: 'none',
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
    progress: {
        margin: theme.spacing.unit * 2,
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
        margin: theme.spacing.unit
    },
    avatar:{
        backgroundColor: theme.palette.primary.dark,
    },
    avatarIcon: {
        color: theme.palette.primary.contrastText,
    },
    formControl: {
        textAlign:'center',
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    button:{
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
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
            selectedFolder:'',
            uploadedFiles:'',
            upload:false,
            searchInput: [],
            alert:'',
            isProcessed:false,
            response:'',
            results:[],
            showDialog: false,
            imageToOpen:'',
            folderToOpen:''
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
        this.setState({ [event.target.name]: event.target.value , toSearch: event.target.value, results:[]});

        fetch('http://localhost/list_dir/explorer_get.cgi?folder='+event.target.value+'/input')
            .then((res) => res.json())
            .then((response) => {
                            this.setState({
                                searchInput: response.files,
                                selectedFolder : event.target.value
                            })
            });
    }
    handleUpload=(event)=>{
        this.setState({
            upload: false
        })
        const uploadedFiles=[];
        const files=event.target.files;
        let formData = new FormData();
        if(files.length === 0) {
            console.log('No files currently selected for upload');
        } else {
            for(var i = 0; i < files.length; i++) {
                uploadedFiles.push({filename: files[i].name})
            }
            this.setState({
                upload: true,
                searchInput: uploadedFiles,
                uploadedFiles: files[0]
            })
        }
    }
    handleDeleteInput=(res) =>() => {
        this.setState(state => {
            const imgData = [...state.searchInput]
            const chipToDelete = imgData.indexOf(res);
            imgData.splice(chipToDelete, 1);
            return {searchInput: imgData}
        })
    }
    handleDeleteResults=(res) =>() => {
        this.setState(state => {
            const imgData = [...state.results]
            const chipToDelete = imgData.indexOf(res);
            imgData.splice(chipToDelete, 1);
            return {results: imgData}
        })
    }
    showPreview=image=>()=> {

    }
    openImage=image=>()=> {
        console.log(image)
        this.setState({
            showDialog: true,
            imageToOpen:image.filename,
            folderToOpen:image.folder
        })
    }
    handleClosed = () => {
        this.setState({
            showDialog: false,
            imageToOpen:'',
            folderToOpen:''
        })
    };
    runSplitVolume=(inputs) =>() => {
        if (inputs.length<=0){
            this.setState({alert: 'No Image selected to process'})
            return
        } else
            {
                this.setState({isProcessed: true, results:[]})
                this.setState(state => {
                    const folder = [state.selectedFolder]
                    const upload = state.upload
                    const files = [state.uploadedFiles]
                    let formData = new FormData();
                    formData.append('selectedFile',files)
                    console.log('http://localhost/algorithms/handleUploadFiles.cgi?input='+files)
                    { upload ? axiso.post('http://localhost/algorithms/handleUploadFiles.cgi?input=',formData)
                        .then((res) => console.log(res))
                        // .then((response) => {
                        //     this.setState(state =>{
                        //         const folder = [...state.selectedFolder]
                        //         return {results:response.files,  isProcessed: false}
                        //     })
                        // })
                        :
                        fetch('http://localhost/algorithms/runSplitVolumes.cgi?input='+JSON.stringify(inputs)+'&folder='+folder)
                        .then((res) => res.json())
                        .then((response) => {
                            this.setState(state =>{
                                const folder = [...state.selectedFolder]
                                return {results:response.files,  isProcessed: false}
                            })
                        })}
                })
            }
    }
    render(){
        const { classes } = this.props;
        const { isLoaded, subjectList, inputImages, selectedFolder, searchInput, alert, isProcessed, results, upload, showDialog,imageToOpen, folderToOpen } = this.state;
        return(

        <div>
            <Dialog open={showDialog} onClose={this.handleClosed} imageToOpen={imageToOpen} folderToOpen={folderToOpen}/>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.column}>
                        <Typography alignLeft className={classes.heading}>Split Volumes {isProcessed? <CircularProgress className={classes.progress} thickness={7} size={30} /> : null} </Typography>
                        <Typography className={classes.alert}>{alert}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details} >
                    <div className={classes.column} style={{ borderRight: '0.01em solid black', padding: '0.5em' }}>
                        <FormControl className={classes.formControl}>
                            {/*<InputLabel htmlFor="subject-helper">Subject</InputLabel>*/}
                            <input
                                accept="application/x-gzip"
                                className={classes.input}
                                id="flat-button-file"
                                multiple
                                type="file"
                                onChange={this.handleUpload}
                            />
                            <label htmlFor="flat-button-file">
                                <Button component="span" variant="contained" color="primary" className={classes.button}>
                                    Upload your own Images
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                            </label>
                            <Typography>-or-</Typography>
                            <Select
                                value={this.state.subject}
                                onChange={this.handleChange}
                                input={<Input name="subject" id="subject-helper" />}
                            >
                                {subjectList.map((subject, index) => <MenuItem value={subject.inputfolder} key={subject.index}>{subject.inputfolder}</MenuItem>)}
                            </Select>
                            <FormHelperText>Select a subject</FormHelperText>
                        </FormControl>
                    </div>
                    <div className={classes.column} style={{ borderRight: '0.01em solid black', padding: '0.5em' }}>
                        {
                            searchInput.map((res, index) => {
                                return(<Chip label={res.filename} className={classes.chip}  avatar={<Avatar className={classes.avatar} onClick={this.openImage(res)}><ViewIcon className={classes.avatarIcon}/></Avatar>} onDelete={this.handleDeleteInput(res)} />)
                            })
                        }
                        </div>
                    <div className={classes.column}>
                        {results ?
                            <Typography>
                                {
                                    results.map((result) => {
                                        return(<Chip label={result.filename} className={classes.chip} avatar={<Avatar button onHover={this.showPreview(result.filename)} onClick={this.openImage(result)}><ViewIcon/></Avatar>} onDelete={this.handleDeleteResults(result)}/>)
                                    })
                                }
                                </Typography>
                            : null
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