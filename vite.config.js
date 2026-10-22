import { resolve } from "node:path";
import { defineConfig } from "vite";

function redirectAtlanticManor() {
  const redirect = (req, res, next) => {
    const path = req.url?.split("?")[0];
    if (path === "/atlanticmanor") {
      const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      res.statusCode = 302;
      res.setHeader("Location", `/atlanticmanor/${query}`);
      res.end();
      return;
    }
    next();
  };

  return {
    name: "atlantic-manor-slash",
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

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
  plugins: [redirectAtlanticManor()],
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
        areas: resolve("areas/index.html"),
        atlanticmanor: resolve("atlanticmanor/index.html"),
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
