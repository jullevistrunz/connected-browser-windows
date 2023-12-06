const http = require('http')
const fs = require('fs')
const url = require('url')
const port = 8080

const server = http.createServer(function (req, res) {
  const path = url.parse(req.url, true).pathname
  if (path == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(fs.readFileSync('index.html'))
    res.end()
  } else if (path == '/script') {
    res.writeHead(200, { 'Content-Type': 'text/js' })
    res.write(fs.readFileSync('script.js'))
    res.end()
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(port, function () {
  console.info(`Listening on http://localhost:${port}`)
})
