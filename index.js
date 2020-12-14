var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const db = require('./database.json')

var schema = buildSchema(`
  type Person {
      name: String!,
      age: Int!,
      origin: String!,
      city: String!,
      car: String
  }

  type Query {
    hello: String,
    persons: [Person],
    from1toN(N: Int!): [Int],
    fromNto1(N: Int!): [Int],
    getPersonByName(name: String!): [Person],
    getPersonByCar(marka: String!): [Person]
  }
`);

var root = {
    hello: () => 'Hello world!',
    persons: () => db.persons.map(getPersonDisplay),
    from1toN: ({N}) => Array.from(Array(N).keys()),
    fromNto1: ({N}) => Array.from(Array(N).keys()).reverse(),
    getPersonByName: ({name}) => db.persons.filter(p => p.name === name).map(getPersonDisplay),
    getPersonByCar: ({marka}) => db.persons.filter(p => db.cars.filter(c => c.marka === marka).map(c => c.Id).some(id => id === p.carId)).map(getPersonDisplay),
};

function getPersonDisplay(person) {
  const car = db.cars.find(c => c.Id === person.carId);
  return Object.assign({}, person, { car: car ? `${car.marka}, ${car.model}` : '' });
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
