import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { checkAdminPassword } from './api/_auth.js'

// Vite plugin to handle /api/save-atlas and /api/get-atlas in local dev
function localSaveAtlasPlugin(adminPassword) {
  return {
    name: 'local-save-atlas-plugin',
    configureServer(server) {
      server.middlewares.use('/api/get-atlas', (req, res) => {
        try {
          const filePath = path.join(process.cwd(), 'public', 'data', 'atlas.json')
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-store')
            res.end(fileData)
            return
          }
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Not found' }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      server.middlewares.use('/api/verify-admin', (req, res) => {
        let body = ''
        req.on('data', chunk => {
          body += chunk
        })
        req.on('end', () => {
          let password
          try {
            password = JSON.parse(body || '{}').password
          } catch (e) {}
          const auth = checkAdminPassword(password, adminPassword)
          res.statusCode = auth.ok ? 200 : auth.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(auth.ok ? { success: true } : { error: auth.error }))
        })
      })

      server.middlewares.use('/api/save-atlas', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { data, adminPassword: candidate } = JSON.parse(body)
              const auth = checkAdminPassword(candidate, adminPassword)
              if (!auth.ok) {
                res.statusCode = auth.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: auth.error }))
                return
              }
              if (!data || !data.opere) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Dati mancanti o non validi' }))
                return
              }
              const filePath = path.join(process.cwd(), 'public', 'data', 'atlas.json')
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  mode: 'local_disk',
                  message: `File public/data/atlas.json salvato con successo su disco (${data.opere.length} opere)!`,
                })
              )
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localSaveAtlasPlugin(loadEnv(mode, process.cwd(), '').ADMIN_PASSWORD)],
  server: {
    port: 3000,
    host: true
  }
}))
