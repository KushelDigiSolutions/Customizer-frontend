import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()], 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // explicit relative path
      '@context': path.resolve(__dirname, './app/context'), // shortcut if needed
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // ensures .jsx resolves automatically
  },
  publicDir: false, 
  define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': '{}', // fallback to avoid undefined
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'embed-widget.jsx'),
      name: 'EmbedWidget',
      fileName: 'bc-customiser-app',
      formats: ['umd'],
    },
    cssCodeSplit: true, //this line create style tag in head. if false create css file.
    outDir: 'public/bc-app',
    emptyOutDir: true,
    minify: false
  },
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './embed-widget.jsx',
  ],
  theme: {
    extend: {},
  },
})

