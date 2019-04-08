import React, { Component } from "react";
import './modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onDialogClick = this.onDialogClick.bind(this);
  }
  
  listenKeyboard(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    if (this.props.onClose) {
      window.addEventListener('keydown', this.listenKeyboard.bind(this), true);
    }
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      window.removeEventListener('keydown', this.listenKeyboard.bind(this), true);
    }
  }

  onOverlayClick() {
    this.props.onClose();
  }

  onDialogClick(event) {
    event.stopPropagation();
  }
  
  render () {
    return (
      <div>
        <div className="modal-overlay" onClick={this.onOverlayClick}>
          <div className="modal-box" onClick={this.onDialogClick}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  };
}

export default Modal;