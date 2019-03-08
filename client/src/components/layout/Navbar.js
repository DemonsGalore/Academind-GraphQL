import React from 'react';
import { NavLink } from 'react-router-dom';

import './navbar.css';

const navbar = props => (
  <header>
    <div className="">
      <h1>EventApp</h1>
    </div>
    <nav className="nav-main">
      <ul>
        <li><NavLink to="/auth">Authentication</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/bookings">Bookings</NavLink></li>
      </ul>
    </nav>
  </header>
);

export default navbar;
