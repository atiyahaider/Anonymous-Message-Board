import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addThread } from '../actions/threadActions';
import './thread.css';

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      title: '',
      text: '',
      delete_password: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  
  handleChange(e) {
    console.log(e);
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    this.props.addThread(this.state);
    //this.props.history.push('/threads/' + this.state.board);
    this.props.history.push('/');
  }
  
  render() {
    console.log(this.props)
    const { err } = this.props.thread;

    if (err) {
      return (
        <div>
          <section id="content">
              <p>Error: {err}</p>
          </section>
        </div>
      )
    }
    else {
      return (
        <div id="content">
          <form id="threadForm" onSubmit={this.handleSubmit}>
            <div className="subHeading">
              <h2>New thread
                <span>(POST /api/threads/:board)</span>
              </h2>
            </div>
            <div className="input-field">
              <label htmlFor="board">Board: </label>
              <input type="text" placeholder="board" id="board" required onChange={this.handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="title">Title: </label>
              <input type="text" placeholder="Thread title..." id="title" required onChange={this.handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="text">Text: </label>
              <textarea type="text" placeholder="Thread text..." id="text" required onChange={this.handleChange}></textarea>
            </div>
            <div className="input-field">
              <label htmlFor="delete_password">Delete Password: </label>
              <input type="password" placeholder="password to delete" id="delete_password" required onChange={this.handleChange} />
            </div>
            <div id="btnSection">
              <button type="reset" className="button">Clear</button>
              <button type="submit" className="button">Add Thread</button>
            </div>
          </form>
        </div>
      );
    }
  };
};

const mapStateToProps = state => ({
  thread: state.thread
});

const mapDispatchToProps = dispatch => ({
  addThread: (thread) => dispatch(addThread(thread))
});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);