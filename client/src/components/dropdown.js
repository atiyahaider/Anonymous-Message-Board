import React from 'react';
import './dropdown.css';


class Dropdown extends React.Component {
  constructor(){
    super();
    
    this.state = {
       displayMenu: false,
    };

    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  };

  showDropdownMenu(e) {
    e.preventDefault();
    this.setState({ displayMenu: true }, () => {
        document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });
  }

  changeTheme(e) {
    e.stopPropagation();
    document.documentElement.style.setProperty('--main-hue', 
                      getComputedStyle(document.documentElement).getPropertyValue(e.target.getAttribute('id')));
  }
  
  render() {
    console.log('render')
    console.log(this.state.displayMenu)
    return (
      <div id="dropdown">
        <div className="menu" onClick={this.showDropdownMenu}> Choose Color Theme 

          { this.state.displayMenu ? (
              <ul onClick={this.changeTheme}>
                 <li id="--red-hue">Red</li>
                 <li id="--green-hue">Green</li>
                 <li id="--blue-hue">Blue</li>
              </ul>
            ):
            (
              null
            )
          }
          
        </div>
      </div>

    );
  }
}

export default Dropdown;