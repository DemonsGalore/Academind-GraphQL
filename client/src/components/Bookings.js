import React, { Component, Fragment } from 'react';
import AuthContext from '../context/auth-context';

import Spinner from './common/Spinner/Spinner';

class Bookings extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: false,
      errors: {},
    };
  }

  componentDidMount() {
    this.getBookings();
  }

  getBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      const bookings = resData.data.bookings;
      this.setState({
        bookings,
        isLoading: false,
      });
    })
    .catch(error => {
      this.setState({ isLoading: false });
      console.log(error);
    });
  };

  render() {
    return (
      <Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {this.state.bookings.map(booking => (
              <li key={booking._id}>{booking.event.title} -
                {new Date(booking.createdAt).toLocaleDateString()}
              </li>
              )
            )}
          </ul>
        )}
      </Fragment>
    );
  }
}

export default Bookings;
