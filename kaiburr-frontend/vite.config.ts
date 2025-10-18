//import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react()],
//})
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins:[react()],
  server: {
    proxy: {
      '/tasks': 'http://localhost:8080'
    }
  }
});
