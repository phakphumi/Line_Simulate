var socket;
function message(msg){
	$('#chatLog').append(msg+'</p>');
}
function sendBtn() {
    $('#send').on('click',function send(){
        var text = $('#text').val();
        socket.send(text);
        $('#text').val("");
    });
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
            message('<p class="event">Socket Status: '+socket.readyState+' (open)');
        }

        socket.onmessage = function(msg){
            console.log(msg.data);
            message('<p class="message">Received: '+msg.data);
        }

        socket.onclose = function(){
            console.log(socket.readyState+' (Closed)');
            message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');
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
