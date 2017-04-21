function message(msg){
	$('#chatLog').append(msg+'</p>');
}
function connect(){
    try{

	var socket;
	var host = "ws://localhost:8081/";
    var socket = new WebSocket(host);

        message('<p class="event">Socket Status: '+socket.readyState);

        socket.onopen = function(){
       		 message('<p class="event">Socket Status: '+socket.readyState+' (open)');
        }

        socket.onmessage = function(msg){
       		 message('<p class="message">Received: '+msg.data);
        }

        socket.onclose = function(){
       		 message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');
        }

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
