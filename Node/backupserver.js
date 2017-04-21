const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        ws.send('You : '+data);
        console.log(data);
        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
    ws.send('Hey You :D');
});

wss.broadcast = function broadcast(data) {
    console.log(data);
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
