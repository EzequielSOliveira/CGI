const HTTP = require('http');
const FILESYSTEM = require('fs');

const PATH_ROOT = __dirname;
const HOST = 'localhost';
const PORT = 80;

HTTP.createServer(function (request, response) {
    console.log('METHOD: ' + request.method + '; IP: ' + request.socket.remoteAddress + '; SIZE: ' + request.socket.bytesRead + '; URL: ' + request.url + '; REFERER: ' + request.headers.referer);

    let servicePath = PATH_ROOT + '/service' + request.url + '.js';

    FILESYSTEM.access(servicePath, FILESYSTEM.F_OK, (error) => {
        if (error) {
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end();
        } else {
            response.writeHead(200, {'Content-Type': 'application/json'});
            delete require.cache[require.resolve(servicePath)];
            response.write(JSON.stringify(require(servicePath)));
            response.end();
        }
    });


}).listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
