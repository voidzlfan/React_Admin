import React, { Component } from 'react';

import './home.less'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="home">欢迎使用奥莱后台管理系统</div>
         );
    }
}
 
export default Home;