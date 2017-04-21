const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

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
var roomList = {
    room : {
        userList : {
            user : {
                unread : [0,1]
            },
        },
        chatsList : ['obj'],
    },
}
function sendUnread(ws) {
    var user = ws.user;
    if((unreads = roomList[ws.room].userList[user].unread) != null){
        roomList[ws.room].userList[user].unread = [];
        console.log(unreads);
        for (var i = 0; i < unreads.length; i++) {
            ws.sendSocket(unreads[i]);
        }
    }
}
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
                var user = msg;
                ws.user = user;
                ws.room = 'room';
                if(roomList[ws.room].userList[user] == null)
                    roomList[ws.room].userList[user] = {};
                console.log(user,'logged in');
                ws.sendSocket({msg:msg,user:'You are ',type:'success'});
                if(data.opt.newLogin == null || (data.opt.newLogin != null && data.opt.newLogin)){
                    wss.broadcast({msg:ws.user+' joined'});
                }
                sendUnread(ws);
                break;
            case 'debug':
                console.log(userList);
                console.log(groupList);
            default:
        }
    });
    ws.on('close',function close() {
        console.log(ws.user,'logged out');
        wss.broadcast({msg:ws.user+' logged out'});
    });
});

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
    function offline(obj) {
        var onlineList = obj.onlineList;
        var userList = roomList[room].userList;
        Object.keys(userList).forEach(function(user) {
            if(onlineList.indexOf(user)>=0)
                return true;
            console.log(user);
            if(userList[user].unread == null)
                userList[user].unread = [data]
            else
                userList[user].unread.push(data);
        });
        // roomList[room].userList = userList;
        console.log('onlineList',onlineList);
        console.log('userList',userList);
    }

    var onlineList = online();
    offline({onlineList:onlineList});
};
