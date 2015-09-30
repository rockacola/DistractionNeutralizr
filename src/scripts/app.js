//
// Extension / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var Utils = require('./base/utils');


//TODO: need list of example pages to best test image/ads heavy pages
/*
 * Examples:
 * http://www.engadget.com/
 * - Image heavy, endless pagination
 *
 * https://en.wikipedia.org/wiki/Internet_Explorer
 * - Image with specialised src attributes
 *
 * http://nikonrumors.com/2015/09/17/nikon-24mm-f1-8g-ed-and-200-500mm-f5-6e-ed-vr-lenses-now-shipping.aspx/
 * - Image, Google Ads, Disqus module, twitter module
 *
 * http://www.apple.com/au/
 * - Background Image heavy
 *
 * https://www.youtube.com/watch?v=0af00UcTO-c
 * https://www.youtube.com/results?search_query=ted+talks
 * - Video, image
 *
 * http://www.codeproject.com/Articles/339725/Domain-Driven-Design-Clear-Your-Concepts-Before-Yo
 * - Image, GoogleActiveView
 *
 * http://www.macrumors.com/2015/09/28/mame-emulator-new-apple-tv/
 * - Image, Video, Google Ads
 *
 *
 * Roadmap:
 * - Flash support
 * - Video support
 * - Overlay icon on disabled elements and show corresponding annotation icons to effects.
 * - Detects and hides intrusive background images
 *
 */

// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {
    isDebug: true, // Currently not been utilised

    // Configurations
    checkIntervalMs: 4000, //TODO: Instead of using timing, perhaps using/incorporate scrolling distance?

    init: function() {
        log('Initialise Distraction Neutralizr. isDebug:', this.isDebug);
        if(!window.document.body.classList.contains('dn-active')) { // Mechanism to avoid the script been triggered multiple time.
            window.document.body.classList.add('dn-active');
            this._performIntervalCheck(); // perform the 1st evaluation
            setInterval(this._performIntervalCheck.bind(this), this.checkIntervalMs);
        }
    },

    _performIntervalCheck: function() {
        this._checkImgElements();
        this._checkIframeElements();
    },

    _checkImgElements: function() {
        var _this = this;
        var imgElementCollection = window.document.querySelectorAll('img:not(.dn-flag)');
        Utils.forEach(imgElementCollection, function($img) {
            _this._muteBasicElement($img, 'image');
        });
    },

    _checkIframeElements: function() {
        var _this = this;
        var iframeElementCollection = window.document.querySelectorAll('iframe:not(.dn-flag)');
        Utils.forEach(iframeElementCollection, function($iframe) {
            _this._muteBasicElement($iframe, 'iframe');
        });
    },

    _muteBasicElement: function($el, objectType) {
        //TODO: perhaps I should try catch this?
        log('_muteBasicElement triggered.');

        if(!$el) { //TODO: Better validation check
            return;
        }

        // Add flags
        $el.classList.add('dn-flag', 'dn-object', 'dn-'+objectType);

        // Apply object wrapper
        var $wrapper = document.createElement('div');
        $wrapper.classList.add('dn-object-wrapper', 'dn-'+objectType+'-wrapper');
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
