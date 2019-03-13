const DataLoader = require('dataloader');

const Booking = require('../../models/booking');
const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}});
});

const events = async eventIds => {
  try {
    const events = await Event.find({_id: {$in: eventIds}})
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt),
    };
  } catch (error) {
    throw error;
  }
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
    createdAt: dateToString(event._doc.createdAt),
    updatedAt: dateToString(event._doc.updatedAt),
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
