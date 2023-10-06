import React, { Component } from 'react';
import CustomRouter from './routes/CustomRouter'
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import './style/App.css'
class App extends Component {
    render() {
        return (
            <CustomRouter/>
        );
    }
};

export default App;