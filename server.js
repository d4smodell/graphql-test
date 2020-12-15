const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('./database.json')

const getPersonDisplay = person => {
  const car = db.cars.find(c => c.Id === person.carId);
  return Object.assign({}, person, { car: car ? `${car.marka}, ${car.model}` : '' });
}

const schema = buildSchema(`
  type Person {
      name: String!,
      age: Int!,
      origin: String!,
      city: String!,
      car: String
  }

  type Query {
    hello: String,
    from1toN(N: Int!): [Int],
    fromNto1(N: Int!): [Int],

    getPersons: [Person],
    getCars: [String],
    getRandomPerson: Person,
    getPersonByName(name: String!): [Person],
    getPersonByCar(marka: String!): [Person]
  }

  input PersonInput {
    name: String!,
    age: Int!,
    origin: String!,
    city: String!,
  }

  type Mutation {
    addPerson(input: PersonInput): Int,
    addCar(marka: String!, model: String!): Int,
    setCarForPerson(personName: String!, carId: Int!): Person
  }
`);

const root = {
    hello: () => 'Hello world!',
    
    from1toN: ({N}) => Array.from(Array(N).keys()),
    fromNto1: ({N}) => Array.from(Array(N).keys()).reverse(),

    getPersons: () => db.persons.map(getPersonDisplay),
    getCars: () => db.cars.map(c => `${c.Id}, ${c.marka}, ${c.model}`),
    getRandomPerson: () => {
      var personIndex = Math.floor(Math.random() * db.persons.length);
      return getPersonDisplay(db.persons.find((_, index) => index === personIndex))
    },
    getPersonByName: ({name}) => db.persons.filter(p => p.name === name).map(getPersonDisplay),
    getPersonByCar: ({marka}) => db.persons.filter(p => db.cars.filter(c => c.marka === marka).map(c => c.Id).some(id => id === p.carId)).map(getPersonDisplay),
    addPerson: ({input}) => {
      db.persons.push(input);
      return db.persons.length;
    },
    addCar: ({marka, model}) => {
      const newCar = {
        Id: db.cars.length + 1,
        marka: marka,
        model: model
      }

      db.cars.push(newCar);
      return newCar.Id;
    },
    setCarForPerson: ({personName, carId}) => {
      const person = db.persons.find(p => p.name === personName);
      const car = db.cars.find(c => c.Id === carId);

      if (!person || !car)
        return null;
      
      person.carId = carId;
        return getPersonDisplay(person);
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/front/index.html');
});

app.get('/app', function(req, res){
  res.sendFile(__dirname + '/front/app.html');
});

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
