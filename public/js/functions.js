// A function that hides the current tab and opens new
function switchTabs(tabTitle, tabId, currSocketId) {
	// Hides current tab header and opens another
	$('#main-content').find('.selected').removeClass('selected');
    $('#main-content #tabs-header').append('<a href="javascript:;" class="open-tab selected" data-id="'+tabId+'">'+tabTitle+'<span class="close"></span></a>');
    
    // Hides current tab and opens new
    $('#main-content').find('.opened').hide().removeClass('opened');
    $('#main-content').append('<ul class="messages opened" data-Id="'+currSocketId+'" id="'+tabId+'"></ul>').show();
    
    // Attach click event ot close tab button
    $('.close').click(function() {
      $('#main-content #tabs-header').children().first().addClass('selected');
      $('#main-content').find('#all').show().addClass('opened');
      $('#main-content').find('#'+currSocketId).remove();
      $(this).parent().remove();
    });

    // Attach click event on open tab button
    $('.open-tab').click(function() {
        if(!($(this) === $('#main-content').find('.selected'))) {
          $('#main-content').find('.selected').removeClass('selected');
          $(this).addClass('selected');
          $('#main-content').find('.opened').hide().removeClass('opened');
          $('#' + $(this).attr('data-id')).addClass('opened').show();
        }
    });
}