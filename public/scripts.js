
$(document).ready(function() {

    var connectionOptions = {
        host: 'irc.freenode.net',
        port: '6665',
        nick: 'RolfTest',
        realname: 'Rolf',
        ident: 'rolf'
    };

    var ownNickname = connectionOptions.nick;
    var connectedToServer = false;

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
            if(data.message) {
                consoleWindow.append("<li>" + data.message + "</li>");
                consoleWindow.scrollTop(consoleWindow[0].scrollHeight);
            }
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

        if(data.command) {
            switch(data.command) {
                case 'JOIN' :
                case 'PART' :
                    modifyUserList(data.cname, data.user, data.type);
                    break;
                case 'PRIVMSG' :
                    addMessageToTab(data.msg);
                    break;
                default :
                    break;
            }
        }

        if(data.channel) {
            var channel = data.channel.cname;
            var userList = $(channel).find('.users');
            data.channel.users.forEach(function(user) {
                userList.append('<li>' + user + '</li>');
            });
        }
    }

    function modifyUserList(channel, user, type) {
        type = type.substring(1); // Strip whitespace
        var list = $(channel + ' > .users');
        if(type === 'JOIN') {
            if(user !== ownNickname) {
                list.append('<li>'+user+'</li>');
            }
        }

        if(type === 'PART') {
            list.find('li:contains("'+user+'")').remove();
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
                    send.type = 'JOIN';
                    send.cmd = 'JOIN ' + result[2] + ' ' + (result[3] ? result[3] : '');
                    addChannelTab(result[2]);
                    break;
                case "/names" :
                    var channel = ActiveChannel();
                    send.cmd = 'NAMES ' + channel;
                    break;
                case "/leave" :
                    var channel = ActiveChannel();
                    if(channel != 'console') {
                        send.cmd = 'PART ' + channel;
                        removeChannelTab(channel);
                    }
                    break;
                case "/quit" :
                    var quitMessage = /\s.*/.exec(msg.toString()[0].substring(1));
                    send.type = 'QUIT';
                    send.cmd = 'QUIT' + (quitMessage ? quitmessage : '');
                    break;
                case "/nick" :
                    var newNick = /\s.*/.exec(msg.toString())[0].substring(1);
                    send.cmd = 'NICK ' + newNick;
                    console.log(send);
                    break;
                default: 
                    break;
            }
        } else {
            send.type = 'cmd';
            var activeChannel = ActiveChannel();
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

    function removeChannelTab(channel) {
        $('.nav-tabs')
            .children('li')
            .children('a:contains("'+channel+'")')
            .remove();
        $('.tab-content')
            .find(channel)
            .remove();
    }

    function addChannelTab(channel) {
        var tabs = $('.nav-tabs');
        var tabPanes = $('.tab-content');

        tabs.append('<li class=""><a href="'+channel+'" role="tab" data-toggle="tab">'+channel+'</a></li>'); 
        tabPanes.append('<div class="tab-pane" id="'+channel.substring(1)+'"> <ul class="messages user-list" id="'+channel+'-messages"></ul> <ul class="users"></ul>'); 
    }

    function ActiveChannel() {
        var activeChannel = $('.nav-tabs').find('.active').children('a').text();
        return activeChannel;
    }

    sendButton.click(function() {
        if(connectedToServer)
            send();
    });

    message.keyup(function(e) {
        if(e.keyCode == 13) {
            if(connectedToServer) {
                send();
            }
        }
    });
 
    connectButton.click(function() { 
        socket.send(JSON.stringify({
            type: 'cmd',
            cmd: 'connect',
            connection: connectionOptions
        }));
        // For now this is enough. Later we need to check if actually connected.
        connectedToServer = true;
    });

});
