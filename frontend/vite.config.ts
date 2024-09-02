import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Set the out dir for build
    sourcemap: true  // Ensure source maps are generated
  },
  server: {
    host: '0.0.0.0', // same as true
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  /*
  server: {
    host: true, // This makes the server accessible externally
    port: 5173, // Optional: specify the port
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
  }
  */
})
