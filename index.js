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
var con = new IRCConnection({
    host: 'irc.freenode.net',
    port: '6665',
    nick: 'RolfTest',
    realname: 'Rolf',
    ident: 'rolf'
});

// NIRC-Lib events
con.on('connected', function(data) {
});

con.on('data', function(data) {
    data.type = 'message';
    if(socket) {
        socket.send(JSON.stringify(data));    
    }
});

// WebSocket Events
ws.on('connection', function(ws) {
    socket = ws;
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if(data.type === 'cmd') {
            if(data.cmd === 'connect') {
                con.connect();
                return;
            }

            console.log('SEND event to lib ' + data);
            console.log(data.cmd);
            con.emit('cmd', data.cmd);
        }
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
