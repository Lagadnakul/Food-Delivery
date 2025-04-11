import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'
import process from 'node:process'  // Import from node:process instead of Vite

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd())
  const isDevelopment = mode === 'development'
  
  // Default API URL (development)
  const API_URL = env.VITE_API_URL || 'http://localhost:4000/api'
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      open: true,
      cors: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      // Make API URL accessible in components via import.meta.env
      'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
      'import.meta.env.VITE_APP_NAME': JSON.stringify('Hunger Hive')
    },
    build: {
      outDir: 'dist',
      sourcemap: isDevelopment,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDevelopment
        }
      }
    }
  }
})