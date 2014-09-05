var http = require('http');
var nstatic = require('node-static');

// Setup WebSocketServer
var WebSocketServer = require('ws').Server;
var ws = new WebSocketServer({
    port: 4001
});
// Hold a reference to the Socket for sending data later.
var socket = null;

// Setup IRC connection and connet
var IRCConnection = require('nirc-lib').Connection;
var con = new IRCConnection({
    host: 'irc.freenode.net',
    port: '6665',
    nick: 'RolfTest',
    realname: 'Rolf',
    ident: 'rolf'
});
con.connect();

// NIRC-Lib events
con.on('connected', function(data) {
    console.log('Connected');
});

con.on('data', function(data) {
    if(socket) {
        socket.send(JSON.stringify({
            type: 'message',
            message: data.toString()
        }));
    }
});

// WebSocket Events
ws.on('connection', function(ws) {
    console.log('Client connected');
    socket = ws;
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        con.emit(data.text);
        console.log(data);
    });
});

// Server static assets (frontend app)
var publicFolder = new nstatic.Server('./public');
http.createServer(function(request, response) {
    request.addListener('end', function() {
        publicFolder.serve(request, response);
    }).resume();
}).listen(4000);

