import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
const __dirname = resolve();

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// copy objects from public to dist

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [
    viteStaticCopy({
      targets: [
        { src: resolve(__dirname, 'public'), dest: outDir }
      ]

    }),
  ],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        //debug: resolve(root, 'debug/index.html'),
        editor: resolve(root, 'editor/index.html'),
      }
    }
  }
})