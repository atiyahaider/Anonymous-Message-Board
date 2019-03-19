import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Boards from './components/boards';
import Thread from './components/thread';
import ThreadList from './components/threadList';
import Reply from './components/reply';
import './App.css';


/* the main page for the index route of this app */
class App extends Component {
  render (){
    return (
      <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route path="/" exact component={Boards} />
              <Route path="/boards" exact component={Boards} />
              <Route path="/threads/:board" component={ThreadList} />
              <Route path="/thread" exact component={Thread} />
              <Route path="/thread/:threadId" component={Thread} />
              <Route path="/reply/:threadId" exact component={Reply} />
              <Route path="/reply/:threadId/:replyId" component={Reply} />
            </Switch>
            <Footer />
          </div>
      </BrowserRouter>
    );
  }
}

export default App;