import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Dashboard is served under /app in production (nginx). '/' locally still works.
  base: '/app/',
  // Pin the dev port so it's deterministic (5173 dashboard / 5174 admin). Without
  // strictPort, Vite silently shifts to the next free port and the two apps swap,
  // breaking cross-app links (e.g. the landing "Log in" -> /app/login).
  server: { port: 5173, strictPort: true },
  plugins: [react(),
     tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
