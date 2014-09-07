
$(document).ready(function() {

    var list = $("#messages");

    var socket = new WebSocket('ws://localhost:4001');
    socket.onopen = function(evt) {
        console.log('Connected to WebSocket');
    };

    socket.onmessage = function(event) {
        console.log(event);
        var data = JSON.parse(event.data);
        if (event.type === 'message') {
            
            list.append("<li>" + data.message.replace(/(\r\n|\n|\r)/gm, "<br>") + "</li>");
        }
    };

    var sendButton = $("#send-btn");
    var connectButton = $("#connect-btn");
    var message = $("#message");

    sendButton.click(function() {
        var msg = message.val();
        console.log(msg);
        if(msg === 'list') {
            socket.send(JSON.stringify({
                type: 'cmd',
                cmd: 'LIST'
            }));
        }
    });

    connectButton.click(function() {
        socket.send(JSON.stringify({
            type: 'cmd',
            cmd: 'connect'
        }));
    });

});
