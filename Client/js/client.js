var socket;
var thisUser;
function message(msg){
    var chatLog = $('#chatLog');
    var bottom = false;
    if((chatLog[0].scrollHeight-chatLog[0].clientHeight) - chatLog.scrollTop() < 30)
        bottom = true;
    chatLog.append(msg+'</p>');
    if(bottom)
        chatLog.scrollTop(chatLog[0].scrollHeight);
}
function socketInput(Status) {
    if(Status)
        $('.input-socket,.input-btn').prop('disabled',false);
    else
        $('.input-socket,.input-btn').prop('disabled',true);
}
function sendSocket(msg,type,opt) {
    var type = arguments.length <= 1 ? 'msg' : type;
    var opt = arguments.length <= 2 ? '' : opt;
    var obj = {
        type : type,
        msg : msg,
        opt: opt
    };
    socket.send(JSON.stringify(obj));
}
function setupSocketInput() {
    var input = $('.input-socket');
    var input_group = input.parents('.input-group');
    var btn = input_group.find('.input-btn');
    var sendInput = function(input) {
        var text = input.val();
        var type = input.attr('data-type');
        input.val("");
        sendSocket(text,type);
    }
    btn.off('click.socket').on('click.socket',function(e){
        var input = $(this).parents('.input-group').find('.input-socket');
        sendInput(input);
    });
    input.off('keypress.socket').on('keypress.socket',function(e) {
        if(e.which == 13)
            sendInput($(this));
    });
}
function initAfterConn() {
    setupSocketInput();
}
function setUserName() {
    if(thisUser == null){
        iniUser();
        return;
    }
    sendSocket(thisUser,'user',{newLogin:false});
}
function connect(){
    try{
    	// var host = "ws://localhost:8081/";
    	var host = "ws://192.168.137.1:8081/";//192.168.43.39//192.168.137.1
        socket = new WebSocket(host);


        // message('<p class="event">Socket Status: '+socket.readyState);

        socket.onopen = function(){
            console.log(socket.readyState+' (open)');
            socketInput(true);
            $('.connecting').removeClass('connecting');
            $('#server').html('<p class="event"><span class="word-received">Socket Status:</span> Connected</p>');
            setUserName();
        }

        socket.onmessage = function(res){
            console.log(res.data);
            var res = JSON.parse(res.data);
            var user = res.user;
            var msg = res.msg;
            switch (res.type) {
                case 'msg':
                    if(user == thisUser)
                        user = 'You ('+thisUser+')';
                    message('<p class="message"><span class="word-received">'+user+' :</span> '+ msg );
                    break;
                case 'log':
                    console.log(msg);
                    break;
                case 'success':
                    $.each(BootstrapDialog.dialogs, function(id, dialog){
                        dialog.close();
                    });
                    if(thisUser == null){
                        thisUser = msg;
                        BootstrapDialog.show({
                            message:    '<h1> Hello, '+msg+' :D</h1>',
                        });
                    }

                default:
                    break;
            }
        }

        socket.onclose = function(){
            console.log(socket.readyState+' (Closed)');
            socketInput(false);
            if($('.connecting').length==0)
                $('#server').html('<p class="event connecting"><span class="word-received">Socket Status:</span> Connecting....</p>');
            setTimeout(connect(),1000);
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
function iniUser() {
    var newE = $('#input-template').find('.input-group').clone();
    newE.find('.input-socket').attr('data-type','user');
    BootstrapDialog.show({
        title: 'Enter your name',
        closeByKeyboard: true,
        message: function(){
            var dialog = $('<div class="row"></div>').html('<div class="col-sm-6 item"></div>');
            dialog.find('.item').html(newE);
            return dialog;
        },
        onshown : function(dialog) {
            setupSocketInput();
        }
    });
}
$(function() {
    // socketInput(false);
    // testGet();
    connect();
});
