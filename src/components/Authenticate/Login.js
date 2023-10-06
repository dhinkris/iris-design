import React, { userState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import {Form, Input, Button, Row, Col, Card} from 'antd';
import { Route, Redirect } from 'react-router-dom';

import * as AllActions from '../../actions'
import userServices from '../../helpers/userservices';
import logo from '../../resources/image001.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        // localStorage.removeItem('authToken')
        // localStorage.removeItem('userDetails');
        // this.props.form.validateFields();
    }

    handleSubmit =  async (user: any) => {
        if (user) {
            try {
                await this.props.actions.loginUser(user.userName, user.password)
                if (this.props.loginData.subjectAuthInfo)
                {
                    const subjectAuthInfo = this.props.loginData
                    const token = subjectAuthInfo.subjectAuthInfo.token
                    localStorage.setItem('authToken', token)
                    localStorage.setItem('userName', subjectAuthInfo.subjectAuthInfo.userName)
                    const { state } = this.props.location
                    window.location = state ? state.from.pathname : '/'
                    // this.props.history.push("/")
                }
            } catch(ex) {
                console.log(ex)
            }
        }
    }

    render() {
        if (localStorage.getItem('authToken')) return <Redirect to="/"/>
        // const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const { from }  = this.props.location.state || { from : { pathname: '/'}}

        return (
            <Row id="custom-form" type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col>
                    <h2>
                        Welcome to IRIS. Enter your username and password
                    </h2>
                    <Card>
                        <Form onFinish={this.handleSubmit} initialValues={{remember: true}} layout="inline" >
                            <Row type="flex" justify="center" align="middle" style={{minHeight: '10vh'}}>
                                <img style={{width: 200}} src={logo}/>
                            </Row>
                            <Form.Item
                                name="userName"
                                rules= {[{ required: true, message: 'Please input your username!' }]}
                            >
                                    <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder="Username" />
                            </Form.Item>
                            <br/>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input prefix={<LockOutlined className='site-form-item-icon' />} type="password" placeholder="Password" />
                            </Form.Item>
                            <br/>
                            <Form.Item>
                                <a href="">Forgot password | Need help?</a>
                            </Form.Item>
                            <br/>
                            <Form.Item >
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                >
                                        Log in
                                </Button>
                            </Form.Item>
                            <br/>
                            <Form.Item >
                                <Button block type="secondary" htmlType="submit"><Link to ='/register'>Register</Link></Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
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
) (LoginForm);
