function populateOnlineUsersList() {
  $.ajax({
    url: '/users',
    type: 'get',
    success: function (data) {
      $('#online-users-list').html("");
        $.each(data, function(id, user) {
          if(socket.io.engine.id != user.id) {
            $('#online-users-list').append($('<li>').html($('<a href="javascript:;" class="username" data-id="'+user.id+'" id="1'+user.id+'">').text(user.username)));
          } else {
            $('#online-users-list').append($('<li>').html($('<span class="current-user">').text(user.username)));
          }

          $('.username').click(function() {
              var username = $(this).text();
              var id = $(this).attr('data-id');
              if($('#main-content').find('#' + socket.io.engine.id+id).length < 1) {
                $('#main-content').find('.selected').removeClass('selected');
                $('#main-content #tabs-header').append('<a href="javascript:;" class="open-tab selected" data-id="'+socket.io.engine.id+id+'">'+username+'<span class="close"></span></a>');
                $('#main-content').find('.opened').hide().removeClass('opened');
                $('#main-content').append('<ul class="messages opened" data-id="'+id+'" id="'+socket.io.engine.id+id+'"></ul>');
                
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
          });
      });
    },
  });
}

$(document).ready(function() {
  $('.close').click(function() {
    alert(123);
  });
});

function isOnScreen(element) {
    var curTop = element.offsetTop + 150;
    var screenHeight = $(window).scrollTop() + $(window).height();
    return (curTop > screenHeight) ? false : true;
}

$('#message').focus(function() {
  seeMessages();
});

$(document).scroll(function() {
  seeMessages();
});

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

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}