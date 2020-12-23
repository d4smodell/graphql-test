import { useQuery, gql } from '@apollo/client';

const GET_CAR = gql`
  query GetPersons
  {
    getPersons {
      name
    }
  }
`;

function App() {
  const { name } = useQuery(GET_CAR)
  return (
    <div>
      {
        name ? console.log(name) : null
      }
    </div>
  );
}

export default App;