import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// API base URL
const API_URL = 'http://localhost:4000/api'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
const env = loadEnv(mode, process.cwd(), '')
  const isDevelopment = mode === 'development'
  
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
      'import.meta.env.VITE_APP_NAME': JSON.stringify('Hunger Hive'),
      // Provide process.env as a shim for libraries that use it
      'process.env': JSON.stringify(env)
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