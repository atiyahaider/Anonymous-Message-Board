import React, { Component } from "react";
import { connect } from 'react-redux';
import Modal from './modal';
import { hideModal } from '../actions/modalActions';

import { THREAD_DELETE, REPLY_DELETE } from './deleteTypes'; 
import { deleteReply } from '../actions/replyListActions';
import { deleteThread } from '../actions/threadListActions';

import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';

const DELETE_TYPES = {
  THREAD_DELETE: 'thread',
  REPLY_DELETE: 'reply'
};

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      content: '',
      delete_password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    const delete_type = DELETE_TYPES[this.props.modal.modalProps.delete_type];
    this.setState({content: 'Are you sure you want to delete this ' + delete_type + '? If so, please enter the password to delete this ' + delete_type + ':'});
  }
                  
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  onConfirm(e) {
    e.preventDefault();

    const props = this.props.modal.modalProps;

    switch (props.delete_type) {
      case THREAD_DELETE:
        this.props.deleteThread(props.board, props.thread_id, this.state.delete_password)
        .then(() => {
            if (this.props.modal.err) 
              this.setState({content: this.props.modal.err + '. Please enter the password again:'});
            else 
              this.props.hideModal();
        });
        break;
      case REPLY_DELETE:
        this.props.deleteReply(props.board, props.thread_id, props.reply_id, this.state.delete_password)
        .then(() => {
            if (this.props.modal.err) 
              this.setState({content: this.props.modal.err + '. Please enter the password again:'});
            else
              this.props.hideModal();
        });
        break;
      default:
        break;
    }  
  }

  onCancel(e) {
    e.preventDefault();
    this.props.hideModal();
  }

  onClose() {
    this.props.hideModal();
  }

  render() {
    const delete_type = DELETE_TYPES[this.props.modal.modalProps.delete_type];
    const { loading } = this.props.modal;
    
    return (
      <Modal onClose={this.onClose}>
        <div id="modalBoxHeader">Delete {delete_type}
          { loading && <span style={{float: 'right', transform: 'translateY(28%)'}}><Spinner /></span> }
        </div>
        <form id="deleteForm" onSubmit={this.onConfirm}>
          <div id="modalBoxBody">
            {this.state.content}<br /><br />
            <div style={{textAlign: 'center'}}>
              <input type="password" placeholder="Enter password" id="delete_password" required onChange={this.handleChange} value={this.state.delete_password}/>
            </div>
          </div>
          <div id="modalBoxFooter">
            <button type="submit" className="modalButton" disabled={loading}>Yes</button>&nbsp;&nbsp;&nbsp;
            <button className="modalButton" onClick={this.onCancel} disabled={loading}>Cancel</button>
          </div>          
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  deleteThread: (board, thread_id, password) => dispatch(deleteThread(board, thread_id, password)),
  deleteReply: (board, thread_id, reply_id, password) => dispatch(deleteReply(board, thread_id, reply_id, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);