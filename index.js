var http = require('http');
var nstatic = require('node-static');
//var EventParser = require('./lib/eventParser');

// Setup WebSocketServer
var WebSocketServer = require('ws').Server;
var ws = new WebSocketServer({
    port: 4001
});
// Hold a reference to the Socket for sending data later.
var socket = null;

// Setup IRC connection and connet
var IRCConnection = require('nirc-lib').Connection;
var con = new IRCConnection();

// NIRC-Lib events
con.on('connected', function(data) {
});

con.on('disconnect', function(data) {
    // When support for multi server we know 
    // which server is disconnected. Use that info to push to the client
    data.type = 'QUIT';
    socket.send(JSON.stringify(data));
});

con.on('data', function(data) {
    if(socket) {
        socket.send(JSON.stringify(data));    
    }
});

// WebSocket Events
ws.on('connection', function(ws) {
    socket = ws;
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if(data.cmd) {
            if(data.cmd === 'connect') {
                con.connect(data.connection);
                return;
            }

            console.log('SEND event to lib ' + data);
            console.log(data.cmd);
            con.emit('cmd', data);
        }
        console.log(data);
    });
});

// Server static assets (frontend app)
var publicFolder = new nstatic.Server('./dist');
http.createServer(function(request, response) {
    request.addListener('end', function() {
        publicFolder.serve(request, response);
    }).resume();
}).listen(4000);
