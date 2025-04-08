import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

import { dependencies as rootDeps } from "../../../package.json";
import { version as sharedPkgVersion } from "../../shared/package.json";

const PORT = 1112;

export default defineConfig({
  server: {
    port: PORT,
  },
  dev: {
    assetPrefix: `http://localhost:${PORT}`,
    client: {
      port: PORT,
    },
  },
  output: {
    assetPrefix: `http://localhost:${PORT}`,
  },
  source: {
    alias: {
      "@": "./src",
    },
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output!.uniqueName = "app2";

      appendPlugins([
        new ModuleFederationPlugin({
          name: "app2",
          exposes: {
            "./app": "./src/App.tsx",
          },
          filename: "remoteEntry.js",
          dts: false,
          shared: [
            {
              react: {
                requiredVersion: rootDeps["react"],
                singleton: true,
              },
            },
            {
              "react-dom": {
                requiredVersion: rootDeps["react-dom"],
                singleton: true,
              },
            },
            {
              "@mono/shared": {
                requiredVersion: "*",
                singleton: true,
              },
            },
          ],
        }),
      ]);
    },
  },
  plugins: [pluginReact()],
});
