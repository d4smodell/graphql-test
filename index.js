var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Person {
      name: String,
      age: Int,
      origin: String
  }

  type Query {
    hello: String,
    persons: [Person]
  }
`);
 
var root = {
    hello: () => 'Hello world!',
    persons: () => {
        return [
            { name: 'Max', age: 36, origin: 'Russian' },
            { name: 'Andrew', age: 33, origin: 'Russian' },
        ]
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));