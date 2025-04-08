import { createContext, ReactNode, useContext } from "react";

const GreetingContext = createContext<string>("");

type Props = {
  greeting: string;
  children: ReactNode;
};

export const GreetingProvider = ({ greeting, children }: Props) => {
  return (
    <GreetingContext.Provider value={greeting}>
      {children}
    </GreetingContext.Provider>
  );
};

export const useGreeting = () => useContext(GreetingContext);
