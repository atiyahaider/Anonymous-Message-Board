import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {  
  return (
    <div id="header">
      <div className="heading">Anonymous Message Board</div>
      <div className="homeLink">
        <NavLink to="/" exact className="navLink">Home</NavLink>
      </div> 
    </div>
  );
};

export default Header;