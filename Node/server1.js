var allServer = [
    {ip: "127.0.0.1", port: "8081"},
    {ip: "127.0.0.1", port: "8082"}
];
require('./chatserver.js')({ip:"127.0.0.1",port:8081},allServer);
