import React from 'react';
import { Row, Col, Button, Input, Spin } from 'antd';

import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined,
    PieChartOutlined,
    DesktopOutlined,
    FileOutlined,
    ScissorOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    FullscreenOutlined,
    PlusOutlined,
    AimOutlined,
    EyeOutlined

} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;

const InputGroup = Input.Group;
const ButtonGroup = Button.Group;


class Skeleton extends React.Component{
    render(){
        return(
            <div>
                <Layout>
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                        }}
                        collapsible collapsed='true'
                    >
                        <Menu style={{marginTop: 64}} theme="dark" defaultSelectedKeys={['1']} mode="inline">

                            <Menu.Item key="MouseProbe" onClick={this.handleImage}>
                                <PlusOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Mouse probe</span>
                            </Menu.Item>
                            <Menu.Item key="hideoverlay" onClick={this.hideOverlay}>
                                <EyeOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Hide</span>
                            </Menu.Item>

                            <Menu.Item key="VoxelProbe" onClick={this.handleImage}>
                                <AimOutlined style={{fontSize:20, color: '#929292'}}/>
                                <span>Voxel probe</span>
                            </Menu.Item>
                            <Menu.Item key="Ruler" onClick={this.handleImage}>
                                <RotateLeftOutlined style={{fontSize:20, color: '#929292'}}/>
                                <span>Ruler</span>
                            </Menu.Item>
                            <Menu.Item key="Handle" onClick={this.handleImage}>
                                <RotateRightOutlined style={{fontSize:20, color: '#929292'}}/>
                                <span>Handle</span>
                            </Menu.Item>
                            <Menu.Item key="Opacity" onClick={this.handleImage}>
                                <FullscreenOutlined style={{fontSize:20, color: '#929292'}}/>
                                <span>Opacity</span>
                            </Menu.Item>
                            <Menu.Item key="Rectangle" onClick={this.handleImage}>
                                <FullscreenOutlined style={{fontSize:20, color: '#929292'}}/>
                                <span>Rectangle</span>
                            </Menu.Item>

                        </Menu>
                    </Sider>
                    <Layout>
                        <Header className="site-layout-sub-header-background">
                            {/*<Menu*/}
                            {/*theme="dark"*/}
                            {/*mode="horizontal"*/}
                            {/*defaultSelectedKeys={['1']}*/}
                            {/*>*/}
                            {/*<Menu.Item key="1" style={{height: 64, width: 64, padding: 10}} ><PieChartOutlined  style={{ fontSize:24, textAlign:'center' }} /></Menu.Item>*/}
                            {/*<Menu.Item key="2" style={{height: 64, width: 64, padding: 10}} ><PieChartOutlined  style={{ fontSize:24, textAlign:'center' }} /></Menu.Item>*/}
                            {/*<Menu.Item key="3" style={{height: 64, width: 64, padding: 10}} ><PieChartOutlined  style={{ fontSize:24, textAlign:'center' }} /></Menu.Item>*/}
                            {/**/}
                            {/*</Menu>*/}
                            <h2 style={{color: '#38FFD8'}}>Fetal Brain visualizer</h2>
                        </Header>
                        <Content style={{ backgroundColor: '#000000',
                            marginLeft: 80,
                            marginTop:64,
                            position: 'fixed',
                            height: "100%",
                            width: "100%" }}>
                            <div className="site-layout-background" >
                                <Row>
                                    <Col span={12} style={{height:"100%"}}>
                                        <Row>
                                            <p style={{ marginTop:40, color: '#fbfbfb'}} > Axial</p>
                                            <Spin style={{marginTop: 400}} spinning={this.state.loading}/>
                                            <div style={{ height:800 }} id='r1'></div>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row>
                                            <p style={{ marginTop:40, color: '#fbfbfb'}} > Coronal</p>
                                            <Spin style={{marginTop: 200}} spinning={this.state.loading}/>
                                            <div style={{ height:400 }} id='r2'></div>
                                        </Row>
                                        <Row>
                                            <p style={{ color: '#fbfbfb'}} > Sagittal</p>
                                            <Spin spinning={this.state.loading}/>
                                            <div style={{ height:400 }} id='r3'></div>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Content>
                        <Footer style={{ backgroundColor: '#38FFD8',
                            marginLeft: 80,
                            position: 'relative',
                            height: "3%",
                            width: "100%",
                            padding:20
                        }}
                        >
                            <Row>
                                <div>
                                    <span style={{ color: '#000000'}}>X: {Math.round(this.state.coords[0].point.x)}</span>
                                    <span style={{ color: '#000000'}}> Y: {Math.round(this.state.coords[0].point.y)}</span>
                                    <span style={{ color: '#000000'}}> Z: {Math.round(this.state.coords[0].point.z)}</span>
                                </div>
                            </Row>
                        </Footer>
                    </Layout>
                </Layout>
                <div style={{display: 'none'}} id='my-gui-container'></div>
                <div style={{display: 'none'}} style={{height:10 }} id='r0'></div>
                <div style={{display: 'none'}} id="my-lut-container">
                    <div><div id="my-lut-canvases-l1" className="my-lut-canvases"></div></div>
                    <div>Data LUT<div id="my-lut-canvases-l0" className="my-lut-canvases"></div></div>
                    <div id='r0Editor' className='ssrVisualizer'></div>
                    <div id='r3Editor'></div>
                </div>
            </div>
        )
    }
}

export default Skeleton;