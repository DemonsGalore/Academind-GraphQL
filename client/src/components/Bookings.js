import React, { Component, Fragment } from 'react';
import AuthContext from '../context/auth-context';

import BookingList from './Bookings/BookingList';

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

  deleteBooking = bookingId => {
    // TODO: loading spinner necessary?
    this.setState({ isLoading: true });
    const requestBody = {
      variables: {
        id: bookingId
      },
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
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
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookingId;
        });
        return { bookings: updatedBookings, isLoading: false };
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
          <BookingList
            bookings={this.state.bookings}
            deleteBooking={this.deleteBooking}
          />
        )}
      </Fragment>
    );
  }
}

export default Bookings;
