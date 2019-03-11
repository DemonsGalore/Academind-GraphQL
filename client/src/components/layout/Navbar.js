import React, { Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './navbar.css';

const navbar = props => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header>
          <div>
            <Link to="/"><h1>EventApp</h1></Link>
          </div>
          <nav className="nav-main">
            <ul>
              {!context.token &&
                <li><NavLink to="/auth">Authentication</NavLink></li>
              }
              <li><NavLink to="/events">Events</NavLink></li>
              {context.token &&
                <Fragment>
                  <li><NavLink to="/bookings">Bookings</NavLink></li>
                  <li><button onClick={context.logout}>Sign out</button></li>
                </Fragment>
              }
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default navbar;
