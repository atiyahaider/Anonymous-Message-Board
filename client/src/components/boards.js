import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBoards, addBoard } from '../actions/boardActions';
import './boards.css';

class Boards extends Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    e.preventDefault();
    this.props.history.push('/thread');
  }
  
  componentDidMount() {
    this.props.getBoards();
  }

  render() {
    const { boards, err } = this.props.board;

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
        <div>
          <section id="content">
            <div id="tableWrapper">
              <table className="boards">
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
                        <tr key={board._id}>
                          <td className="boardCell" style={{textAlign: 'left', width: '50%'}}>{board._id}</td>
                          <td className="boardCell">{board.threads}</td>
                          <td className="boardCell">{board.replies}</td>
                          <td className="boardCell">{(new Date(board.bumped_on)).toLocaleString("en-US")}</td>
                        </tr>
                        ))
                  }
                </tbody>
              </table>
            </div>
            <button className="button" onClick={this.handleClick}>New Board</button>
          </section>
        </div>
      );
    };
  };
};

const mapStateToProps = state => ({
  board: state.board
});

const mapDispatchToProps = dispatch => ({
  getBoards: () => dispatch(getBoards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Boards);