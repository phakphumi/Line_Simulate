var socket;
function message(msg){
	$('#chatLog').append(msg+'</p>');
}
function sendBtn() {
    var send = function() {
        var text = $('#text').val();
        socket.send(text);
        $('#text').val("");
    }
    $('#send').on('click',function send(){
        send();
    });
    $('#text').keypress(function(e) {
        if(e.which == 13){
            send();
        }
    })
}
function initAfterConn() {
    sendBtn();
}
function connect(){
    try{
	var host = "ws://localhost:8081/";
	// var host = "ws://192.168.43.245:8081/";//192.168.43.39
    socket = new WebSocket(host);

        message('<p class="event">Socket Status: '+socket.readyState);

        socket.onopen = function(){
            console.log(socket.readyState+' (open)');
            message('<p class="event"><span class="word-received">Socket Status:</span> '+socket.readyState+' (open)');
        }

        socket.onmessage = function(msg){
            console.log(msg.data);
            message('<p class="message"><span class="word-received">Received:</span> '+msg.data);
        }

        socket.onclose = function(){
            console.log(socket.readyState+' (Closed)');
            message('<p class="event"><span class="word-received">Socket Status:</span> '+socket.readyState+' (Closed)');
        }

        initAfterConn();

    } catch(exception){
   		 message('<p>Error'+exception);
    }
}
function testGet() {
    $.get( "http://localhost:8081/test", function( data ) {
        console.log( data );
    });
}

$(function() {
    // testGet();
    connect();
});
