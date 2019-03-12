import React from 'react';

import './BookingList.css';

const bookingList = props => (
  <ul className="booking-list">
    {props.bookings.map(booking => {
      return (
        <li key={booking._id}>
          <div>
            {booking.event.title}
            {' - '}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div>
            <button
              className="btn"
              onClick={props.deleteBooking.bind(this, booking._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      )
    })}
  </ul>
);

export default bookingList;
