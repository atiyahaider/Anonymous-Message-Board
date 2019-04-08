import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import ModalContainer from './modals/modalContainer';
import Boards from './components/boards';
import Thread from './components/thread';
import ThreadList from './components/threadList';
import ReplyList from './components/replyList';
import Reply from './components/reply';
import './App.css';


/* the main page for the index route of this app */
export default () => {
  return (
    <BrowserRouter>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Boards} />
            <Route path="/boards" exact component={Boards} />
            <Route path="/newboard" exact component={Thread} />
            <Route path="/threads/:board" component={ThreadList} />
            <Route path="/newthread/:board" component={Thread} />
            <Route path="/editThread/:board/:threadId" component={Thread} />
            <Route path="/replies/:board/:threadId" component={ReplyList} />          
            <Route path="/newReply/:board/:threadId" component={Reply} />
            <Route path="/editReply/:board/:threadId/:replyId" component={Reply} />
          </Switch>
          <Footer />
          <ModalContainer />
        </div>
    </BrowserRouter>
  );
}