import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, createReadStream, cpSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, extname, relative, resolve } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const guiSourceDir = resolve(projectRoot, 'src/gui')
const guiBuildDir = resolve(projectRoot, 'dist/gui')

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
}

function guiStaticPlugin() {
  return {
    name: 'portfolio-gui-static',
    configureServer(server) {
      server.middlewares.use('/gui', (req, res, next) => {
        const requestPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
        const fileName = requestPath.replace(/^\/gui\/?/, '').replace(/^\/+/, '') || 'portfolio.html'
        const filePath = resolve(guiSourceDir, fileName)
        const relativePath = relative(guiSourceDir, filePath)

        if (relativePath.startsWith('..') || relativePath === '' || !existsSync(filePath)) {
          next()
          return
        }

        res.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream')
        createReadStream(filePath).pipe(res)
      })
    },
    closeBundle() {
      cpSync(guiSourceDir, guiBuildDir, { recursive: true })
      copyFileSync(resolve(guiSourceDir, 'portfolio.html'), resolve(guiBuildDir, 'index.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    guiStaticPlugin(),
  ],
})
