var WebSocket = require('ws');
var express = require('express');
var app = express();

var ip = ["127.0.0.1", "127.0.0.1"];
var port = ["8081", "8082"];

var chosenIP = ip[0];
var chosenPort = port[0];

app.get('/online', function(req, res) {
    // res.send('About us');
    var onlineServer = {'ip': chosenIP, 'port': chosenPort};

    res.send(JSON.stringify(onlineServer));

});

app.listen(3030, function () {
    console.log('Express Server started on port ' + 3030 +'!');
});

function initWS(){

    var ws = new WebSocket('ws://'.concat(chosenIP).concat(':').concat(chosenPort));

    ws.on('error', function(err) {
        console.log('Waiting For Connection..');
        // setTimeout( poll, 1000);
    });

    ws.on('open', function() {

        console.log('Server on ' + chosenIP + ':' + chosenPort + ' is online');

    });

    ws.on('close', function() {

        console.log('Server was closed');

        // toggle server
        chosenIP = chosenIP === ip[0] ? ip[1] : ip[0];
        chosenPort = chosenPort === port[0] ? port[1] : port[0];

        setTimeout(initWS, 1000);

    });

}

initWS();
