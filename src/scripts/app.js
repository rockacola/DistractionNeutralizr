//
// Extension / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var Utils = require('./base/utils');


//TODO: need list of example pages to best test image/ads heavy pages


// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {
    isDebug: true,

    // Configurations
    checkIntervalMs: 2000,
    //TODO: have a feature toggle class
    //TODO: feature to allow toggle display of content with click

    init: function() {
        //TODO: What happen when this is triggered multiple times?
        log('Initialise Distraction Neutralizr. isDebug:', this.isDebug);

        this._performIntervalCheck(); // perform the 1st evaluation
        setInterval(this._performIntervalCheck.bind(this), this.checkIntervalMs); // perform checks every interval
    },

    _performIntervalCheck: function() {
        //log('_performIntervalCheck triggered.');

        var _this = this;
        //var imgElementCollection = window.document.querySelectorAll('img:not(.dn-flag)');
        var imgElementCollection = window.document.querySelectorAll('img:not([src=""])');
        Utils.forEach(imgElementCollection, function($img) {
            _this._muteImgElement($img);
        });



        var adTargetSelectors = [
            '.ad:not(.dn-flag)',
            '.adContainer:not(.dn-flag)',
            '[id^="google_ads_"]:not(.dn-flag)',
            '#leaderboard_ad_container:not(.dn-flag)',
        ];
        var adTargetSelectorQueryString = adTargetSelectors.join(', ');
        log('adTargetSelectorQueryString', adTargetSelectorQueryString);
        var adElementCollection = window.document.querySelectorAll(adTargetSelectorQueryString);
        Utils.forEach(adElementCollection, function($ad) {
            _this._muteAdElement($ad);
        });



        //TODO: support flash
        var flashElementCollection = window.document.querySelectorAll('object[type="application/x-shockwave-flash"]:not(.dn-flag)');
        Utils.forEach(flashElementCollection, function($flash) {
            _this._muteFlashElement($flash);
        });



        //TODO: support background image



        //TODO: is it possible to manipulate elements within iframe?
        /*        //TODO: handle images within non-flagged iframes
         var iframeCollection = window.document.querySelectorAll('iframe:not(.dn-flag)');
         Utils.forEach(iframeCollection, function($iframe) {
         var iframeImgCollection = $iframe.querySelectorAll('img:not([src=""])');
         Utils.forEach(iframeImgCollection, function($img) {
         _this._muteImgElement($img);
         });
         });*/
    },

    _muteImgElement: function($img) {
        log('_muteImgElement triggered.');

        if(!$img) { //TODO: Better validation check
            return;
        }

        // Add flags and backup original content
        $img.classList.add('dn-flag');
        $img.setAttribute('data-dn-enabled', true);
        $img.setAttribute('data-dn-img-src', $img.src);
        $img.setAttribute('data-dn-img-alt', $img.alt);
        // Override existing element attributes
        //TODO: May consider using 'setProperty' attribute to set '!important' (REF: http://stackoverflow.com/a/463134/174774)
        $img.style.width = $img.offsetWidth + 'px';
        $img.style.height = $img.offsetHeight + 'px';
        $img.style.backgroundColor = 'rgba(170, 170, 170, 0.6)';
        $img.setAttribute('src', '');
        $img.setAttribute('srcset', '');
        $img.setAttribute('data-src', '');
        $img.setAttribute('alt', '');
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

        while($ad.lastChild) {
            $ad.removeChild($ad.lastChild);
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
};

window.App = TheInstance; // use 'window.app' for easier debugging through browser console.
window.App.init();
