const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

// Params
var hostname = 'localhost';
var pagesdir = 'public';

// Server
const server = http.createServer((req, res) => {
    // Get filePath
    filePath = path.join(__dirname, pagesdir, req.url == '/' ? 'index.html' : url.parse(req.url).pathname);
    
    // Serving index.html if req.url is empty

    // Get fileExt
    fileExt = path.extname(filePath);

    // Set contentType according to fileExt
    contentType = 'text/html';
    switch (fileExt) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    // Set .html extension if contentType is 'text/html' and fileExt is empty
    if (contentType === 'text/html' && fileExt === '') filePath += '.html';

    // Reading file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Error message
                console.log(`[404] ${path.basename(filePath)} not found`);

                // 404 page
                res.writeHead(404, {'content-type': 'text/html'});
                res.write('err 404 not found');
                res.end();
            }
            else {
                // Error message
                console.log(`[500] server error`);

                // 500 page
                res.writeHead(500, {'content-type': 'text/html'});
                res.write('err 500 server error');
                res.end();
            }
        }
        else {
            switch (req.method) {
                case 'GET':
                    // Success message
                    console.log(`[200] ${path.basename(filePath)} served, ${contentType}`);

                    // Serving content
                    res.writeHead(200, {'content-type': contentType});
                    res.end(content, 'utf8');

                    // Getting query string parameters
                    let query = qs.parse(req.url, true).query;
                    break;
                
                case 'POST':
                    // Initializing body
                    let body = '';

                    // req listeners
                    req.on('data', (data) => {
                        body += data;
                    })
                    req.on('end', () => {
                        console.log('body: ' + body);
                    })

                    // Getting post data
                    let json = qs.parse(body);
                    console.log('json: ' + json);

                case 'PUT':
                    // TODO
                    break;
                
                case 'DELETE':
                    // TODO
                    break;
            }
        }
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, hostname, () => console.log(`Server running at ${PORT}...`));
