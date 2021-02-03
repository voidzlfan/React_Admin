import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const user = memoryUtils.user;

        if(!user || !user._id){
            return <Redirect to='/login'></Redirect>
        }

        return ( 
            <div>
                { user._id + " " + user.username + " " +user.password }
            </div>

        );
    }
}
 
export default Admin;