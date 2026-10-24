import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src-elem * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline'; font-src * data:; img-src * data: blob:; connect-src * ws: wss:;",
    },
  },
})
