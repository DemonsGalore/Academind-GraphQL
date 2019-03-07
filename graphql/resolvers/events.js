const Event = require('../../models/event');
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
  createEvent: async args => {
    const { title, description, price, date } = args.eventInput;

    const event = new Event({
      title,
      description,
      price,
      date: new Date(date),
      creator: '5c80ee57c6cc6b43d0b9bbf9',
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById('5c80ee57c6cc6b43d0b9bbf9')

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  }
};
