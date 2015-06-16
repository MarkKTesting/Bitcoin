/*
Add proxies for paths to the bitcoin webservices
Serve static local files
*/

var connect = require('connect');
var http = require('http');
var url = require('url');
var proxy = require('proxy-middleware');
var serveStatic = require('serve-static');

var app = connect();
app.use('/api', proxy(url.parse('http://blockexplorer.com/q')));
app.use('/api_alternate', proxy(url.parse('https://blockchain.info/')));
app.use('/raw_block', proxy(url.parse('https://blockchain.info/rawblock/')));

var serve = serveStatic('app', {'index': ['index.html', 'index.htm']});
// Serve up public/ftp folder
app.use(serve);

//create node.js http server and listen on port
http.createServer(app).listen(3000);