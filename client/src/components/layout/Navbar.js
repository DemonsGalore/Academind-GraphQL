import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './navbar.css';

const navbar = props => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header>
          <div className="">
            <h1>EventApp</h1>
          </div>
          <nav className="nav-main">
            <ul>
              {!context.token &&
                <li><NavLink to="/auth">Authentication</NavLink></li>
              }
              <li><NavLink to="/events">Events</NavLink></li>
              {context.token &&
                <li><NavLink to="/bookings">Bookings</NavLink></li>
              }
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default navbar;
