import React, {Component} from 'react';
import {BrowserRouter, Router, Route, Switch} from 'react-router-dom';
import {history} from "../helpers";
import {PrivateRoute} from "./PrivateRoute";
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import 'antd/dist/antd.css';
import  * as Antd from 'antd';
import {Layout, Menu, Breadcrumb, Badge, Avatar, Popover, Radio} from 'antd';
import { LaptopOutlined, DesktopOutlined, CalculatorOutlined, LockOutlined, SettingOutlined, UserOutlined, InfoCircleOutlined, PoweroffOutlined, TeamOutlined, NotificationOutlined, ApartmentOutlined, ProjectOutlined, ExperimentOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';
import Login from "../components/Authenticate/Login";
import Pipeline from '../components/Pipeline/Pipeline'
import PipelineStatus from '../components/Pipeline/PipelineStatus';
import Signup from '../components/Authenticate/Signup';
import Logout from '../components/Authenticate/Logout';
import BrainDetection from '../components/Algorithms/BrainDetection';
import PipelineRender  from '../components/Pipeline/PipelineRender'

import Home from '../pages/Home';
import FileExplorer from '../pages/FileExplorer';
import VolumeCalculator from '../pages/VolumeCalculator';
import MyReports from '../pages/MyReports';
import Admin from '../pages/Admin';
import logo from '../resources/image001.png';
const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const {RadioGroup} = Radio.Group
class CustomRouter extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = this.props;
        this.state = {
            collapsed: false
        }
    }

    componentDidMount() {
        try{
            this.setState({profile: jwtDecode(localStorage.getItem('authToken'))});
        } catch(ex) {}
    }

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }

    render() {
        const { profile } = this.state
        return (
            <Router history={history}>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        style={{
                            overflow:'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0
                        }}
                    >
                        <div className="logo">IRIS</div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="sub0" style={{ height: 90 }} > <Link to='/home'>
                                <img style={{ height: 65 }} alt="logo" src={logo}></img>
                            </Link></Menu.Item>
                            <Menu.Item key="sub1"> <Link to='/home'><LaptopOutlined/><span>Home</span></Link></Menu.Item>
                            <Menu.Item key="sub2"><Link to='/fileexplorer/chartView'><DesktopOutlined/><span> Data Explorer</span></Link>
                                </Menu.Item>
                            <Menu.Item key="sub3"><Link to='/volumecalculator'> <CalculatorOutlined/><span>Growth Trajectories</span></Link></Menu.Item>
                            
                            <Menu.Item key="sub4"> <Link to='/myreports'><CalculatorOutlined/><span>My Reports</span></Link></Menu.Item>
                            
                            <Menu.Item key="sub11"><Link to='/pipeline'> <ApartmentOutlined/><span>Pipeline</span></Link></Menu.Item>
                            
                            <Menu.Item key="12"><Link to='/projects'><ExperimentOutlined/><span>Process</span></Link></Menu.Item>
                            {
                                profile ?
                                    <Menu.Item key="sub6"> <Link to='/logout'><DesktopOutlined/><span>Logout</span></Link></Menu.Item>
                                    : <React.Fragment>
                                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                                            <Menu.Item key="sub7"><Link to='/login'><span><LockOutlined/></span>Login</Link></Menu.Item>
                                            {/* <Menu.Item key="sub8"><Link to='/register'><span><LockOutlined/></span>Register</Link></Menu.Item> */}
                                        </Menu>
                                    </React.Fragment>

                            }
                            
                        </Menu>
                    </Sider>
                    <Layout style={{marginLeft: 200}}>
                        <Header style={{background: '#fff', padding: 0, textAlign: 'right'}}>
                            {
                                profile ? <div style={{marginRight: 20}}>
                                    <span style={{marginRight: 20}} >
                                        <Badge count={5}>
                                            <NotificationOutlined style={{fontSize:20}} />
                                        </Badge>
                                    </span >
                                    <span style={{marginRight: 20}}>{ profile.userName.toLocaleUpperCase() }</span>
                                    <Popover placement="bottomRight" content={
                                        <Menu
                                            style={{padding:0, margin: 0}}
                                        >
                                            <Menu.Item key="1"><SettingOutlined/><span> Account Settings</span></Menu.Item>
                                            <Menu.Item key="2"><UserOutlined/><span> User profile</span></Menu.Item>
                                            <Menu.Item key="3"><InfoCircleOutlined/><span> Contact support </span></Menu.Item>
                                            <Menu.Item key="4"><Antd.Switch defaultChecked={false}/><span> Switch Theme</span></Menu.Item>
                                            {
                                                profile ?
                                                    <Menu.Item key="5">
                                                        <Link to='/logout'>
                                                            <PoweroffOutlined/>
                                                            <span>Logout</span>
                                                        </Link>
                                                    </Menu.Item>: null
                                            }

                                        </Menu>
                                    } trigger='click'>
                                        <Avatar style={{marginRight: 20, color: '#ffffff', backgroundColor: '#ff2500'}}>DK</Avatar>
                                    </Popover>

                                </div> : null
                            }
                        </Header>
                        <Content style={{margin: '24px 16px ', background: '#fff', minHeight: 280}}>
                            <Route exact path="/" component={Home}/>
                            <Route path="/home" component={Home}/>
                            <PrivateRoute path="/fileexplorer" component={FileExplorer} />
                            <PrivateRoute exact path="/pipeline" component={Pipeline} />
                            <PrivateRoute path="/pipeline/:id" component={PipelineRender}/>
                            <PrivateRoute exact path="/projects/" component={PipelineStatus} />
                            <PrivateRoute path="/projects/:id" component={PipelineStatus} />
                            <PrivateRoute path="/braindetection" component={BrainDetection} />
                            <PrivateRoute path="/volumecalculator" component={VolumeCalculator} />
                            <PrivateRoute path="/myreports" component={MyReports} />
                            <PrivateRoute path="/admin" component={Admin} />
                            <Route path="/logout" component={Logout} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Signup} />
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            Developing Brain Institute
                        </Footer>
                    </Layout>
                </Layout>
            </Router>
        );
    }
};

export default CustomRouter;
