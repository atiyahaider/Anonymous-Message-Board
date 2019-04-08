import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addReply, editReply } from '../actions/replyActions';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './form.css';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL } from '../modals/modalTypes';

class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      thread_id: '',
      reply_id: '',
      text: '',
      delete_password: '',
      edit: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);    
  }
   
  componentDidMount() {
    this.setState({ board: this.props.match.params.board, thread_id: this.props.match.params.threadId });
    if (this.props.match.path === '/editReply/:board/:threadId/:replyId') {
      let thread = this.props.thread;
      let reply = thread.replies.find(reply => reply._id === this.props.match.params.replyId);
      this.setState({reply_id: reply._id, text: reply.text, edit: true});
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.edit) {    
      this.props.editReply(this.state)
        .then(() => {
          if (this.props.reply.err) 
            this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.reply.err});
          else
            this.props.history.push('/replies/' + this.state.board + '/' + this.state.thread_id);
        });
    }
    else {
      this.props.addReply(this.state)
        .then(() => {
          if (this.props.reply.err) 
            this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.reply.err});
          else
            this.props.history.push('/replies/' + this.state.board + '/' + this.state.thread_id);
        });
    }
  }
  
  onCancel(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { loading } = this.props.reply;

    if (loading) {
      return (
        <section id="content">
          <Spinner />
        </section>
      )
    }

    return (
        <div id="content">
          <form id="inputForm" onSubmit={this.handleSubmit}>
            <div className="subHeading">
              <h2>{this.state.edit ? 'Update ' : 'New ' }Reply
                {!this.state.edit && <span id="apiLink">(POST /api/replies/:board)</span> }
              </h2>
            </div>
            <div className="fixed-field">
              <label htmlFor="board">Board: <span className="fixedInfo">{this.state.board}</span></label>
            </div>
            <div className="fixed-field">
              <label htmlFor="threadId">Thread Id: <span className="fixedInfo">{this.state.thread_id}</span></label>
            </div>
            <div className="fixed-field">
              <label htmlFor="threadId">Thread: <span className="fixedInfo">{this.props.thread.title}</span></label>
            </div>
            { this.state.edit && (
                <div className="fixed-field">
                  <label htmlFor="replyId">Reply Id: <span className="fixedInfo">{this.state.reply_id}</span>
                  </label>
                  <input type="hidden" id="reply_id" value={this.state.reply_id} />
                </div>
              )
            }
            <div className="input-field">
              <label htmlFor="text">Text: </label>
              <textarea type="text" placeholder="Reply text..." id="text" required onChange={this.handleChange} value={this.state.text} maxLength="1000"></textarea>
            </div>
            <div className="input-field">
              <label htmlFor="delete_password">Password for Delete/Edit: </label>
              <input type="password" placeholder="password to delete/edit" id="delete_password" required onChange={this.handleChange} value={this.state.delete_password} maxLength="20"/>
            </div>
            <div id="btnSection">
              <button type="reset" className="button" disabled={loading}>Clear</button>
              <button type="submit" className="button" disabled={loading}>{ this.state.edit ? 'Update ' : 'Add ' }Reply</button>
              <button className="button" onClick={this.onCancel} disabled={loading}>Cancel</button>              
            </div>
          </form>
        </div>
    );
  }
};

const mapStateToProps = state => ({
  reply: state.reply,
  thread: state.replyList.thread
});

const mapDispatchToProps = dispatch => ({
  addReply: reply => dispatch(addReply(reply)),
  editReply: reply => dispatch(editReply(reply)),
  showModal: (modalType, modalProps)  => dispatch(showModal(modalType, modalProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(Reply);