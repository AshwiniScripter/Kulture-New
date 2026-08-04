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
        target: 'https://erp.kulturevintage.com',
        changeOrigin: true,
      },
      '/files': {
        target: 'https://erp.kulturevintage.com',
        changeOrigin: true,
      },
    },
  },
})