const http = require('http');
const path = require('path');
const fs = require('fs');

// params
var dir = 'public';

// http server
const server = http.createServer((req, res) => {
    // Get filePath and fileName out of req.url, serving index.html if the url is empty
    filePath = path.join(__dirname, dir, req.url == '/' ? 'index.html' : req.url);

    // Get fileExt out of filePath
    fileExt = path.extname(filePath);
    
    // Setting default contentType to 'text/html'
    let contentType = 'text/html';

    // Setting contentType in accordance to filePath
    switch (fileExt) {
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

    // Adding .html to filePath if contentType is 'text/html' and fileExt is empty
    if (contentType == 'text/html' && fileExt == '') filePath += '.html';

    // Getting fileName out of filePath
    fileName = path.basename(filePath);

    // Serving files in accordance to fileExt and filePath
    fs.readFile(filePath, (err, content) => {
        process.stdout.write(`'${req.url}' | `)
        if(err) {
            if (err.code == 'ENOENT') {
                console.log(`(404) did not find '${fileName}' at ${filePath}`);
                res.write('404 not found');
                res.end();
            }
            else {
                console.log(`(500)`)
                res.write('err 500');
                res.end();
            }
        }
        else {
            console.log(`(202) served '${fileName}' at ${filePath}`);
            res.writeHead(200, {'content-type': contentType});
            res.end(content);
        }
    })
    
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running at port ${PORT}\n***************************`));
