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
    function initWS(address) {
        if(address in onlineServer)
            return;

        var ws = new WebSocket(address);
        ws.server = true;
        ws.on('open',function() {
            console.log('connected to',address);
            onlineServer[address] = ws;
            var obj = {type:'server',action:'connect',address:'ws://'+webSocket_opt.ip+':'+webSocket_opt.port};
            ws.send(JSON.stringify(obj));
        });
        ws.on('message',function(data) {
            initOnMessage(ws,data);
        });
        ws.on('error',function() {
            console.log('error on',address);
        });
        ws.on('close',function(){
            console.log('closed on',address);
            delete onlineServer[address];
        });
        return ws;
    }
    function connect_allServer() {
        for(var obj of allServer){
            var ip = obj.ip;
            var port = obj.port;
            if(port == webSocket_opt.port && ip == webSocket_opt.ip)
                continue;
            var str = 'ws://'+ip+':'+port;
            var ws = initWS(str);
        }
    }
    var onlineServer = {};
    connect_allServer();
    function sendToServer(path) {
        var val = eval(path) ;
        var out = {msg:{path:path,val:val},type:'server',action:'update'};
        out = JSON.stringify(out);
        console.log(out);
        for(var address in onlineServer){
            var ws = onlineServer[address];
            if(ws.readyState == WebSocket.OPEN){
                console.log('ws was sent');
                ws.send(out);
            }
        }
    }
    function setVal(obj,path,val) {
        path = path.replace(/\[/g,'.').replace(/\]/g,'');
        console.log(path);
        path = path.split('.');
        path.splice(0,1);
        for (i = 0; i < path.length - 1; i++) {
            if( obj[path[i]] == null){
                if(typeof(path[i]) == 'number')
                    obj[path[i]] = [];
                else
                    obj[path[i]] = {};
            }
            obj = obj[path[i]];
        }
        obj[path[i]] = val;

        console.log(path);
        if(path[path.length-2].indexOf('unreads')>-1){
            var user = path[2];
            console.log('unreads from another server to',user);
            wss.clients.forEach(function(ws) {
                if(ws.user == user){
                    console.log('found that person :D');
                    sendUnread(ws);
                }
            });
        }
    }
    function updateRoomList(path,val) {
        if(arguments.length == 1){
            sendToServer(path);
        }else{
            setVal(roomList,path,val);
        }
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
        var room = ws.room;
        if((unreads = roomList[room].userList[user].unreads )== null){
            console.log(unreads);
            return;
        }
        roomList[ws.room].userList[user].unreads = [];
        updateRoomList('roomList.'+room+'.userList.'+user+'.unreads');
        var chatsList = roomList[room].chatsList;
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
            var room =  'room';
            if(ws != null) room = ws.room ;
            console.log('bc ',data,'to ',room);
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
                    var unreadNo = pushArray(userList[user],'unreads',chat_number);
                    updateRoomList('roomList.'+room+'.userList.'+user+'.unreads['+unreadNo+']');
                }
            }

            var chat_number = pushArray(roomList[room],'chatsList',data);
            updateRoomList('roomList.'+room+'.chatsList['+chat_number+']');
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
    function initOnMessage(ws,data) {
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
                setVal(roomList,'roomList.'+room+'.userList.'+user,{});
                // if(roomList[room].userList[user] == null)
                //     createUser(user,room);
                ws.sendSocket({msg:msg,user:'You are ',type:'success'});
                sendUnread(ws);
                if(data.newLogin == null || (data.newLogin != null && data.newLogin)){
                    wss.broadcast({msg:user+' joined main room'},ws);
                }
                break;
            case 'room':
                console.log(ws.user,'now in',data.room);
                var user = ws.user;
                var room = ws.room = data.room;
                if(user=='Guess')
                    return;
                setVal(roomList,'roomList.'+room+'.userList.'+user,{});
                sendUnread(ws);
                wss.broadcast({msg:user+" joined room : '"+room+"'"},ws);
                break;
            case 'debug':
                // console.log(roomList);
                // ws.sendSocket({type:'debug',msg:{'onlineServer':onlineServer}});
                ws.sendSocket({type:'debug',msg:{'roomList':roomList}});
                break;
            case 'server':
                switch (data.action) {
                    case 'connect':
                        console.log('Server, show up at :',data.address);
                        ws.address = data.address;
                        ws.server = true;
                        // initWS(data.address);
                        onlineServer[data.address] = ws;
                        ws.sendSocket({type:'server',action:'patch',list:roomList});
                        break;
                    case 'update':
                        console.log('server update : ', msg.path,'val :',msg.val);
                        updateRoomList(msg.path,msg.val);
                        break;
                    case 'patch':
                        console.log('server patched : ', data.list);
                        roomList = data.list;
                        break;
                    default:

                }
                break;
            default:
        }
    }
    function start_server(webSocket_opt) {
        setup_prototype(WebSocket);
        setup_broadcast(wss = new WebSocket.Server(webSocket_opt));
        wss.on('connection', function connection(ws) {
            ws.sendSocket({msg:'Greeting :D',type:'log'});
            ws.on('message', function incoming(data) {
                initOnMessage(ws,data);
            });
            ws.on('close',function close() {
                if(ws.server){
                    console.log('Server ',ws.address,'was closed');
                    delete onlineServer[ws.address];
                }else if(ws.user == 'Guess'){
                    return;
                }else{
                    console.log(ws.user,'logged out');
                    wss.broadcast({msg:ws.user+' logged out'});
                }
            });
        });
        console.log('-------\n Server started','running at port : ',webSocket_opt.port,'\n-------');
    }
    start_server(webSocket_opt);

}
// chat_server({port:8081});
module.exports = chat_server;
