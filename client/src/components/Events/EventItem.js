import React from 'react';

const eventItem = props => (
  <li key={props.eventId}>
    <div>
      <h3>{props.title}</h3>
      <h5>{props.price} € - {new Date(props.date).toLocaleDateString()}</h5>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p> You are the owner of this event.</p>
      ) : (
        <button
          className="btn"
          onClick={props.onViewDetails.bind(this, props.eventId)}>
            View details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
