import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Auth from './components/Auth';
import Bookings from './components/Bookings';
import Events from './components/Events';
import Home from './components/Home';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    userId: null,
    token: null,
  }

  login = (userId, token, tokenExpiration) => {
    this.setState({
      userId,
      token,
    });
  }

  logout = () => {
    this.setState({
      userId: null,
      token: null,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <AuthContext.Provider
            value={{
              userId: this.state.userId,
              token: this.state.token,
              login: this.login,
              logout: this.logout,
            }}>
            <Navbar />
            <main>
              <Switch>
                {this.state.token &&
                  <Redirect from="/auth" to="/" exact />
                }
                {!this.state.token &&
                  <Route path="/auth" component={Auth} />
                }
                {this.state.token &&
                  <Route path="/bookings" component={Bookings} />
                }
                {!this.state.token &&
                  <Redirect from="/bookings" to="/" exact />
                }
                <Route path="/events" component={Events} />
                <Route path="/" component={Home} />
                <Route path="/" component={null} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
