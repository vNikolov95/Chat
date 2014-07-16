// Instantiate socket.io object
var socket = io();

// Handles login when sending a message
$('#messages-form').submit(function(){
  var message = $('#message').val();

  // Validate user input
  if(message.length && message.trim().length) {

    // Commands
    if(message.indexOf("/name") === 0) {
      if(!(message.split(" ")[1] === 'undefined')) {
        socket.emit('change nickname', message.split(" ")[1]);
        populateOnlineUsersList();
      }
    }

    // Send message if no command
    else {
      var id = $('.opened').attr('data-id');
      var chatId = $('.opened').attr('id');
      socket.emit('chat message', $('#message').val(), id, chatId);
    }

    // Clean the input
    $('#message').val('');
  }
  return false;
});

// User is typing logic TODO: Fix where to show 
var searchTimeout;
document.getElementById('message').onkeypress = function (e) {
    var keyCode = e.keyCode || e.which;
    var timeout = 1000 // 1s
    // If pressed key is not "ENTER"
    if (!(keyCode === 13)) {
      // Send notification that user is typing
      socket.emit('user is typing', $('#message').val());

      if (searchTimeout != undefined) clearTimeout(searchTimeout);

      // If user has not entered any key in specified time, send notification
      searchTimeout = setTimeout(function() {
        socket.emit('user is not typing', $('#message').val());
      }, timeout);
    }
};

// Receiving messages logic
socket.on('chat message', function(msg, username, color, id, chatId){
  // Check if there is already opened tab for the current chat
  if($('#main-content').find('#' + chatId).length < 1) {
    // Switch current tab with the new one
    switchTabs(username, chatId, id);
  }

  // If there is already opened tab for the current chat
  // Check if user is on current page
  if(!$('#message').is(":focus")) {
    $('#'+chatId).append($('<li class="notseen '+color+'">').text(username + ": " + msg));
    $('title').text("Chat (" + $('.notseen').length + ")");

  } else {
    $('#'+chatId).append($('<li class="'+color+'">').text(username + ": " + msg));
    $("html, body").animate({ scrollTop: $(document).height() }, 1);
  }

});

// Logic for new connection
socket.on('user connected', function(msg){
  $('#all-messages').append($('<li>').text(msg));
  populateOnlineUsersList();
});

// Logic for disconnection
socket.on('user disconnect', function(msg){
  populateOnlineUsersList();
});

// Name change logic
socket.on('name change', function() {
  populateOnlineUsersList();
});

// Show div when user is typing
socket.on('user is typing', function(msg) {
  $('#user-is-typing').show();
});

// Hide div when user is not typing
socket.on('user is not typing', function(msg) {
  $('#user-is-typing').hide();
});