console.log('test...');
const WebSocket = require('ws');
function initWS(address) {
        var ws = new WebSocket(address);
        ws.on('open',function() {
            console.log('connected to ',address);
        });
        ws.on('error',function() {
            // console.log('trying to ',address);
        });
        ws.on('close',function(){
            setTimeout(function() {
                ws = initWS(address);
            },1000,ws);
        });
        return ws;
    }
var ws = initWS("ws://localhost:8081");
