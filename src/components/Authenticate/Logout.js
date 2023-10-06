import React from 'react';

class Logout extends React.Component{

    componentDidMount() {
        localStorage.removeItem('authToken')
        window.location = '/'
    }

    render(){
        return null
    }
}

export default Logout