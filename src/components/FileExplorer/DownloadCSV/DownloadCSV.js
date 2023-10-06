import { Modal, Button, List } from 'antd';
import {bindActionCreators} from "redux";
import React from 'react';
import {connect} from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Copy from '@material-ui/icons/FileCopy';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import {Parser}  from 'json2csv'
import downloadParams from '../../../data/downloadCSVData';
import * as fs from 'fs';
import PropTypes from 'prop-types';

import * as AllActions from "../../../actions";
import _ from 'lodash';

class SubjectModal extends React.Component {
    state = { visible: false, selectedParams:[], queriedSubjectData: null}
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.visible !== prevState.visible){
            return ({
                visible: nextProps.visible,
            })
        }
        if (nextProps.queriedSubjectData.queriedSubjectData!== prevState.queriedSubjectData){
            return ({
                queriedSubjectData: nextProps.queriedSubjectData.queriedSubjectData
            })
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.selectedSubjects!==this.props.selectedSubjects){
        //     this.props.actions.newqueryToDownload(this.props.selectedSubjects)
        // }
    }
    componentDidCatch(error, errorInfo) {
    }

    handleChange = (label,name,db) => event => {
        var selectedArr=[...this.state.selectedParams]
        var index = selectedArr.indexOf({label:label, db: db, param: name})
        selectedArr = _.filter(selectedArr, (res) => {return res.param!==name})
        if (event.target.checked!==false){
            this.setState(prevState => ({
                selectedParams: [...prevState.selectedParams, {label:label, db: db, param: name}]
            }))
                // ,() => { this.props.actions.newqueryToDownload(this.props.selectedSubjects)}
        } else{
            this.setState({selectedParams: selectedArr})
                // ,() => { this.props.actions.newqueryToDownload(this.props.selectedSubjects)}
        }
        this.setState({ [name]: event.target.checked });
    };
    handleDownload = async () => {
        await this.props.actions.newqueryToDownload(this.props.selectedSubjects)
        var headers=[]
        var results=[]
        var object=[]
        this.props.queriedSubjectData.queriedSubjectData.map((each_subject)=> {
            // console.log(each_subject['SubjectROI'])
            // console.log(_.merge(_.groupBy(each_subject['SubjectROI'], 'modality')[Object.keys(_.groupBy(each_subject['SubjectROI'], 'modality'))[0]],_.groupBy(each_subject['SubjectROI'], 'modality')[Object.keys(_.groupBy(each_subject['SubjectROI'], 'modality'))[1]]))
            // const SubjectROI = _.merge(_.groupBy(each_subject['SubjectROI'], 'modality')[Object.keys(_.groupBy(each_subject['SubjectROI'], 'modality'))[0]],_.groupBy(each_subject['SubjectROI'], 'modality')[Object.keys(_.groupBy(each_subject['SubjectROI'], 'modality'))[1]])
            let mergedvals=_.merge(_.merge(each_subject['SubjectDetail'], each_subject['MasterFileSystem'],each_subject['SubjectROI']))
            let tempvals={}
            Object.keys(mergedvals).map((objname) => {
               if (Array.isArray(mergedvals[objname])){
                   let subobj=[]
                   mergedvals[objname].map((eachsubobject) => {
                       subobj.push(eachsubobject.name)
                   })
                   tempvals[objname] = subobj.join()
               } else {
                   tempvals[objname] = mergedvals[objname]
               }
            })
            results.push(tempvals)
        })
        Object.keys(_.groupBy(this.state.selectedParams,'db')).map((db, index) => {
            Object.values(_.mapValues(_.groupBy(this.state.selectedParams, 'db')[db], 'param')).map((each_object) => {
                object.push(each_object)
            })
        })
        const fields =object
        const json2csv = new Parser({fields});
        const csv = json2csv.parse(results);
        var hiddenElement = document.createElement('a');
        hiddenElement.href='data:text/csv; charset=utf-8,' + encodeURI(csv);
        hiddenElement.target='_blank'
        hiddenElement.download='subjectList.csv'
        hiddenElement.click();
        // const output = fs.createWriteStream('~/Downloads', {encoding:'utf8'});
        //
        // const processor = csv.pipe(output);
    }

    render() {
        const { selectedParams, visible, queriedSubjectData } = this.state;
        const { selectedSubjects } = this.props;
        return (
            <div>
                <Modal
                    title='Subject Details'
                    visible={visible}
                    onCancel={this.props.handleClose}
                    onOk={this.handleDownload}
                    okText='Download as CSV'
                    width='100%'
                    bodyStyle={{height:'100%'}}
                >
                    <Grid container spacing={24}>
                        {
                            downloadParams.map((data) => {
                                return(
                                    <Grid item xs>
                                        <Typography variant="h5" component="h3">
                                            <FormControl component="fieldset" >
                                                <FormLabel component="legend">{data.header}</FormLabel>
                                                <FormGroup>
                                                    {data.params.map((subdata) => {
                                                        return(<FormControlLabel
                                                            control={
                                                                <Checkbox onChange={this.handleChange(subdata.label, subdata.param, data.db)} value={subdata.label} />
                                                            }
                                                            label={subdata.label}
                                                        />)
                                                    })}
                                                </FormGroup>
                                            </FormControl>
                                        </Typography>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs>
                            {/*<BottomNavigation><Button color="inherit" onClick={this.handleDownload}>Download as CSV</Button></BottomNavigation>*/}
                            { selectedSubjects!==undefined ? <React.Fragment><Typography>Selected Subjects: </Typography>{ selectedSubjects.map((res) => (<Chip label={res} />))}</React.Fragment>: null}
                            { selectedParams.length >0? <React.Fragment><Typography>Selected Params: </Typography>{ selectedParams.map((res) => (<Chip label={res.label} />))}</React.Fragment>: null}
                        </Grid>
                    </Grid>
                </Modal>
            </div>
        );
    }
}
const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})
export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (SubjectModal);