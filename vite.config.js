import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/Kulture-New/', 
  server: {
    proxy: {
      '/api': {
        target: 'http://72.62.199.223',
        changeOrigin: true,
      },
      '/files': {
        target: 'http://72.62.199.223',
        changeOrigin: true,
      },
    },
  },
})