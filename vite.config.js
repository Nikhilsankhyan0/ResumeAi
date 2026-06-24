import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,          // preferred port
    strictPort: false,   // auto-increment to 5174 if 5173 is busy — proxy still works
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react","react-dom","react-router-dom"],
          redux:  ["@reduxjs/toolkit","react-redux"],
          motion: ["framer-motion"],
          icons:  ["lucide-react"],
        },
      },
    },
  },
});
