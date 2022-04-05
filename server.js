const http = require('http'),
url = require('url');

http
  .createServer((request, reponse) => {
    let addr = request.url,
    q = url.parse(addr, true),
    filePath _ '';

    if (q.pathname.includes('documenation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    Response.writeHead(200, { 'Content-Type': 'text/plain' });
    Response.end('Hello Node!\n');
  })
  .listen(8080);

console.log('My first Node test server is running on Port 8080.');
