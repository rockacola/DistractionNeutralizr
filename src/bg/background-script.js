//-- Constants
var ACTIVE_OPACITY = 0.05; // TODO: Setting value
var FADING_SPEED = 100; // TODO: Setting value
var BG_IMAGE_MAX_WIDTH = 300;
var BG_IMAGE_MAX_HEIGHT = 300;
//var verbose = true; //TODO: Setting to enable console print
//var hoverOnDelay = 500; //TODO: Setting for delaying display of hover on on concealed elements (in ms)

//-- Seeks <img> & <iframe> tags on page
$('img, iframe').each(function() {
    concealGenericElement($(this));
});

//-- Seeks for background-image attribute on all tags
$('*').each(function() { //TODO: Can I make this query more efficient?
    if ($(this).css('background-image') != 'none') { // Only concern about elements that has background images
        //console.log('Tag:', $(this).prop('tagName'),
        //            'BgRepeat:', $(this).css('background-repeat'),
        //            'BgImg:', $(this).css('background-image'));
        if($(this).css('background-repeat') == 'no-repeat') { // Only concern about elements that has none repeating background
            var imageObj = generateImageObject($(this));
            if (typeof imageObj != "undefined") {
                //console.log('imageObj', imageObj, 'width:', imageObj.width, 'height:', imageObj.height);
                if(imageObj.width > BG_IMAGE_MAX_WIDTH && imageObj.height > BG_IMAGE_MAX_HEIGHT) {
                    concealBackgroundImageElement($(this));
                }
            }
        }
    }
});



//-- Event Binding
$('body').on('mouseenter', '.dn-img-active', function() {
    var defaultOpacity = ($(this).data('dn-default-opacity') != '') ? $(this).data('dn-default-opacity') : 1;
    $(this).fadeTo(FADING_SPEED, defaultOpacity);
});
$('body').on('mouseleave', '.dn-img-active', function() {
    $(this).fadeTo(FADING_SPEED, ACTIVE_OPACITY);
});



//-- Methods

// Create an Image object by finding the 'background-image' of an jQuery selector element
// REF: http://stackoverflow.com/a/12784180/174774
function generateImageObject(targetElem) {
    var imageUrl = targetElem.css('background-image');
    var imageObj;
    //console.log('imageObj', imageObj);
    imageUrl = imageUrl.match(/^url\("?(.+?)"?\)$/); // Remove url() or in case of Chrome url("")

    if (imageUrl[1]) {
        imageUrl = imageUrl[1];
        imageObj = new Image();

        //// just in case it is not already loaded
        //$(imageObj).load(function () {
        //    //alert(imageObj.width + 'x' + imageObj.height);
        //});

        imageObj.src = imageUrl;
    }

    return imageObj;
}

function concealGenericElement(targetElem) {
    return targetElem.addClass('dn-img-active')
                     .data('dn-default-opacity', targetElem.css('opacity'))
                     .css({ opacity: ACTIVE_OPACITY });
}

function concealBackgroundImageElement(targetElem) {
    return targetElem.data('dn-default-background-image', targetElem.css('background-image'))
                     .css('background-image', 'none');
}
