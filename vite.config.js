import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Framework und Icons getrennt ausliefern: ändern sich selten,
        // bleiben so im Browser-Cache, auch wenn die App aktualisiert wird
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          return id.includes('lucide-react') ? 'icons' : 'vendor'
        },
      },
    },
  },
})
