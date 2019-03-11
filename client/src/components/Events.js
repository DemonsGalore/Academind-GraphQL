import React, { Component, Fragment } from 'react';
import Modal from './modal/Modal';
import Backdrop from './backdrop/Backdrop';

import './events.css';

class Events extends Component {
  state = {
    creating: false,
  }

  onCreateEvent = () => {
    this.setState({ creating: true });
  }

  onModalConfirm = () => {
    this.setState({ creating: false });
  };

  onModalCancel = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal title="Add event" canCancel canConfirm onConfirm={this.onModalConfirm} onCancel={this.onModalCancel}>
          <p>Modal content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={this.onCreateEvent}>Create event</button>
        </div>
      </Fragment>
    );
  }
}

export default Events;
