import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        catalog: 'catalog.html',
        blog: 'blog.html',
        about: 'about.html'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
