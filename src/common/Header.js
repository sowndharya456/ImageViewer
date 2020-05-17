import React, { Component } from 'react';
import './Header.css';

class Header extends Component{
    

    render(){
      return (
          <div className='app-header'>
           <span className='app-logo'>Image Viewer</span>
          </div>
      )
    }
}

export default Header;