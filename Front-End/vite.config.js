import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import os from 'os'

// https://vite.dev/config/
// Move Vite's cache directory outside the OneDrive synced folder to avoid EPERM
// issues on Windows when OneDrive/AV locks transient dependency optimization dirs.
const cacheDir = path.join(os.tmpdir(), 'vite-skill-exchange-cache')

export default defineConfig({
  plugins: [react()],
  cacheDir,
  server: {
    host: true,
    port: 5173,
  },
})
