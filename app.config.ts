import { defineConfig } from "@tanstack/start/config";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "node-server",
  },
  vite: {
    ...(process.env.NODE_ENV === "production" && {
      ssr: {
        noExternal: ["@mui/*"],
      },
    }),

    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      svgr(),
    ],
  },
});
