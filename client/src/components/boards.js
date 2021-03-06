import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBoards } from '../actions/boardActions';

import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import './lists.css';

import Pagination from './pagination';
import { BOARDS_LIST } from '../reducers/listTypes';
import Search from './search';

import { showModal } from '../actions/modalActions';
import { ALERT_MODAL } from '../modals/modalTypes';

class Boards extends Component {
  constructor(props) {
    super(props);
  
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleNewBoardClick = this.handleNewBoardClick.bind(this);
  }
  
  componentDidMount() {
    this.props.getBoards(this.props.match);
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
      
    else {
      return (
        <div>
          <section id="content">          
            <Search />
            
            {  boards.length === 0 ? (
                <div>
                  <section id="content">
                    <p className="notExists">No boards found.</p><br />
                  </section>
                </div>
              ) :
              (
                <div>
                  <Pagination listName="Boards" listType={BOARDS_LIST}/>
                    <div id="tableWrapper">
                      <table className="list">
                        <thead>
                          <tr>
                            <th className="tableHeader boardName" style={{textAlign: 'left'}}>Boards</th>
                            <th className="tableHeader">Threads</th>
                            <th className="tableHeader">Replies</th>
                            <th className="tableHeader" style={{textAlign: 'left'}}>Last Bumped</th>
                          </tr>
                        </thead>
                        <tbody>
                          { boards.map( board => (
                                <tr className="rowClick" key={board._id} board={board._id} onClick={this.handleRowClick}>
                                  <td className="listCell boardName">{board._id}</td>
                                  <td className="listCell" style={{textAlign: 'center'}}>{board.threads}</td>
                                  <td className="listCell" style={{textAlign: 'center'}}>{board.replies}</td>
                                  <td className="listCell">{(new Date(board.bumped_on)).toLocaleString("en-US")}</td>
                                </tr>
                                ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
          
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