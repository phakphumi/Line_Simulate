var socket;
var thisUser= {};
function messageShow(msg){
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
function sendSocket(msg,type='msg',opt={}) {
    var obj = {
        type : type,
        msg : msg,
        room : thisUser.room,
    };
    Object.assign(obj,opt);
    socket.send(JSON.stringify(obj));
}
function setupSocketInput() {
    var input = $('.input-socket');
    var input_group = input.parents('.input-group');
    var btn = input_group.find('.input-btn');
    function sendInput(input) {
        console.log(input);
        var text = input.val();
        var type = input.attr('data-type');
        input.val("");
        if(type == 'room'){
            input.val(text);
            thisUser.room = text;
            $('.room-btn').dropdown('toggle');
            $('.room').html(text).css('textTransform','capitalize');
            $('#chatLog').html('');
        }
        sendSocket(text,type);
    }
    btn.off('click.socket').on('click.socket',function(e){
        var input = $(this).closest('.input-group').find('.input-socket');
        console.log(input);
        sendInput(input);
    });
    input.off('keypress.socket').on('keypress.socket',function(e) {
        if(e.which == 13)
            sendInput($(this));
    });
}
function login_to_sever() {
    if(thisUser.user == null){
        loginDialog();
        return;
    }
    sendSocket(thisUser.user,'user',{newLogin:false});
}
function debug(msg='') {
    socket.send(JSON.stringify({type:'debug',msg:msg}));
}
function connect(host){
    try{
    	// var host = "ws://localhost:8081/";
    	// var host = "ws://192.168.137.1:8081/";//192.168.43.39//192.168.137.1
    	var host = (host == null) ? "ws://192.168.43.39:8081/" : host;//192.168.43.39//192.168.137.1
        console.log(host);
        socket = new WebSocket(host);

        socket.onopen = function(){
            console.log(socket.readyState+' (open)');
            socketInput(true);
            $('.connecting').removeClass('connecting');
            $('#server').html('<p class="event"><span class="word-received">Socket Status:</span> Connected</p>');
            login_to_sever();
        }

        socket.onmessage = function(res){
            console.log(res.data);
            var res = JSON.parse(res.data);
            var user = res.user;
            var msg = res.msg;
            switch (res.type) {
                case 'msg':
                    if(user == thisUser.user)
                        user = 'You ('+thisUser.user+')';
                    messageShow('<p class="message"><span class="word-received">'+user+' :</span> '+ msg );
                    break;
                case 'log':
                    console.log(msg);
                    break;
                case 'debug':
                    console.log(msg);
                    break;
                case 'success':
                    $.each(BootstrapDialog.dialogs, function(id, dialog){
                        dialog.close();
                    });
                    if(thisUser.user == null){
                        thisUser.user = msg;
                        BootstrapDialog.show({
                            message:    '<div class="container-fluid greeting"><h1> Hello, '+thisUser.user+' :D</h1><p>Welcome to chatroom</p></div>',
                        });
                    }
                    $('.name').html(thisUser.user);

                default:
                    break;
            }
        }
        function get_newSocketIp() {
            $.get('http://localhost:3030/online',function(res) {
                res = JSON.parse(res);
                console.log(res);
                var ip = res.ip;
                var port = res.port;
                connect('ws://'+ip+':'+port+'/');
            });
        }
        socket.onclose = function(){
            console.log(socket.readyState+' (Closed)');
            socketInput(false);
            if($('.connecting').length==0)
                $('#server').html('<p class="event connecting"><span class="word-received">Socket Status:</span> Connecting....</p>');
            setTimeout(get_newSocketIp(),1000);
        }


    } catch(exception){
        console.log(exception);
        messageShow('<p>Error'+exception);
    }
}
function testGet() {
    $.get( "http://localhost:8081/test", function( data ) {
        console.log( data );
    });
}
function loginDialog() {
    var input_template = $('#input-template').children('.input-group').clone();
    input_template.find('.input-socket[data-type="msg"]').attr('data-type','user').attr('placeholder','Your name...');
    var dialog = $('<div class="container-fluid login-group"></div>').html('<div class="row"><div class="col-sm-12 item"></div></div>');
    dialog.find('.item').html(input_template);
    BootstrapDialog.show({
        title: 'Enter your name',
        closable: false,
        size: BootstrapDialog.SMALL,
        message: dialog,
        onshown : function(dialog) {
            setupSocketInput();
        }
    });
}
$(function() {
    connect();
});
