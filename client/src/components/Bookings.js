import React, { Component, Fragment } from 'react';
import AuthContext from '../context/auth-context';

import BookingsList from './Bookings/BookingsList';
import BookingsChart from './Bookings/BookingsChart';
import BookingsControl from './Bookings/BookingsControl';

import Spinner from './common/Spinner/Spinner';

class Bookings extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: false,
      outputType: 'list',
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
              price
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

  changeOutputType = outputType => {
    if (outputType === 'list') {
      this.setState({outputType: 'list'});
    } else {
      this.setState({outputType: 'chart'});
    }
  }

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <Fragment>
          <BookingsControl
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputType}
          />
          <div>
            {this.state.outputType === 'list' ? (
              <BookingsList
                bookings={this.state.bookings}
                deleteBooking={this.deleteBooking}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </Fragment>
      );

    }
    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }
}

export default Bookings;
