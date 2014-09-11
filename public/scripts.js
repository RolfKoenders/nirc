
$(document).ready(function() {

    var sendButton = $("#send-btn");
    var connectButton = $("#connect-btn");
    var message = $("#message");
    var consoleWindow = $("#console-messages");
    
    var socket = new WebSocket('ws://localhost:4001');
    socket.onopen = function(evt) {
        console.log('Connected to WebSocket');
    };

    socket.onmessage = function(event) {
        console.log(event);
        var data = JSON.parse(event.data);
        if (event.type === 'message') {
            // For now, always put everything in console window
            consoleWindow.append("<li>" + data.message + "</li>");
            consoleWindow.scrollTop(consoleWindow[0].scrollHeight);
            readMessage(event.data);
        }
    };

    function addMessageToTab(msg) { 
        var channel = $('ul[id="' + msg.channel + '-messages"]');
        channel.append("<li> &lt;" + msg.from + "&gt;: " + msg.message + "</li>");
        channel.scrollTop(channel[0].scrollHeight);
    }

    function readMessage(data) {
        var data = JSON.parse(data);
        if(data.command === 'PRIVMSG') {
            addMessageToTab(data.msg);
        }
    }

    function send() {
        var msg = message.val();
        console.log(msg);

        var test = /^\/\w+/.exec(msg.toString());
        var send = {};
        if(test) {
            send.type = 'cmd';
            switch(test[0]) {
                case "/list" :
                    send.cmd = 'LIST';
                    break;
                case "/join" :
                    var result = /(^\/\w+) (#.\w+)\s?(\w*)/.exec(msg.toString());
                    console.log(result);
                    send.cmd = 'JOIN ' + result[2] + ' ' + (result[3] ? result[3] : '');
                    addChannelTab(result[2]);
                    break;
                default: 
                    break;
            }
        } else {
            send.type = 'cmd';
            var activeChannel = $('.nav-tabs').find('.active').children('a').text();
            if(activeChannel != 'console') {
                send.cmd = 'PRIVMSG ' + activeChannel + ' :'+ msg;
                addMessageToTab({
                    channel: activeChannel,
                    from: 'RolfTest',
                    message: msg
                });
            }
        }

        socket.send(JSON.stringify(send));
        message.val('');
    }

    function addChannelTab(channel) {
        var tabs = $('.nav-tabs');
        var tabPanes = $('.tab-content');

        tabs.append('<li class=""><a href="'+channel+'" role="tab" data-toggle="tab">'+channel+'</a></li>'); 
        tabPanes.append('<div class="tab-pane" id="'+channel.substring(1)+'"> <ul class="messages" id="'+channel+'-messages"></ul>'); 
    }

    sendButton.click(function() {
        send();
    });

    message.keyup(function(e) {
        if(e.keyCode == 13) {
            send();
        }
    });
 
    connectButton.click(function() {
        socket.send(JSON.stringify({
            type: 'cmd',
            cmd: 'connect'
        }));
    });

});
