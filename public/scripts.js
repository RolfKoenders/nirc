
$(document).ready(function() {

    var list = $("#messages");

    var socket = new WebSocket('ws://localhost:4001');
    socket.onopen = function(evt) {
        console.log('Connected to WebSocket');

        setTimeout(function() {
            socket.send(JSON.stringify({
                type: 'message',
                text: 'This is a sample message'
            }));
        }, 5000);
    };

    socket.onmessage = function(event) {
        console.log(event);
        var data = JSON.parse(event.data);
        if (event.type === 'message') {
            console.log(data.message);
            list.append("<li>" + data.message + "</li>");
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
                cmd: 'list'
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
