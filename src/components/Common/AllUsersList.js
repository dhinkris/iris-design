import React, { Component } from 'react';
import { AutoComplete, Avatar } from 'antd'
import * as AllActions from '../../actions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Hashicon } from '@emeraldpay/hashicon-react';
import _ from 'lodash';
// const { Option } = Mentions;

class AllUsersList extends Component {
    constructor(props) {
        super(props);
        this.state = { options:[] }
    }

    renderItem=(user)=> ({
        value: user.userName,
        label:(<><Avatar icon={<Hashicon value={user._id} size={20} />}/> {user.firstName} <b>@{user.userName}</b></>)
    })
    async componentDidMount(){
        await this.props.actions.getAllUsers();
        let options=[]
        this.props.userDetails.userDetails.map((user)=> options.push({ 'options': [this.renderItem(user)]}))
        this.setState({options: options})
    }
    handleSelect=(userName)=> {
        this.props.handleOk(_.find(this.props.userDetails.userDetails, data=>data.userName===userName))
    }
    render() { 
        const { options } = this.state
        return (
            <AutoComplete
                style={{ width: '100%'}}
                options={options}
                onSelect={this.handleSelect}
                />
            // <Mentions stype={{width: '100%'}} placement="bottom" autoFocus={true}>
            //     {userDetails.length>0? userDetails.map((user)=> <Option value={user.userName}><Avatar icon={<Hashicon value={user._id} size={50} />}/> {user.firstName}</Option>): null}
            // </Mentions>
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
) (AllUsersList);
