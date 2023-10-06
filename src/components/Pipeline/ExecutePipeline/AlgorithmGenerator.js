import React  from 'react';
import {Row, Tag, Input, Checkbox, Divider, Select } from 'antd';
import _ from 'lodash'
const Option = Select.Option;

var changed_inputs=[]
var changed_input_files=[]
var available_outputs=[]
class  GenerateAlgorithm extends React.Component {
    state={
        changed_inputs:[],
        changed_input_files:[]
    }
    onChange=  (e) => {
        console.log(`checked = ${e.target.checked}`);
    }
    handleAlgorithm =(algorithm) => {
        console.log(algorithm)
    }
    componentWillMount=()=>{
        this.setState({
            changed_inputs: changed_inputs
        })
    }
    handleInputValue = (algorithm, name, id, outputs) => {
        console.log(algorithm.output_files)
        changed_inputs.push(id)
        changed_inputs = _.uniq(changed_inputs)
        this.setState({
            changed_inputs: changed_inputs
        })
    }
    handleInputFile = (algorithm, name, id, outputs) => {
        changed_input_files.push(id)
        changed_input_files = _.uniq(changed_input_files)
        this.setState({
            changed_input_files: changed_input_files
        })
    }
    // handleCheckbox = (e) => {
    //     if (e.target.checked ===true){
    //         changed_inputs.push(e.target.attr)
    //     } else if (e.target.checked === false){
    //         const index = options.indexOf(e.target.attr);
    //         changed_inputs.splice(index, 1);
    //     }
    // }
    render(){
        const { algorithm, name, index } = this.props
        return (
            <React.Fragment>
                Availble Inputs:{this.state.changed_inputs.map((changed_inputs)=>{return(<Tag>{changed_inputs}</Tag>)})}
                Availble Outputs:{this.state.changed_input_files.map((changed_inputs)=>{return(<Tag>{changed_inputs}</Tag>)})}
                <React.Fragment>
                    {algorithm.inputs.map((input) => {
                        return(
                            input.optional===false?
                                input.type==='String'?
                                    <React.Fragment>
                                        <Input placeholder={input.name}
                                               id={name+'_'+input.id+'_'+index}
                                               onChange={() => this.handleInputValue(algorithm, name, name+'_'+input.id+'_'+index)}/>
                                        <Divider/>
                                    </React.Fragment>:
                                    input.type==='Number'?
                                        <React.Fragment>
                                            <Input placeholder={input.name}
                                                   id={name+'_'+input.id+'_'+index}
                                                   onChange={() => this.handleInputValue(algorithm, name, name+'_'+input.id+'_'+index)}/>
                                            <Divider/>
                                        </React.Fragment>:
                                        input.type==='File'?
                                            <React.Fragment>
                                                <Input placeholder={input.name}
                                                       id={name+'_'+input.id+'_'+index}
                                                       onChange={() => this.handleInputFile(algorithm, name, name+'_'+input.id+'_'+index)}/>
                                                <Select style={{ width: 400 }}>
                                                    {
                                                        this.state.changed_input_files.map((input)=> {
                                                            return(<Option loading value={input}>{input}</Option>)
                                                        })
                                                    }
                                                </Select>
                                                <Divider/>
                                            </React.Fragment>:
                                            input.type==='Boolean'?
                                                <Checkbox placeholder={input.name}
                                                          id={name+'_'+input.id+'_'+index}
                                                          onChange={() => this.handleInputValue(algorithm, name, name+'_'+input.id+'_'+index)}>
                                                    {input.name}
                                                </Checkbox>:
                                                null
                                :null
                        )
                    })}
                </React.Fragment>
                <React.Fragment>
                    {algorithm.output_files.map((output) => {
                        return(
                            output.optional===false?
                                output.type==='String'?
                                    <Input placeholder={output.name}
                                           id={name+'_'+output.id+'_'+index}
                                           onChange={this.handleInputValue}/>:
                                    output.type==='Number'?
                                        <Input placeholder={output.name}
                                               id={name+'_'+output.id+'_'+index}
                                               onChange={this.handleInputValue}/>:
                                        output.type==='File'?
                                            <Input placeholder={output.name}
                                                   id={name+'_'+output.id+'_'+index}
                                                   onChange={this.handleInputValue}/>:null:
                                null
                        )
                    })}
                </React.Fragment>
            </React.Fragment>

        )
    }
}

export default GenerateAlgorithm;