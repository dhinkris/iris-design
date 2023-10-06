import React from 'react';
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import {
    Form, Input, Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Card, Radio
} from 'antd';
import * as AllActions from '../../actions'
import logo from "../../resources/image001.png";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, user) => {
            if (!err) {
                try {
                    this.props.actions.registerUser(user)
                    window.location = '/'
                    // this.props.actions.loginUser(user.username, user.password)
                } catch(ex) {
                    console.log(ex)
                }
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }

    render() {
        if (localStorage.getItem('authToken')) return <Redirect to="/"/>
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const { from }  =this.props.location.state || { from : { pathname: '/'}}
        if (this.props.loginData.subjectAuthInfo)
        {
            const subjectAuthInfo = this.props.loginData
            const token = subjectAuthInfo.subjectAuthInfo.token
            localStorage.setItem('userDetails', subjectAuthInfo.subjectAuthInfo.email)
            localStorage.setItem('authToken', token)
            if (this.props.loginData.subjectAuthInfo.action === true && token) {
                return(<Redirect to={from} />)
            }

        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '1',
        })(
            <Select style={{ width: 70 }}>
                <Option value="1">+1</Option>
                <Option value="1">+1</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Row id="custom-form" type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col>
                    <h2>
                        Welcome to IRIS. Register here to get started.
                    </h2>
                    <Card>
                        <Form onSubmit={this.handleSubmit}>
                            <Row type="flex" justify="center" align="middle" style={{minHeight: '10vh'}}>
                                <img style={{width: 200}} src={logo}/>
                            </Row>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: 'The input is not valid E-mail!',
                                    }, {
                                        required: true, message: 'Please input your E-mail!',
                                    }],
                                })(
                                    <Input placeholder="Email"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: 'Please input your password!',
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input type="password" placeholder="Password"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: 'Please confirm your password!',
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} placeholder="Retype-Password"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                                })(
                                    <Input placeholder="Username"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('phone', {
                                    rules: [{ required: true, message: 'Please input your phone number!' }],
                                })(
                                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Phone number"/>
                                )}
                            </FormItem>
                            {/*<FormItem*/}
                            {/*    {...formItemLayout}*/}
                            {/*    label="Website"*/}
                            {/*>*/}
                            {/*    {getFieldDecorator('website', {*/}
                            {/*        rules: [{ required: true, message: 'Please input website!' }],*/}
                            {/*    })(*/}
                            {/*        <AutoComplete*/}
                            {/*            dataSource={websiteOptions}*/}
                            {/*            onChange={this.handleWebsiteChange}*/}
                            {/*            placeholder="website"*/}
                            {/*        >*/}
                            {/*            <Input />*/}
                            {/*        </AutoComplete>*/}
                            {/*    )}*/}
                            {/*</FormItem>*/}
                            <FormItem {...tailFormItemLayout}>
                                {getFieldDecorator('agreement', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                                )}
                            </FormItem>
                            <FormItem>
                                <Radio.Group>
                                    <Radio value={1}>Clinician</Radio>
                                    <Radio value={2}>Visitor</Radio>
                                </Radio.Group>
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">Register</Button>
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="secondary" htmlType="submit"><Link to ='/login'>Login</Link></Button>
                            </FormItem>
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
) (RegistrationForm);
