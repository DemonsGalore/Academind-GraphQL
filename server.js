const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

// body-parser middleware
app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  rootValue: graphQLResolvers,
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
  .catch(error => console.log("Error", error));
