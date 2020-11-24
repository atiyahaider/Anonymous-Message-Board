import React from 'react';
import Dropdown from './dropdown';
import './footer.css';

const Footer = () => {  
  return (
    <div id="footer">
      <div className="footerContent">Designed by <a target="_blank" href="https://atiyahaider.github.io/Portfolio/">Atiya Haider</a></div>      
      <Dropdown />
    </div>
  );
};

export default Footer;