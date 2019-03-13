import React, { Component, Fragment } from 'react';
import Modal from './modal/Modal';
import Backdrop from './backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import EventList from './Events/EventList';
import Spinner from './common/Spinner/Spinner';

import './Events.css';

class Events extends Component {
  static contextType = AuthContext;

  isActive = true;

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      events: [],
      isLoading: false,
      selectedEvent: null,
      title: '',
      price: '',
      date: '',
      description: '',
      errors: {},
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCreateEvent = () => {
    this.setState({ creating: true });
  }

  onModalConfirm = () => {
    this.setState({ creating: false });

    // TODO: validation

    // let because +price
    let { title, price, date, description } = this.state;

    const requestBody = {
      variables: {
        title,
        price: +price,
        date,
        description,
      },
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
            _id
            title
            price
            date
            description
            creator {
              _id
              email
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
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
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId
          }
        });
        return {events: updatedEvents};
      });
    })
    .catch(err => {
      console.log(err);
    });
  };

  onModalCancel = () => {
    this.setState({
      creating: false,
      selectedEvent: null
    });
  };

  getEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      const events = resData.data.events;
      if (this.isActive) {
        this.setState({
          events,
          isLoading: false,
        });
      }
    })
    .catch(error => {
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
      console.log(error);
    });
  };

  viewDetails = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return {selectedEvent};
    });
  };

  bookEvent = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      variables: {
        id: this.state.selectedEvent._id,
      },
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
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
      this.setState({ selectedEvent: null });
    })
    .catch(error => {
      this.setState({ isLoading: false });
      console.log(error);
    });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating &&
          <Modal
            title="Add event"
            canConfirm
            canCancel
            onConfirm={this.onModalConfirm}
            onCancel={this.onModalCancel}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={+this.state.price}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={this.state.date}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={this.state.description}
                  onChange={this.onChange}
                />
              </div>
            </form>
          </Modal>
        }
        {this.state.selectedEvent &&
          <Modal
            title={this.state.selectedEvent.title}
            canConfirm
            canCancel
            onConfirm={this.bookEvent}
            onCancel={this.onModalCancel}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h3>{this.state.selectedEvent.title}</h3>
            <h5>
              {this.state.selectedEvent.price} € -
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h5>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        }
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.onCreateEvent}>Create event</button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetails={this.viewDetails}
          />
        )}
      </Fragment>
    );
  }
}

export default Events;
