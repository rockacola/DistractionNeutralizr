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
        log('Initialise Distraction Neutralizr. IsProduction:', Settings.IsProduction);
        if(!window.document.body.classList.contains('dn-active')) { // Mechanism to avoid the script been triggered multiple time.
            window.document.body.classList.add('dn-active');
            this._performIntervalCheck(); // perform the 1st evaluation
            setInterval(this._performIntervalCheck.bind(this), Settings.CheckInternal);
        }
    },

    _performIntervalCheck: function() {
        log('_performIntervalCheck triggered');
        var _this = this;

        // Images
        var imgElementCollection = window.document.querySelectorAll('img:not(.dn-flag)');
        Utils.forEach(imgElementCollection, function($img) {
            _this._muteBasicElement($img);
        });

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
    },

    _muteBasicElement: function($el) {
        //TODO: perhaps I should try catch this?
        if(!$el) { //TODO: Better validation check
            return;
        }

        var elementType = $el.nodeName.toLowerCase();
        log('_muteBasicElement triggered. Type:', elementType);

        // Add flags
        $el.classList.add('dn-flag', 'dn-object', 'dn-'+elementType);

        // Apply object wrapper
        var $wrapper = document.createElement('div');
        $wrapper.classList.add('dn-object-wrapper', 'dn-'+elementType+'-wrapper');
        var $elClone = $el.cloneNode(true);
        $wrapper.appendChild($elClone);
        var $elParent = $el.parentNode;
        $elParent.removeChild($el);
        $elParent.appendChild($wrapper);

        // Pass attributes from object to its wrapper
        var $elComputedStyle = window.getComputedStyle($elClone);
        $wrapper.style.width = $elComputedStyle.width;
        $wrapper.style.height = $elComputedStyle.height;
        $wrapper.style.margin = $elComputedStyle.margin;
        $wrapper.style.padding = $elComputedStyle.padding;
        $elClone.style.margin = '0';
        $elClone.style.padding = '0';

        // Bind Event Listener
        $wrapper.addEventListener('click', this._basicWrapperClickHandler.bind($wrapper)); // Just in case, binding the image wrapper
    },

    // Event Bindings

    _basicWrapperClickHandler: function(e) {
        if(!this.classList.contains('dn-disabled')) {
            log('_basicWrapperClickHandler triggered');
            e.preventDefault(); // NOTE: This will also disable original's anchor behaviour.
            this.classList.add('dn-disabled');
        }
    },
};

window.App = TheInstance; // use 'window.app' for easier debugging through browser console.
window.App.init();
