const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    const { isAuth, userId } = req;
    if (!isAuth) {
      throw new Error('Unauthenticated!');
    }
    const { eventId } = args;
    const fetchedEvent = await Event.findOne({ _id: eventId });
    const newBooking = new Booking({
      user: userId,
      event: fetchedEvent,
    });
    const result = await newBooking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const { bookingId } = args;
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};
