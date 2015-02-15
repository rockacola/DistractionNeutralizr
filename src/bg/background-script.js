//-- Constants
var ACTIVE_OPACITY = 0.05; // TODO: Setting value
var FADING_SPEED = 100; // TODO: Setting value



//-- Hunt <img> & <iframe> tags on page
$('img, iframe').each(function() {
    //console.log('opacity of this elem:', $(this).css('opacity'));
    $(this).addClass('dn-img-active')
           .data('dn-default-opacity', $(this).css('opacity'))
           .css({ opacity: ACTIVE_OPACITY });
});

//-- Hunt <a> tags with background-image attribute on page
$('a').each(function() { //TODO: I want to query all elements
    if ($(this).css('background-image') != 'none') {
        //console.log('There is a background image:', $(this).css('background-image'));
        $(this).addClass('dn-img-active')
               .data('dn-default-opacity', $(this).css('opacity'))
               .css({ opacity: ACTIVE_OPACITY });
    }
});





//-- Event Binding
$('body').on('mouseenter', '.dn-img-active', function() {
    var defaultOpacity = ($(this).data('dn-default-opacity') != '') ? $(this).data('dn-default-opacity') : 1;
    //console.log('mouseenter! defaultOpacity:', defaultOpacity);
    $(this).fadeTo(FADING_SPEED, defaultOpacity);
});
$('body').on('mouseleave', '.dn-img-active', function() {
    //console.log('mouseleave!');
    $(this).fadeTo(FADING_SPEED, ACTIVE_OPACITY);
});
