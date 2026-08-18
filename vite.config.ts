import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Deployed as a GitHub Pages *project* page at
  // https://varshapv22.github.io/personal-portfolio/ — every built asset URL
  // needs this prefix or it 404s against the domain root.
  base: '/personal-portfolio/',
  plugins: [react()],
})
