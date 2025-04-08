import { GreetingProvider } from "@mono/shared";
import { useEffect, useState } from "react";
import Remote from "./Remote";
import { init } from "@module-federation/enhanced/runtime";

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!isInitialized) {
      setTimeout(() => {
        fetch("remotes-config.json")
          .then((r) => r.json())
          .then(({ remotes }) => {
            init({
              name: "host",
              remotes,
            });
            setIsInitialized(true);
          });
      }, 3000);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <GreetingProvider greeting={greeting}>
      <div className="content">
        <input
          type="text"
          onChange={(e) => {
            setGreeting(e.target.value);
          }}
        />
        <Remote name="app1" />
        <Remote name="app2" />
      </div>
    </GreetingProvider>
  );
};

export default App;
