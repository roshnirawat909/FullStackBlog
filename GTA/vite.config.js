import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({

  // proxy
  

  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/posts': 'http://localhost:8080'
    }
  },

  // react 
  // tailwindcss

    plugins: [react(), tailwindcss()],

  })


