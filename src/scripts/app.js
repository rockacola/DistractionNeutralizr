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
 */

// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {
    isDebug: true,

    // Configurations
    checkIntervalMs: 2000, //TODO: Instead of using timing, perhaps using/incorporate scrolling distance?

    init: function() {
        log('Initialise Distraction Neutralizr. isDebug:', this.isDebug);
        if(!window.document.body.classList.contains('dn-active')) { // Mechanism to avoid the script been triggered multiple time.
            window.document.body.classList.add('dn-active');
            this._performIntervalCheck(); // perform the 1st evaluation
            setInterval(this._performIntervalCheck.bind(this), this.checkIntervalMs); // perform checks every interval
        }
    },

    _performIntervalCheck: function() {
        this._checkImgElements();
        this._checkIframeElements();
        //this._checkAdElements();
        //this._checkFlashElements();
        //TODO: support background image
        //TODO: manipulate elements within iframe?
        //TODO: ability to block all iframe contents?
    },

    _checkImgElements: function() {
        var _this = this;
        var imgElementCollection = window.document.querySelectorAll('img:not(.dn-flag)');
        //var imgElementCollection = window.document.querySelectorAll('img:not([src=""])');
        Utils.forEach(imgElementCollection, function($img) {
            _this._muteImgElement($img);
        });
    },

    _checkIframeElements: function() {
        var _this = this;
        var iframeElementCollection = window.document.querySelectorAll('iframe:not(.dn-flag)');
        Utils.forEach(iframeElementCollection, function($iframe) {
            _this._muteIframeElement($iframe);
        });
    },

    _checkAdElements: function() {
        var _this = this;
        var adTargetSelectors = [
            '.ad:not(.dn-flag)',
            '.adContainer:not(.dn-flag)',
            '.GoogleActiveViewClass iframe:not(.dn-flag)',
            '.adsbygoogle:not(.dn-flag)',
            //'#leaderboard_ad_container:not(.dn-flag)',
            'iframe[id^="google_ads"]', // Having trouble couple this with :not(.dn-flag)
            'iframe[id^="ad_creative"]',
            'iframe[id^="dmad"]',
            'iframe[id^="creativeIframe"]',
            'iframe[id^="aswift"]',
            '[id^="dclk-studio-creative"]',
            '[id^="google_companion_ad"] iframe:not(.dn-flag)',
        ];
        //log('huh');
        var adTargetSelectorQueryString = adTargetSelectors.join(', ');
        //log('adTargetSelectorQueryString', adTargetSelectorQueryString);
        var adElementCollection = window.document.querySelectorAll(adTargetSelectorQueryString);
        //log('adElementCollection.length', adElementCollection.length);
        Utils.forEach(adElementCollection, function($ad) {
            if(!$ad.classList.contains('dn-flag')) {
                _this._muteAdElement($ad);
            }
        });
    },

    _checkFlashElements: function() {
        var _this = this;
        var flashElementCollection = window.document.querySelectorAll('object[type="application/x-shockwave-flash"]:not(.dn-flag)');
        Utils.forEach(flashElementCollection, function($flash) {
            _this._muteFlashElement($flash);
        });
    },

    _muteImgElement: function($img) {
        log('_muteImgElement triggered.');

        if(!$img) { //TODO: Better validation check
            return;
        }

        // Add flags
        $img.classList.add('dn-flag');
        $img.classList.add('dn-image');

        // Little stretch to apply a wrapper DIV around the element
        var $imgWrapper = document.createElement('div');
        $imgWrapper.classList.add('dn-image-wrapper');
        $imgWrapper.appendChild($img.cloneNode(true));
        var $imgParent = $img.parentNode;
        $imgParent.removeChild($img);
        $imgParent.appendChild($imgWrapper);

        // Bind Event Listener
        $imgWrapper.addEventListener('click', this._imgWrapperClickHandler.bind($imgWrapper)); // Just in case, binding the image wrapper
    },

    _muteIframeElement: function($iframe) {
        //TODO: this (along with its css) is so far the same as img treatment. May consolidate.

        log('_muteIframeElement triggered.');

        if(!$iframe) { //TODO: Better validation check
            return;
        }

        // Add flags
        $iframe.classList.add('dn-flag');
        $iframe.classList.add('dn-iframe');

        // Little stretch to apply a wrapper DIV around the element
        var $iframeWrapper = document.createElement('div');
        $iframeWrapper.classList.add('dn-iframe-wrapper');
        $iframeWrapper.appendChild($iframe.cloneNode(true));
        var $iframeParent = $iframe.parentNode;
        $iframeParent.removeChild($iframe);
        $iframeParent.appendChild($iframeWrapper);
    },

    _muteAdElement: function($ad) {
        log('_muteAdElement triggered.');

        if(!$ad) { //TODO: Better validation check
            return;
        }

        // Add flags
        $ad.classList.add('dn-flag');
        $ad.setAttribute('data-dn-enabled', true);
        // Override existing element attributes
        $ad.style.width = $ad.offsetWidth + 'px';
        $ad.style.height = $ad.offsetHeight + 'px';
        $ad.style.backgroundColor = 'rgba(170, 170, 170, 0.6)';

        if($ad.nodeName === 'IFRAME') {
            $ad.src = 'about:blank';
        } else {
            while($ad.lastChild) {
                $ad.removeChild($ad.lastChild);
            }
        }
    },

    _muteFlashElement: function($flash) {
        log('_muteFlashElement triggered.');

        if(!$flash) { //TODO: Better validation check
            return;
        }

        // Add flags and backup original content
        $flash.classList.add('dn-flag');
        $flash.setAttribute('data-dn-enabled', true);
        $flash.setAttribute('data-dn-object-data', $flash.getAttribute('data'));
        // Override existing element attributes
        //TODO: May consider using 'setProperty' attribute to set '!important' (REF: http://stackoverflow.com/a/463134/174774)
        $flash.style.width = $flash.offsetWidth + 'px';
        $flash.style.height = $flash.offsetHeight + 'px';
        $flash.style.backgroundColor = 'rgba(170, 170, 170, 0.6)';
        $flash.setAttribute('data', '');

        while($flash.lastChild) {
            $flash.removeChild($flash.lastChild);
        }
    },

    // Event Bindings

    _imgWrapperClickHandler: function(e) {
        e.preventDefault(); // NOTE: This will also disable original's anchor behaviour.
        this.classList.toggle('dn-disable');
    },
};

window.App = TheInstance; // use 'window.app' for easier debugging through browser console.
window.App.init();
