import React, { Component } from "react";
import { connect } from 'react-redux';
import { hideModal } from '../actions/modalActions';
import Modal from './modal';

class AlertModal extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.hideModal();
  }

  render() {
    return (
      <Modal onClose={this.onClose}>
         <div id="modalBoxHeader">{this.props.modalProps.header}</div>
         <div id="modalBoxBody">{this.props.modalProps.content}</div>
         <div id="modalBoxFooter"><button className="modalButton" onClick={this.onClose}>OK</button></div>          
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modalProps: state.modal.modalProps
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);