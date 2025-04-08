import { useGreeting } from "@mono/shared";

const App = () => {
  const greetingFromHost = useGreeting();

  return (
    <div className="content">
      <p>Greeting from host: {greetingFromHost}</p>
      
    </div>
  );
};

export default App;
