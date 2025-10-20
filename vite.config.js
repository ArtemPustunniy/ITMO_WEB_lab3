import { defineConfig } from 'vite'

export default defineConfig({
  // Set base for GitHub Pages when building in CI. Locally it's '/'.
  base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/',
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
