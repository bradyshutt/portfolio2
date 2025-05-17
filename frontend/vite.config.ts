import { defineConfig } from 'vite';
import path from 'path';
// import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss()
  ],
  server: {
    proxy: {
     '/api': 'http://localhost:3002',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
})