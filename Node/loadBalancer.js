var WebSocket = require('ws');

function initWS(port){
    console.log(port);
    var ws = port === 8081 ? new WebSocket('ws://localhost:8081') 
                            : new WebSocket('ws://localhost:8082'); 

    ws.on('error', function(err) {
        console.log('Waiting For Connection..');
        // setTimeout( poll, 1000);
    });

    ws.on('open', function() {

        console.log('Server on port' + port + 'started');    

    });

    ws.on('close', function() {

        if(port === 8081) {

            port = 8082;

        } else {

            port = 8081;

        }
        console.log('Server was closed');
        setTimeout(initWS, 1000, port);

    });

}

initWS(8081);
// ws.on('close', function() {

//     if(port === 8081) {

//         port = 8082;
//         console.log(port);

//     } else {

//         port = 8081;
//         console.log(port);

//     }

//     console.log('Waiting For Connection..');

//     // setTimeout(poll, 1000);

// })


// // var poll = function( ) {

// //     if(port === 8081) {

// //         ws = new WebSocket('ws://localhost:8082');
// //         port = 8082;

// //     } else {

// //         ws = new WebSocket('ws://localhost:8081');
// //         port = 8081;

// //     }

// //     ws.on('open', function() {

// //         if(port === 8081) {

// //             console.log('Server on port 8081 started');

// //         } else {

// //             console.log('Server on port 8082 started');

// //         }
        
// //     });

// //     ws.on('message', function(message) {
// //         console.log(message);
// //     });

// //     ws.on('error', function(err) {
// //         // Check error code? Maybe put it in close event?
// //         // setTimeout( poll, 1000);
// //         console.log('Waiting For Connection..');
// //     });

// //     ws.on('close', function() {
// //         console.log("inclose");
// //     });
// }