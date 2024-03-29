import React from 'react';

import EventItem from './EventItem';

import './EventList.css';

const eventList = props => {
  const events = props.events.map(event => {
    return <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      userId={props.authUserId}
      creatorId={event.creator._id}
      onViewDetails={props.onViewDetails}
    />
  });

  return <ul className="event-list">{events}</ul>;
};

export default eventList;
