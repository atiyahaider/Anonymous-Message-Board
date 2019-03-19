import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './header.css';

class Header extends Component {
  render() {
    return (
      <div id="header">
        <div className="heading">Anonymous Message Board</div>
        <div className="homeLink">
          <NavLink to="/">Home</NavLink>
        </div> 
      </div>
    );
  };
};

export default Header;