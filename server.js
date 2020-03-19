// This file is for HTTPS used locally.
const { createServer } = require('https')
const { parse } = require('url')
const { readFileSync } = require('fs')
const next = require('next')

const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// I've created these from the tute that I've linked in
const httpsOptions = {
  key: readFileSync('./certificates/server.key'),
  cert: readFileSync('./certificates/server.crt')
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on https://localhost:${port}`)
  })
})
