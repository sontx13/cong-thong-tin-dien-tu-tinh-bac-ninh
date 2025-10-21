import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "./src",
  base: "",
  plugins: [react()],
  server: {
    host: true,
    port: 3003,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
