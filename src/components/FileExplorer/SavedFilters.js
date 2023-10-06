import {bindActionCreators} from "redux";
import React from 'react';
import {connect} from "react-redux";

import { Drawer, Table, Space, Button, Tooltip } from 'antd';
import { PlaySquareOutlined, EditOutlined, ShareAltOutlined, DeleteOutlined } from '@ant-design/icons';
import * as AllActions from "../../actions";
import _ from 'lodash';

class SubjectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false}
    }
    
    async componentDidUpdate(prevProps, prevState){
        if (prevProps.visible!==this.props.visible){
            this.setState({visible: this.props.visible})
            await this.props.actions.getUserFilters()
            this.setState({ filters: this.props.userFilters.filters})
        }
    }

    handleLoadFilter= async (filters)=>{
        await this.props.actions.getFilteredData(filters)
        this.props.updateDataset()
        // this.setState({visible: false})
    }

    render() {
        const { visible, filters } = this.state;

        const columns=[
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Action',
                key: 'action',
                dataIndex: 'filters',
                render: (text)=>(
                    <Space size="middle">
                        <Tooltip placement="bottom" title="Run"><Button type="primary" shape="circle" icon={<PlaySquareOutlined/>} onClick={()=>this.handleLoadFilter(text)}></Button></Tooltip>
                        <Tooltip placement="bottom" title="Update"><Button type="primary" disabled shape="circle" icon={<EditOutlined/>} ></Button></Tooltip>
                        <Tooltip placement="bottom" title="Share"><Button type="primary" disabled shape="circle" icon={<ShareAltOutlined/>} ></Button></Tooltip>
                        <Tooltip placement="bottom" title="Delete"><Button type="primary" disabled shape="circle" icon={<DeleteOutlined/>} ></Button></Tooltip>
                    </Space>
                )
            }
        ]
        return (
            <Drawer
                title="Saved Filters"
                width={1000}
                onClose={this.props.handleClose}
                visible={visible}
                style={{
                    overflow: 'auto',
                    // height: 'calc(100% - 108px)',
                    paddingBottom: '108px',
                }}
            >
                <Table columns={columns} dataSource={filters}/>
            </Drawer>
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