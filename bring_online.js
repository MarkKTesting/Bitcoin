
var bitcoinService = require("./service.js");

var connect = require('connect');
var http = require('http');
var url = require('url');
var proxy = require('proxy-middleware');
var serveStatic = require('serve-static');

var app = connect();
app.use('/api', proxy(url.parse('http://blockexplorer.com/q')));
app.use('/api_alternate', proxy(url.parse('https://blockchain.info/')));
app.use('/raw_block', proxy(url.parse('https://blockchain.info/rawblock/')));
app.use('/tree', proxy(url.parse('https://blockchain.info/tree/')));

app.use(function (req, res, next)
    {
        //Receive POSTs to calchash
        if (req.method == 'POST' && req.url === "/calchash" ) {
            var body = '';

            //Accept a JSON string
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                //Report success
                res.writeHead(200, {'Content-Type': 'text/plain'});
                //Write out our result
                res.end("Calculated hash = " + bitcoinService.calcHash(body));
            });
        }
        else
        {
            next();
        }
    });

var serve = serveStatic('app', {'index': ['index.html', 'index.htm']});
// Serve up public/ftp folder
app.use(serve);

//create node.js http server and listen on port
http.createServer(app).listen(3000);

