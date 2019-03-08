import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import Auth from './components/Auth';
import Bookings from './components/Bookings';
import Events from './components/Events';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={Auth} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/events" component={Events} />
          <Route path="/" component={null} />
          <Route path="/" component={null} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
