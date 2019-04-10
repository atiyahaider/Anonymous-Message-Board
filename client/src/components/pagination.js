import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onPrevious, onNext, setLimit } from '../actions/paginationActions';
import { BOARDS_LIST, THREADS_LIST, REPLIES_LIST } from '../reducers/listTypes';
import './pagination.css';

class Pagination extends Component {
  constructor(props){
    super(props);

    this.state = {
      limit: this.props.list.limit
    }
 
    this.handleChange = this.handleChange.bind(this);
    this.displayPrevious = this.displayPrevious.bind(this);
    this.displayNext = this.displayNext.bind(this);
  }
  
  handleChange(e) {
    this.setState({limit: e.target.value});
    this.props.setLimit(this.props.listType, parseInt(e.target.value), this.props.list.pathname)
  }

  displayPrevious(e) {
    e.preventDefault();
    this.props.onPrevious(this.props.listType, this.props.list.offset, this.props.list.limit, this.props.list.pathname)
  }
  
  displayNext(e) {
    e.preventDefault();
    this.props.onNext(this.props.listType, this.props.list.offset, this.props.list.limit, this.props.list.pathname, this.props.list.total)
  }

  render(){
    let options = [];
    if (this.props.listType === REPLIES_LIST) {
      for (let i=3; i<=15; i=i+3) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
    }
    else {
      for (let i=10; i<=50; i=i+5) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
    }
    
    let start = this.props.list.offset + 1;
    let end = Math.min(this.props.list.offset + this.props.list.limit, this.props.list.total);
    
    return (
      <div id="pagination">
        <div className="pageDiv">
          <label id="limitLabel">{this.props.listName} per page: </label>
           <select id="limitSelect" value={this.state.limit} onChange={this.handleChange}>
             {options}
           </select>
        </div>
        <div className="pageDiv" style={{fontSize: '0.95em'}}>
          {start !== 1 &&
            <button className="pageButton" onClick={this.displayPrevious}><i className="fas fa-chevron-left"></i></button>}
          <span id="pageNumber"><strong>{start} - {end} of {this.props.list.total}</strong></span>
          {end !== this.props.list.total &&
            <button className="pageButton" onClick={this.displayNext}><i className="fas fa-chevron-right"></i></button> }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: (ownProps.listType === BOARDS_LIST) ? state.pagination.boards : 
        (ownProps.listType === THREADS_LIST) ? state.pagination.threads : state.pagination.replies
});

const mapDispatchToProps = dispatch => ({
  onPrevious: (listType, offset, limit, pathname) => dispatch(onPrevious(listType, offset, limit, pathname)),
  onNext: (listType, offset, limit, pathname, total) => dispatch(onNext(listType, offset, limit, pathname, total)),
  setLimit: (listType, limit, pathname) => dispatch(setLimit(listType, limit, pathname))
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);