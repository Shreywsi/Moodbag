import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Moodbag/',   
  server: {
    port: 5173,
    strictPort: true,
  }
})