import React, { Component } from 'react';
import { Layout, Menu, Collapse, Button,Row, Col, Tag } from 'antd';
import algorithm from './fetalbrainpipeline';
import AlgorithmGenerator from './AlgorithmGenerator';
import axios from 'axios';
const { Header, Content, Footer, Sider, Upload } = Layout;
const Panel = Collapse.Panel;

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};
const mainAlgorithmSpace=[]
class AlgorithmList extends Component{
    state={
        addedAlgorithmList:[],
        uploadedFiles: null
    }
    handleClickAdd=(algorithm)=> {
        mainAlgorithmSpace.push(algorithm)
        this.setState({
            addedAlgorithmList: mainAlgorithmSpace
        })
    }
    handleClickRemove=(algorithm) => {
        const index = mainAlgorithmSpace.indexOf(algorithm);
        mainAlgorithmSpace[index]=null;
        this.setState({
            addedAlgorithmList: mainAlgorithmSpace
        })
    }
    handleUpload=(e)=>{
        this.setState({
            uploadedFiles: e.target.files[0],
            loaded: 0
        })
    }

    handleValidate=() => {
        const data = new FormData()
        data.append('file', this.state.uploadedFiles)
        axios.post("http://localhost:8000/uploadfile", data, {
            // receive two    parameter endpoint url ,form data
        })
            .then(res => { // then print response status
                console.log(res.statusText)
            })


    }
    handleRun=(pipeline)=> {

    }
    handleCancel=()=>{

    }

    render(){
        return(
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => { console.log(broken); }}
                    onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline">
                        {
                            algorithm.map((each_algorithm, index) => {
                                return(
                                    <Menu.Item key={'algorithm'+index} onClick={()=>this.handleClickAdd(each_algorithm)}>
                                        <span className="nav-text">{each_algorithm.name}</span>
                                    </Menu.Item>)
                            })
                        }
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

                            <div style={{ marginTop: 20 }}>
                                <Row gutter={24}>
                                    <Col span={18}>
                                        Algorithm space
                                        <Collapse bordered={false} >
                                            {this.state.addedAlgorithmList.map((addedAlgorithm, index) => {
                                                return(
                                                    addedAlgorithm!==null?<Panel forceRender header={<React.Fragment>{addedAlgorithm.name+'_'+(index)}</React.Fragment>} key={index} style={customPanelStyle}>
                                                        <AlgorithmGenerator algorithm={addedAlgorithm} index={index} name={addedAlgorithm.name}/>
                                                        <Button onClick={()=>this.handleClickRemove(addedAlgorithm)} style={{paddingLeft:'50'}}>Delete</Button>
                                                    </Panel>:null
                                                )
                                            })}
                                        </Collapse>
                                    </Col>
                                    <div style={{color: "#0eff0c", border: 10}}>
                                        <Col span={6}>
                                            <input type="file" multiple id="files" name="file" onChange={this.handleValidate}/>
                                        </Col>
                                    </div>
                                </Row>
                            </div>

                            <Tag>Invalid. Validate Again!</Tag>
                        </div>
                        <Button type="dashed" onClick={this.handleValidate}>Validate</Button>
                        <Button type="primary" onClick={this.handleRun}>Run</Button>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default AlgorithmList;