const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args, req) => {
    const { isAuth, userId } = req;
    if (!isAuth) {
      throw new Error('Unauthenticated!');
    }
    const { title, description, price, date } = args.eventInput;

    const newEvent = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: userId,
    });

    let createdEvent;

    try {
      const result = await newEvent.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(userId)

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(newEvent);
      await creator.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  }
};
