import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addThread, editThread } from '../actions/threadActions';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './form.css';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL } from '../modals/modalTypes';

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      thread_id: '',
      title: '',
      text: '',
      delete_password: '',
      newBoard: false,
      edit: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
   
  componentDidMount() {
    this.setState({ newBoard: (this.props.match.path === '/newboard') });
    
    if (this.props.match.path === '/newthread/:board') 
      this.setState({ board: this.props.match.params.board });
    
    if (this.props.match.path === '/editThread/:board/:threadId') {
      let thread = this.props.threadInfo;
      this.setState({board: this.props.match.params.board,
                     thread_id: thread._id,
                     title: thread.title, 
                     text: thread.text,
                     edit: true});
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
      this.props.editThread(this.state)
        .then(() => {
          if (this.props.thread.err) 
            this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.thread.err});
          else
            this.props.history.goBack();
            //this.props.history.push('/threads/' + this.state.board);
        });
    }
    else {
      this.props.addThread(this.state)
        .then(() => {
          if (this.props.thread.err) 
            this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.thread.err});
          else
            this.props.history.push('/threads/' + this.state.board);
        });
    }
  }
  
  onCancel(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { loading } = this.props.thread;

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
              <h2>{this.state.edit ? 'Update ' : 'New ' }Thread
                {!this.state.edit && <span id="apiLink">(POST /api/threads/:board)</span> }
              </h2>
              <hr style={{marginTop: '8px', borderTop: '1px solid gray'}}/>
            </div>
            <input type="hidden" id="newBoard" value={this.state.newBoard} />
            <div className="fixed-field">
              <label htmlFor="board">Board: { !(this.state.newBoard) && <span className="fixedInfo">{this.state.board}</span> }</label>
              { this.state.newBoard &&
                    <input type="text" placeholder="board" id="board" required onChange={this.handleChange} value={this.state.board} maxLength="100"/>
              }
            </div>
            { this.state.edit && (
                <div className="fixed-field">
                  <label htmlFor="threadId">Thread Id: <span className="fixedInfo">{this.state.thread_id}</span>
                  </label>
                  <input type="hidden" id="thread_id" value={this.state.thread_id} />
                </div>
              )
            }
            <div className="input-field">
              <label htmlFor="title">Title: </label>
              <input type="text" placeholder="Thread title..." id="title" required onChange={this.handleChange} value={this.state.title} maxLength="200"/>
            </div>
            <div className="input-field">
              <label htmlFor="text">Text: </label>
              <textarea type="text" placeholder="Thread text..." id="text" required onChange={this.handleChange} value={this.state.text} maxLength="1500"></textarea>
            </div>
            <div className="input-field">
              <label htmlFor="delete_password">Password for Delete/Edit: </label>
              <input type="password" placeholder="password to delete/edit" id="delete_password" required onChange={this.handleChange} value={this.state.delete_password} maxLength="20"/>
            </div>
            <div id="btnSection">
              <button type="reset" className="button" disabled={loading}>Clear</button>
              <button type="submit" className="button" disabled={loading}>{ this.state.edit ? 'Update ' : 'Add ' }Thread</button>
              <button className="button" onClick={this.onCancel} disabled={loading}>Cancel</button>
            </div>
          </form>
        </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => ({
  thread: state.thread,
  threadInfo: state.threadList.threads.find(thread => thread._id === ownProps.match.params.threadId)
});

const mapDispatchToProps = dispatch => ({
  addThread: thread => dispatch(addThread(thread)),
  editThread: thread => dispatch(editThread(thread)),
  showModal: (modalType, modalProps)  => dispatch(showModal(modalType, modalProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);