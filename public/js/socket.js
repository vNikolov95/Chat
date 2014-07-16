var socket = io();
$('#messages-form').submit(function(){
  var message = $('#message').val();
  if(message.length && message.trim().length) {
    if(message.indexOf("/name") === 0) {
      if(!(message.split(" ")[1] === 'undefined')) {
        socket.emit('change nickname', message.split(" ")[1]);
        populateOnlineUsersList();
      }
    }
    else {
      var id = $('.opened').attr('data-id');
      var chatId = $('.opened').attr('id');
      socket.emit('chat message', $('#message').val(), id, chatId);
    }

    $('#message').val('');
  }
  return false;
});

var searchTimeout;
document.getElementById('message').onkeypress = function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13){

    } else {
      socket.emit('user is typing', $('#message').val());
      if (searchTimeout != undefined) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        socket.emit('user is not typing', $('#message').val());
      }, 1000);
    }
};

socket.on('chat message', function(msg, username, color, id, chatId){
  if($('#main-content').find('#' + chatId).length < 1) {
    $('#main-content').find('.selected').removeClass('selected');
    $('#main-content #tabs-header').append('<a href="javascript:;" class="open-tab selected" data-id="'+chatId+'">'+username+'<span class="close"></span></a>');
    $('#main-content').find('.opened').hide().removeClass('opened');
    $('#main-content').append('<ul class="messages opened" data-Id="'+id+'" id="'+chatId+'"></ul>').show();
    
    $('.close').click(function() {
      $('#main-content #tabs-header').children().first().addClass('selected');
      $('#main-content').find('#all').show().addClass('opened');
      $('#main-content').find('#'+id).remove();
      $(this).parent().remove();
    });

    $('.open-tab').click(function() {
        if(!($(this) === $('#main-content').find('.selected'))) {
          $('#main-content').find('.selected').removeClass('selected');
          $(this).addClass('selected');
          $('#main-content').find('.opened').hide().removeClass('opened');
          $('#' + $(this).attr('data-id')).addClass('opened').show();
        }
    });
  }

  if(!$('#message').is(":focus")) {
    $('#'+chatId).append($('<li class="notseen '+color+'">').text(username + ": " + msg));
    $('title').text("Chat (" + $('.notseen').length + ")");

  } else {
    $('#'+chatId).append($('<li class="'+color+'">').text(username + ": " + msg));
    $("html, body").animate({ scrollTop: $(document).height() }, 1);
  }

});

socket.on('user connected', function(msg){
  $('#all-messages').append($('<li>').text(msg));
  populateOnlineUsersList();
});

socket.on('user disconnect', function(msg){
  populateOnlineUsersList();
});

socket.on('my message', function(msg){
  $('#all-messages').append($('<li>').text("Private message: " + msg));
});

socket.on('name change', function() {
  populateOnlineUsersList();
});

socket.on('user is typing', function(msg) {
  $('#user-is-typing').show();
  //$("html, body").animate({ scrollTop: $(document).height() }, 1);
});

socket.on('user is not typing', function(msg) {
  $('#user-is-typing').hide();
  //$("html, body").animate({ scrollTop: $(document).height() }, 1);
});