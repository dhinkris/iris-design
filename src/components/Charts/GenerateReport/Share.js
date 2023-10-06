import React, { Component } from 'react'
import { Modal, Button } from 'antd'

import AllUsersList from '../../Common/AllUsersList';


class Share extends Component {
    constructor(props) {
        super(props)
        this.state = { visible: false }
    }

    componentDidMount(){
        // console.log(this.state)
        this.setState({ visible: this.props.visible })
    }

    componentDidUpdate(prevProps){
        if (prevProps.visible!==this.props.visible){
            this.setState({ visible: this.props.visible})
        }
    }

    render(){
        const { visible } = this.state
        return(
            <Modal title="Share" visible={ visible } onOk={this.props.handleOk} onCancel={this.props.handleCancel} okText="Share">
                <AllUsersList handleOk={this.props.handleOk}/>
            </Modal>
        )
    }
}

export default Share;