const http = require('http');

http
  .createServer((request, reponse) => {
    Response.writeHead(200, { 'Content-Type': 'text/plain' });
    Response.end('Hello Node!\n');
  })
  .listen(8080);

console.log('My first Node test server is running on Port 8080.');
