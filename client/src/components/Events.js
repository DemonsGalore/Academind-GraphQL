import React, { Component, Fragment } from 'react';
import Modal from './modal/Modal';
import Backdrop from './backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import './events.css';

class Events extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      events: [],
      title: '',
      price: 0,
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

    const { title, price, date, description } = this.state;

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${+price}, date: "${date}"}) {
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
      this.getEvents();
    })
    .catch(err => {
      console.log(err);
    });
  };

  onModalCancel = () => {
    this.setState({ creating: false });
  };

  getEvents = () => {
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
      console.log(resData);
      const events = resData.data.events;
      this.setState({ events });
    })
    .catch(error => {
      console.log(error);
    });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id}>{event.title}</li>;
    })


    return (
      <Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal title="Add event" canCancel canConfirm onConfirm={this.onModalConfirm} onCancel={this.onModalCancel}>
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
                value={this.state.price}
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
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.onCreateEvent}>Create event</button>
          </div>
        )}
        <ul className="events-list">
          {eventList}
        </ul>
      </Fragment>
    );
  }
}

export default Events;
