import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBoards } from '../actions/boardActions';

import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './lists.css';

import Pagination from './pagination';
import { BOARDS_LIST } from '../reducers/listTypes';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL } from '../modals/modalTypes';

class Boards extends Component {
  constructor(props) {
    super(props);
  
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleNewBoardClick = this.handleNewBoardClick.bind(this);
  }
  
  componentDidMount() {
    this.props.getBoards(this.props.match)
  }

  componentDidUpdate() {
    if (this.props.boards.err)
      this.props.showModal(ALERT_MODAL, {header: 'Error', content: this.props.boards.err});
  }

  handleRowClick(e) {
    e.preventDefault();
    this.props.history.push('/threads/' + e.currentTarget.getAttribute('board'));
  }
  
  handleNewBoardClick(e) {
    e.preventDefault();
    this.props.history.push('/newboard');
  }
  
  render() {
    const { boards, loading, err } = this.props.boards;
    
    if (loading) {
      return (
        <section id="content">
          <Spinner />
        </section>
      )
    }
    
    if (err)            
      return null;
      
    if (boards.length === 0) {
      return (
        <div>
          <section id="content">
            <p className="notExists">No boards exist yet. Please create a New Board.</p><br />
            <button className="button" onClick={this.handleNewBoardClick}>New Board</button>
          </section>
        </div>
      );
    }
    else {
      return (
        <div>
          <Pagination listName="Boards" listType={BOARDS_LIST}/>
          <section id="content">
            <div id="tableWrapper">
              <table className="list">
                <thead>
                  <tr>
                    <th className="tableHeader" style={{textAlign: 'left', width: '50%'}}>Boards</th>
                    <th className="tableHeader">Threads</th>
                    <th className="tableHeader">Replies</th>
                    <th className="tableHeader">Last Bumped</th>
                  </tr>
                </thead>
                <tbody>
                  { boards.map( board => (
                        <tr key={board._id} board={board._id} onClick={this.handleRowClick}>
                          <td className="listCell" style={{textAlign: 'left', width: '50%'}}>{board._id}</td>
                          <td className="listCell">{board.threads}</td>
                          <td className="listCell">{board.replies}</td>
                          <td className="listCell">{(new Date(board.bumped_on)).toLocaleString("en-US")}</td>
                        </tr>
                        ))
                  }
                </tbody>
              </table>
            </div>
            <button className="button" onClick={this.handleNewBoardClick}>New Board</button>
          </section>
        </div>
      );
    };
  };
};

const mapStateToProps = state => ({
  boards: state.boardList
});

const mapDispatchToProps = (dispatch, getState) => ({
  getBoards: (pathname) => dispatch(getBoards(pathname)),
  showModal: (modalType, modalProps)  => dispatch(showModal(modalType, modalProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(Boards);