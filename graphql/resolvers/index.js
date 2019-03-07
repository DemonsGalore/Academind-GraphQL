const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {
    const events = await Event.find({_id: {$in: eventIds}})
    events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
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
      creator: '5c80d517d6d74b0aa420664a',
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById('5c80d517d6d74b0aa420664a')

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
  createUser: async args => {
    const { email, password } = args.userInput;

    try {
      const exisitingUser = await User.findOne({ email });
      if (exisitingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
      });
      const result = await user.save();

      return {
        ...result._doc,
        _id: result.id,
        password: null,
      };
    } catch (error) {
      throw error;
    }
  }
};
