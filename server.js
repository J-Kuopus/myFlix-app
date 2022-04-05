const http = require('http'),
fs = require('fs'),
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

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n',
    (err) => {
      if (err) {
        console.log(err);
        } else {
          consonle.log('Added to log.');
        }
    });

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
  
    Response.writeHead(200, { 'Content-Type': 'text/html' });
    Response.write(data);
    Response.end();
  });
})
  .listen(8080);

console.log('My first Node test server is running on Port 8080.');
