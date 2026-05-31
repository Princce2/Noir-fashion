import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core':  ['three'],
          'r3f':         ['@react-three/fiber', '@react-three/drei'],
          'postprocess': ['@react-three/postprocessing', 'postprocessing'],
          'gsap':        ['gsap'],
          'motion':      ['framer-motion'],
        },
      },
    },
  },
})
