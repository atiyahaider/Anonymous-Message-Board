import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setSearch } from '../actions/paginationActions';
import './search.css';

class Search extends Component {
  constructor(props){
    super(props);

    this.state = {
      search: this.props.pathname.params.search
    }
 
    this.handleChange = this.handleChange.bind(this);
    this.searchBoards = this.searchBoards.bind(this);
    this.allBoards = this.allBoards.bind(this);
  }
  
  handleChange(e) {
    this.setState({search: e.target.value});
  }

  searchBoards(e) {
    e.preventDefault();
    this.props.setSearch(this.state.search)
  }

  allBoards(e) {
    e.preventDefault();
    this.props.setSearch('')
  }

  render(){
    return (
      <div className="threadHeader">
        <form id="searchForm">
          <div id="searchDiv">
            <div style={{flexGrow: "7"}}>
              Search Boards: <input type="text" name="searchBoard" value={this.state.search} onChange={this.handleChange}/>&nbsp;&nbsp;
              <button type="submit" id="searchButton" onClick={this.searchBoards}>Go</button>
            </div>
            <div style={{flexGrow: "0"}}>
              <NavLink to="/" exact className="boardLink" onClick={this.allBoards}>All Boards</NavLink>
            </div>
          </div>
        </form>
      </div>   
    )
  }
}

const mapStateToProps = (state) => ({
  pathname: state.pagination.boards.pathname
});

const mapDispatchToProps = dispatch => ({
  setSearch: (search) => dispatch(setSearch(search))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);