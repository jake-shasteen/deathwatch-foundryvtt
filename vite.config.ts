import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: "terser",
    lib: {
      entry: "src/main.ts",
      name: "app",
      formats: ["es"],
      fileName: "main",
    },
    watch: { buildDelay: 3000 },
  },
});
