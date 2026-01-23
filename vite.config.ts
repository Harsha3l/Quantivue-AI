import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // ✅ FRONTEND runs on 5173
    proxy: {
      // ✅ Backend Auth APIs
      "/auth": {
        target: "http://localhost:8000", // Backend
        changeOrigin: true,
        secure: false,
      },

      // ✅ Backend Admin APIs
      "/admin": {
        target: "http://localhost:8000", // Backend
        changeOrigin: true,
        secure: false,
      },

      // ✅ Health check API
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
