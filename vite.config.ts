import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy n8n webhooks and API during development
      "/n8n": {
        target: "http://localhost:5678",
        changeOrigin: true,
        // Strip the /n8n prefix so /n8n/webhook/... -> /webhook/...
        rewrite: (path) => path.replace(/^\/n8n/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
