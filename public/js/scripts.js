$(document).ready(function() {
  populateOnlineUsersList();
});

// Function that populates online users list on the right side of the app
function populateOnlineUsersList() {
  // Ajax request to fetch currently online users
  $.ajax({
    url: '/users',
    type: 'get',
    success: function (data) {
      $('#online-users-list').html("");
        $.each(data, function(id, user) {

          // Check if it's not current user
          if(socket.io.engine.id != user.id) {
            $('#online-users-list').append($('<li>').html($('<a href="javascript:;" class="username" data-id="'+user.id+'" id="1'+user.id+'">').text(user.username)));
          } else {
            $('#online-users-list').append($('<li>').html($('<span class="current-user">').text(user.username)));
          }

          // Atach click event on username click
          $('.username').click(function() {
              var username = $(this).text();
              var id = $(this).attr('data-id');

              // Check if tab is already opened
              if($('#main-content').find('#' + socket.io.engine.id+id).length < 1) {
                // Switch current tab with the new one
                switchTabs(username, socket.io.engine.id+id, id);
              }
          });
      });
    },
  });
}

// Function that checks if new message is on screen
function isOnScreen(element) {
  var curTop = element.offsetTop + 150;
  var screenHeight = $(window).scrollTop() + $(window).height();
  return (curTop > screenHeight) ? false : true;
}

// When focus on input clear unread messages
$('#message').focus(function() {
  seeMessages();
});

// When scrolling mark messages as read
$(document).scroll(function() {
  seeMessages();
});

// Function that marks new messages as read
function seeMessages() {
  var elems = $('.notseen');
  if(elems.length > 0) {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      $(elems).removeClass('notseen');
      $('title').text("Chat");
    } else {
      for (var i = 0; i < elems.length; i++) {
        if(isOnScreen(elems[i])) {
          $(elems[i]).removeClass('notseen');
          $('title').text("Chat (" + $('.notseent').length + ")");
        }
      }
    }
  }
}