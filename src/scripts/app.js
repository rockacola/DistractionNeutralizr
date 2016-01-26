//
// Extension / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var Utils = require('./base/utils');
var Settings = require('./base/settings');



// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {

    init: function() {
        if(window.document.body.getAttribute('dn-activate') != 'true') { // Mechanism to avoid the script been triggered multiple time.
            log('[TRACE]', 'Initialise Distraction Neutralizr. IsProduction:', Settings.IsProduction);
            window.document.body.setAttribute('dn-activate', true);

            this._performIntervalCheck(); // perform the 1st evaluation
            setInterval(this._performIntervalCheck.bind(this), Settings.CheckInternal);
        } else {
            log('[INFO]', 'It appears you are trying to trigger the app multiple times. Nothing will happen as an instance is already running');
        }
    },

    _performIntervalCheck: function() {
        log('[TRACE]', '_performIntervalCheck triggered');
        //var _this = this;

        if(Settings.BlockImage) {
            this._performBlockImage();
        }

        /*
        // iFrames
        var iframeElementCollection = window.document.querySelectorAll('iframe:not(.dn-flag)');
        Utils.forEach(iframeElementCollection, function($iframe) {
            _this._muteBasicElement($iframe);
        });

        // Video
        var videoElementCollection = window.document.querySelectorAll('video:not(.dn-flag)');
        Utils.forEach(videoElementCollection, function($video) {
            _this._muteBasicElement($video);
        });
        */
    },

    _performBlockImage: function() {
        var _this = this;
        var $images = window.document.querySelectorAll('img:not([dn-mute="true"]');
        Utils.forEach($images, function($img) {
            _this._muteImage($img);
        });
    },

    _muteImage: function($el) {
        log('[TRACE]', '_muteImage triggered.');
        //TODO: validation check necessary vs performance?
        this._muteBasicElement($el, $el.nodeName.toLowerCase());
    },

    _muteBasicElement: function($el, elementType) {
        //log('[TRACE]', '_muteBasicElement triggered. $el:', $el, 'Type:', elementType);
        var $elComputedStyle = window.getComputedStyle($el);
        //log('[TRACE]', '$elComputedStyle:', $elComputedStyle);

        // Set element attributes
        $el.setAttribute('dn-mute', true);
        $el.setAttribute('dn-type', elementType);


        // Apply object wrapping
        var $wrapper = document.createElement('div');
        $wrapper.setAttribute('dn-type', 'wrapper');
        $wrapper.setAttribute('dn-wrapper-for', elementType);
        var $relativeWrapper = document.createElement('div');
        $relativeWrapper.style.position = 'relative';
        $wrapper.appendChild($relativeWrapper);
        var $elClone = $el.cloneNode(true);
        $relativeWrapper.appendChild($elClone);
        $el.parentNode.insertBefore($wrapper, $el.nextSibling);
        $el.parentNode.removeChild($el);

        //TODO: getComputedStyle() is not 100% accurate. May want to look into other methods: http://www.quirksmode.org/dom/w3c_css.html
        // Migrate element style specification to its wrapper
        var $elComputedStyle = window.getComputedStyle($elClone);
        //log('[TRACE]', '$elComputedStyle:', $elComputedStyle);
        if($elComputedStyle.position != 'static') {
            $wrapper.style.position = $elComputedStyle.position;
            $elClone.style.position = 'static';
        }
        if($elComputedStyle.display != 'block') {
            $wrapper.style.display = ($elComputedStyle.display == 'inline') ? 'inline-block' : $elComputedStyle.display;
            $elClone.style.display = 'block';
        }

        $wrapper.style.width = $elComputedStyle.width;
        $elClone.style.width = 'auto';
        $wrapper.style.height = $elComputedStyle.height;
        $elClone.style.height = 'auto';

        if($elComputedStyle.margin != '0px') {
            $wrapper.style.margin = $elComputedStyle.margin;
            $elClone.style.margin = '0px';
        }
        if($elComputedStyle.padding != '0px') {
            $wrapper.style.padding = $elComputedStyle.padding;
            $elClone.style.padding = '0px';
        }
        if($elComputedStyle.top != 'auto') {
            $wrapper.style.top = $elComputedStyle.top;
            $elClone.style.top = 'auto';
        }
        if($elComputedStyle.bottom != 'auto') {
            $wrapper.style.bottom = $elComputedStyle.bottom;
            $elClone.style.bottom = 'auto';
        }
        if($elComputedStyle.left != 'auto') {
            $wrapper.style.left = $elComputedStyle.left;
            $elClone.style.left = 'auto';
        }
        if($elComputedStyle.right != 'auto') {
            $wrapper.style.right = $elComputedStyle.right;
            $elClone.style.right = 'auto';
        }


        // Bind Event Listener
        if(Settings.EnableClickToUnmute) {
            $wrapper.addEventListener('click', this._basicWrapperClickHandler.bind($wrapper)); // Just in case, binding the image wrapper
        }
    },

    // Event Bindings
    _basicWrapperClickHandler: function(e) {
        var $wrapper = this;
        if($wrapper.getAttribute('dn-disabled') != 'true') {
            log('[TRACE]', '_basicWrapperClickHandler triggered');
            e.preventDefault(); // NOTE: This will also disable original's anchor behaviour.
            $wrapper.setAttribute('dn-disabled', true);
        }
    },
};

window.App = TheInstance; // use 'window.app' for easier debugging through browser console.
window.App.init();
