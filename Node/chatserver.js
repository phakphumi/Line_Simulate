var chat_server = function(webSocket_opt,allServer) {
    // var wss= new WebSocket.Server({ port: 8081 });
    const WebSocket = require('ws');
    // var WebSocket;
    var wss;
    var roomList = {
        room : {
            userList : {
                user : {
                    unreads : [0,1]
                },
            },
            chatsList : ['obj'],
        },
    }
    function pushArray(obj,target,data) {
        var location = 0;
        if( obj[target] == null)
            obj[target] = [];
        location = obj[target].push(data) - 1;
        return location;
    }
    function sendUnread(ws) {
        var user = ws.user;
        if((unreads = roomList[ws.room].userList[user].unreads )== null)
            return;
        roomList[ws.room].userList[user].unreads = [];
        var chatsList = roomList[ws.room].chatsList;
        console.log(user,' has unreads : number ',unreads);
        for (var i = 0; i < unreads.length; i++) {
            var data = chatsList[unreads[i]];
            if(data == null)
                continue;
            ws.sendSocket(data);
        }
    }
    function setup_broadcast(wss) {
        wss.broadcast = function broadcast(data,ws) {
            var room = 'room';
            if(ws != null) room = ws.room;

            function online() {
                var onlineList = [];
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.user != null) {
                        if(client.user != 'Guess' && client.room == room){
                            onlineList.push(client.user);
                            client.sendSocket(data);
                        }
                    }
                });
                return onlineList;
            }
            function offline(onlineList,chat_number) {
                var userList = roomList[room].userList;
                for(var user in userList) {
                    if(onlineList.indexOf(user)>=0)
                        continue;
                    pushArray(userList[user],'unreads',chat_number);
                }
            }

            var chat_number = pushArray(roomList[room],'chatsList',data);
            var onlineList = online();
            offline(onlineList,chat_number);
        };
    }
    function setup_prototype(WebSocket) {
        WebSocket.prototype.user = 'Guess';
        WebSocket.prototype.sendSocket = function(res) {
            var obj = {
                type : 'msg',
                user: 'Server',
                msg : '...',
                opt: '',
            };
            Object.assign(obj,res);
            this.send(JSON.stringify(obj));
        }
    }
    function start_server(webSocket_opt) {
        setup_prototype(WebSocket);
        setup_broadcast(wss = new WebSocket.Server(webSocket_opt));
        wss.on('connection', function connection(ws) {
            ws.sendSocket({msg:'Greeting :D',type:'log'});
            ws.on('message', function incoming(data) {
                data = JSON.parse(data);
                console.log(ws.user,' : ',data);
                var msg = data.msg;
                switch (data.type) {
                    case 'msg':
                        var user = ws.user;
                        wss.broadcast({msg:msg,user:user},ws);
                        break;
                    case 'user':
                        var user = ws.user = msg;
                        var room = ws.room = data.room == null ? 'room' : data.room;
                        if(roomList[ws.room].userList[user] == null)
                            roomList[ws.room].userList[user] = {};
                        console.log('-',user,'logged in to room ',ws.room);
                        ws.sendSocket({msg:msg,user:'You are ',type:'success'});
                        if(data.opt.newLogin == null || (data.opt.newLogin != null && data.opt.newLogin)){
                            wss.broadcast({msg:ws.user+' joined'});
                        }
                        sendUnread(ws);
                        break;
                    case 'debug':
                        console.log(groupList);
                        ws.sendSocket(groupList);
                    default:
                }
            });
            ws.on('close',function close() {
                if(ws.user == 'guess')
                    return;
                console.log(ws.user,'logged out');
                wss.broadcast({msg:ws.user+' logged out'});
            });
        });
        console.log('-------\n Server started','running at port : ',webSocket_opt.port,'\n-------');
    }
    start_server(webSocket_opt);

}
// chat_server({port:8081});
module.exports = chat_server;
