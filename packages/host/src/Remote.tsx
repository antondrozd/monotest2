import { loadRemote } from "@module-federation/enhanced/runtime";
import { type ComponentType, lazy, Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  name: string;
  component?: string;
};

// needs to be enhanced and moved to the shared library
const ErrorMessage = () => (
  <div>
    <p>Something went wrong</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

const Remote = ({ name, component = "app" }: Props) => {
  const Component = useMemo(
    () =>
      lazy(async () => {
        try {
          const res = await loadRemote<{ default: ComponentType<unknown> }>(
            `${name}/${component}`
          );

          if (!res) {
            throw new Error("Failed to load remote");
          }

          return res;
        } catch (error) {
          console.error(error);
          return Promise.resolve({ default: ErrorMessage });
        }
      }),
    [name, component]
  );

  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Remote;
