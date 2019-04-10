import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getReplyList, reportReply } from '../actions/replyListActions';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './lists.css';

import Pagination from './pagination';
import { REPLIES_LIST } from '../reducers/listTypes';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL, CONFIRM_MODAL } from '../modals/modalTypes';
import { REPLY_DELETE } from '../modals/deleteTypes'; 

class ReplyList extends Component {
  constructor(props) {
    super(props);
  
    this.handleNewReplyClick = this.handleNewReplyClick.bind(this);
    this.goBack = this.goBack.bind(this);
    this.editThread = this.editThread.bind(this);
    this.editReply = this.editReply.bind(this);
    this.reportReply = this.reportReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }
  
  componentDidMount() {
    this.props.getReplyList(this.props.match);
  }

  componentDidUpdate() {
    if (this.props.replyList.err)
      this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.replyList.err});
  }

  handleNewReplyClick(e) {
    e.preventDefault();
    this.props.history.push('/newReply/' + this.props.match.params.board + '/' + this.props.match.params.threadId);
  }

  goBack() {
    this.props.history.push('/threads/' + this.props.match.params.board);
  }

  editThread() {
    this.props.history.push('/editThread/' + this.props.replyList.thread.board + '/' + this.props.replyList.thread._id);
  }
  
  editReply(e) {
    this.props.history.push('/editReply/' + this.props.replyList.thread.board + '/' + this.props.replyList.thread._id + '/' + e.target.getAttribute('id'));
  }

  reportReply(e) {
    this.props.reportReply(this.props.replyList.thread.board, this.props.replyList.thread._id, e.target.getAttribute('id'))
      .then(() => {
        if (!this.props.replyList.err) 
          this.props.showModal(ALERT_MODAL, {header: 'Confirmation', content: 'The reply has been reported.'});
      });
  }
  
  deleteReply(e) {
    this.props.showModal(CONFIRM_MODAL, { delete_type: REPLY_DELETE, board: this.props.replyList.thread.board, thread_id: this.props.replyList.thread._id, 
                                          reply_id: e.target.getAttribute('id') });
  }
  
  render() {
    const { thread, replies, loading, err } = this.props.replyList;

    if (loading) {
      return (
        <section id="content">
          <Spinner />
        </section>
      )
    }
    
    if (err) 
      return null;

    if (!thread) 
      return null;

    else {
      return (
        <div>
          <section id="content">
            <div className="threadHeader">
              <p style={{fontSize: '1.2em'}}>Board: <span style={{color: 'white'}}>{thread.board}</span></p>      
              <hr />
              {!thread.reported && (
                <div style={{textAlign: 'right', paddingBottom: '5px'}}>
                  Edit &nbsp;<i className="fas fa-edit fa-lg icon" onClick={this.editThread} title="Edit Thread"></i>
                </div>
                )
              }
              <p>Thread Id: <span style={{color: 'gray'}}>{thread._id}</span> 
                <span style={{float: 'right'}}>
                  <span >Last Bumped:&nbsp;</span>
                  <span style={{color: 'gray'}}>{(new Date(thread.bumped_on)).toLocaleString("en-US")}</span>
                </span>
              </p>  
              <p>Thread: <span style={{color: 'white'}}>{thread.title}</span></p>      
              <p>Created On: <span style={{color: 'white'}}>{(new Date(thread.created_on)).toLocaleString("en-US")}</span></p>      
              <p><span style={{color: 'white', fontSize: '0.9em'}}>{thread.text}</span></p>      
            </div>

            { replies.length === 0 ? (
               <div>
                  <section id="content">
                    <br /><p className="notExists">No Replies yet. Please add a Reply.</p><br />
                  </section>
                </div>
              ) : (
                <div>
                  <Pagination listName="Replies" listType={REPLIES_LIST}/>
                  <div id="tableWrapper">
                    <table className="list">
                      <tbody>
                        { replies.map( reply => (
                              <tr key={reply._id} replyid={reply._id} className="rowClick">
                                <td className="listCell">
                                  <span style={{float: 'left', fontSize: '0.7em', color: 'gray'}}>{reply._id}</span>
                                  <span style={{float: 'right', fontSize: '0.7em', color: 'gray'}}>{(new Date(reply.bumped_on)).toLocaleString("en-US")}</span>
                                  <br /><span style={{fontSize: '0.8em'}}>{reply.text}</span>
                                </td>
                                <td className="listCell" style={{textAlign: 'center'}}>
                                  {!reply.reported && reply.text !== '[deleted]' &&
                                     <span><i className="fas fa-edit icon" onClick={this.editReply} id={reply._id} title="Edit Reply"></i><br /></span>
                                  }
                                  <i className={"fas fa-flag icon " + (reply.reported ? 'reported' : '')} onClick={this.reportReply} id={reply._id} title="Report Reply"></i><br />
                                  {reply.text !== '[deleted]' && 
                                      <i className="fas fa-trash-alt icon" onClick={this.deleteReply} id={reply._id} title="Delete Reply"></i>
                                  }
                                </td>
                              </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
              </div>
              )}
            <button className="button" onClick={this.goBack}>&lt;&lt; Back</button>
            <button className="button" onClick={this.handleNewReplyClick}>Add Reply</button>
          </section>
        </div>
      );
    };
  };
};

const mapStateToProps = state => ({
  replyList: state.replyList
});

const mapDispatchToProps = dispatch => ({
  getReplyList: (pathname) => dispatch(getReplyList(pathname)),
  showModal: (modalType, modalProps)  => dispatch(showModal(modalType, modalProps)),
  reportReply: (board, threadId, replyId)  => dispatch(reportReply(board, threadId, replyId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyList);