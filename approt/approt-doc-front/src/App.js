import {
  EVENTGROUPS_API_PATH,
  EVENTS_API_PATH,
  USERS_API_PATH,
  HEALTHCHECK_API_PATH,
} from './constants';

const App = () => {
  const pathArray = [
    { name: 'Event groups', link: EVENTGROUPS_API_PATH },
    { name: 'Events', link: EVENTS_API_PATH },
    { name: 'Users', link: USERS_API_PATH },
    { name: 'Health check', link: HEALTHCHECK_API_PATH },
  ];
  console.log(process.env);
  return (
    <div className="container">
      <header>
        <p>List of available paths</p>
      </header>
      <ul>
        {pathArray.map((path) => (
          <li key={path.link}>
            <a target="blank" href={path.link}>
              {path.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
