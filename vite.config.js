import { resolve } from "node:path";
import { defineConfig } from "vite";

const samplePages = [
  "index",
  "landscaping",
  "car-wash",
  "plumbing",
  "electrical",
  "hvac",
  "roofing",
  "painting",
  "cleaning",
  "auto-repair",
  "pest-control",
];

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        ...Object.fromEntries(
          samplePages.map((name) => [
            name === "index" ? "samples" : name,
            resolve(`samples/${name}.html`),
          ]),
        ),
      },
    },
  },
});
