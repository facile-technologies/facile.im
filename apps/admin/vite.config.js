import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  // Pin the dev port so dashboard (5173) and admin (5174) never swap. See the
  // note in apps/dashboard/vite.config.js.
  server: { port: 5174, strictPort: true },
})
