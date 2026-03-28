import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative asset paths so the build works on both
  // GitHub project pages (/repo/) and custom domains (/).
  base: './',
})
