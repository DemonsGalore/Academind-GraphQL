const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

// body-parser middleware
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find()
        .then(events => {
          return events.map(event => {
            return { ...event._doc, _id: event.id };
          })
        })
        .catch(err => {
          throw err;
        });
    },
    createEvent: (args) => {
      const { title, description, price, date } = args.eventInput;

      const event = new Event({
        title,
        description,
        price,
        date: new Date(date),
        creator: '5c7fd48330838d37509f1b1f',
      });

      let createdEvent;

      return event
        .save()
        .then(res => {
          createdEvent = { ...res._doc, _id: res.id };
          return User.findById('5c7fd48330838d37509f1b1f')
        })
        .then(user => {
          if (!user) {
            throw new Error('User not found.');
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(res => {
          return createdEvent;
        })
        .catch(err => {
          throw err;
        });
    },
    createUser: (args) => {
      const { email, password } = args.userInput;

      return User.findOne({ email }).then(user => {
        if (user) {
          throw new Error('User exists already.');
        }
        return bcrypt.hash(password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then(res => {
        return { ...res._doc, _id: res.id, password: null };
      })
      .catch(err => {
        throw err;
      });
    }
  },
  graphiql: true
}));


// connect to MongoDB
const db_name = 'qraphql_database';
const db = 'mongodb://localhost:27017/' + db_name;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB connected.');
    // start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
  })
  .catch(err => console.log("Error", err));
