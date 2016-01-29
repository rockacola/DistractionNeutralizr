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

    checkCount: 0,

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

        if(Settings.MuteImage) {
            this._performBlockImage();
        }

        if(Settings.MuteIframe) {
            this._performBlockIframe();
        }

        if(Settings.MuteVideo) {
            this._performBlockVideo();
        }

        if(this.checkCount > 0) {
            this._performWildcardCheck();
        }

        this.checkCount++;
        log('[TRACE]', 'checkCount:', this.checkCount);

    },

    _performBlockImage: function() {
        var _this = this;
        var $images = window.document.querySelectorAll('img:not([dn-mute="true"])');
        Utils.forEach($images, function($img) {
            _this._muteImage($img);
        });
    },

    _performBlockIframe: function() {
        var _this = this;
        var $iframes = window.document.querySelectorAll('iframe:not([dn-mute="true"])');
        Utils.forEach($iframes, function($iframe) {
            _this._muteIframe($iframe);
        });
    },

    _performBlockVideo: function() {
        var _this = this;
        var $videos = window.document.querySelectorAll('video:not([dn-mute="true"])');
        Utils.forEach($videos, function($video) {
            _this._muteVideo($video);
        });
    },

    _muteImage: function($el) {
        log('[TRACE]', '_muteImage triggered.');
        this._muteBasicElement($el, $el.nodeName.toLowerCase());
    },

    _muteIframe: function($el) {
        log('[TRACE]', '_muteIframe triggered.');
        this._muteBasicElement($el, $el.nodeName.toLowerCase());
    },

    _muteVideo: function($el) {
        log('[TRACE]', '_muteVideo triggered.');
        this._muteBasicElement($el, $el.nodeName.toLowerCase());
    },

    _muteBasicElement: function($el, elementType) {
        //log('[TRACE]', '_muteBasicElement triggered. $el:', $el, 'Type:', elementType);
        //var $elComputedStyle = window.getComputedStyle($el);
        //log('[TRACE]', '$elComputedStyle:', $elComputedStyle);

        // Set element attributes
        $el.setAttribute('dn-mute', true);
        $el.setAttribute('dn-type', elementType);

        // Apply object wrapping
        var $wrapper = document.createElement('div');
        $wrapper.setAttribute('dn-check', 'true');
        $wrapper.setAttribute('dn-type', 'wrapper');
        $wrapper.setAttribute('dn-wrapper-for', elementType);
        var $relativeWrapper = document.createElement('div');
        $relativeWrapper.setAttribute('dn-check', 'true');
        $relativeWrapper.classList.add('container');
        $wrapper.appendChild($relativeWrapper);
        var $elClone = $el.cloneNode(true);
        $elClone.setAttribute('dn-check', 'true');
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
        $elClone.style.width = $elComputedStyle.width;
        $wrapper.style.height = $elComputedStyle.height;
        $elClone.style.height = $elComputedStyle.height;

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

    _performWildcardCheck: function() {
        log('[TRACE]', '_performWildcardCheck triggered.');
        var _this = this;
        var counter = 0;
        var $elements = window.document.querySelectorAll(':not([dn-check="true"]');
        log('[TRACE]', '$elements.length:', $elements.length);
        Utils.forEach($elements, function($el) {
            if(counter < Settings.WildcardElementCheckLimit) {
                _this._wildcardMuteCheck($el);
                counter++;
            }
        });
    },

    _wildcardMuteCheck: function($el) {
        $el.setAttribute('dn-check', 'true');
        var $elComputedStyle = window.getComputedStyle($el);

        // Background image check
        if(Settings.MuteBackgroundImage) {
            if(!($elComputedStyle.backgroundImage === '' || $elComputedStyle.backgroundImage == 'none')) {
                //$el.style.opacity = 0.2; // This is not the right implementation
                $el.style.backgroundImage = 'none';
            }
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
