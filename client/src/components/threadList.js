import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getThreadList, reportThread } from '../actions/threadListActions';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './lists.css';

import Pagination from './pagination';
import { THREADS_LIST } from '../reducers/listTypes';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL, CONFIRM_MODAL} from '../modals/modalTypes';
import { THREAD_DELETE } from '../modals/deleteTypes'; 

class ThreadList extends Component {
  constructor(props) {
    super(props);
  
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleNewThreadClick = this.handleNewThreadClick.bind(this);
    this.goBack = this.goBack.bind(this);
    this.editThread = this.editThread.bind(this);
    this.reportThread = this.reportThread.bind(this);
    this.deleteThread = this.deleteThread.bind(this);
  }
  
  componentDidMount() {
    this.props.getThreadList(this.props.match)
  }

  componentDidUpdate() {
    if (this.props.threads.err)
      this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.threads.err});
  }

  handleRowClick(e) {
    e.preventDefault();
    this.props.history.push('/replies/' + this.props.match.params.board + '/' + e.currentTarget.getAttribute('threadid'));
  }

  handleNewThreadClick(e) {
    e.preventDefault();
    if (this.props.threads.length === 0)
      this.props.history.push('/newboard');
    else
      this.props.history.push('/newthread/' + this.props.match.params.board);
  }

  goBack() {
    this.props.history.push('/');
  }

  editThread(e) {
    this.props.history.push('/editThread/' + this.props.match.params.board + '/' + e.target.getAttribute('id'));
  }

  reportThread(e) {
    this.props.reportThread(this.props.match.params.board, e.target.getAttribute('id'))
      .then(() => {
        if (!this.props.threads.err) 
          this.props.showModal(ALERT_MODAL, {header: 'Confirmation', content: 'The thread has been reported.'});
      });
  }
  
  deleteThread(e) {
    this.props.showModal(CONFIRM_MODAL, { delete_type: THREAD_DELETE, board: this.props.match.params.board, thread_id: e.target.getAttribute('id') });
  }

  render() {
    const { threads, loading, err } = this.props.threads;

    if (loading) {
      return (
        <section id="content">
          <Spinner />
        </section>
      )
    }
    
    if (err) 
      return null;
    
    if (threads.length === 0) {
      return (
        <div>
          <section id="content">
            <p className="notExists">No Threads exist yet. Please create a New Thread.</p><br />
            <button className="button" onClick={this.handleNewThreadClick}>New Thread</button>
          </section>
        </div>
      );
    }
    
    else {
      return (
        <div>
          <Pagination listName="Threads" listType={THREADS_LIST}/>
          <section id="content">
            <div className="threadHeader">
              <p>Board: <span style={{color: 'white'}}>{this.props.match.params.board}</span></p>      
              <p>Last Bumped: <span style={{color: 'white'}}>{(new Date(threads[0].bumped_on)).toLocaleString("en-US")}</span></p>
            </div>
            <div id="tableWrapper">
              <table className="list">
                <tbody>
                  { threads.map( thread => (
                        <tr key={thread._id}>
                          <td className="listCell" threadid={thread._id} onClick={this.handleRowClick}>
                            <span style={{fontSize: '0.7em', color: 'gray'}}>{thread._id}</span>
                            <span style={{float: 'right', fontSize: '0.7em', color: 'gray'}}>{(new Date(thread.bumped_on)).toLocaleString("en-US")}</span><br />
                            <span style={{fontSize: '0.9em'}}><strong>{thread.title}</strong></span><br />
                            <span style={{fontSize: '0.8em'}}>{thread.text}</span><br />
                            <span style={{fontSize: '0.7em', color: 'gray'}}>
                              <i className="fas fa-comment-dots"></i>&nbsp;{thread.reply_count} replies
                            </span>
                          </td>
                          <td className="listCell" style={{textAlign: 'center'}}>
                            {!thread.reported &&
                               <span><i className="fas fa-edit icon" onClick={this.editThread} id={thread._id} title="Edit Thread"></i><br /></span>
                            }
                            <i className={"fas fa-flag icon " + (thread.reported ? 'reported' : '')} onClick={this.reportThread} id={thread._id} title="Report Thread"></i><br />
                            <i className="fas fa-trash-alt icon" onClick={this.deleteThread} id={thread._id} title="Delete Thread"></i>
                          </td>
                        </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <button className="button" onClick={this.goBack}>&lt;&lt; Back</button>
            <button className="button" onClick={this.handleNewThreadClick}>New Thread</button>
          </section>
        </div>
      );
    };
  };
};

const mapStateToProps = state => ({
  threads: state.threadList
});

const mapDispatchToProps = dispatch => ({
  getThreadList: (pathname) => dispatch(getThreadList(pathname)),
  showModal: (modalType, modalProps)  => dispatch(showModal(modalType, modalProps)),
  reportThread: (board, threadId)  => dispatch(reportThread(board, threadId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList);