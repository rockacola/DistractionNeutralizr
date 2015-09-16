//
// Extension / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var Utils = require('./base/utils');



// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {
    isDebug: true,

    // Configurations
    checkIntervalMs: 2000,
    //TODO: have a feature toggle class
    //TODO: feature to allow toggle display of content with click

    init: function() {
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

        //TODO: support Google Adword elements
        //TODO: support background image
        //TODO: support flash
    },

    _muteImgElement: function($img) {
        log('_muteImgElement triggered.');

        if(!$img) { //TODO: Better validation check
            return;
        }

        //TODO: attempt to retain its original width and height
        //TODO: add a bit of transparency to better blend with its background

        $img.setAttribute('data-dn-enabled', true);
        $img.setAttribute('data-dn-img-src', $img.src);
        $img.setAttribute('data-dn-img-alt', $img.alt);
        $img.classList.add('dn-flag');
        $img.style.backgroundColor = '#aaa';
        $img.setAttribute('src', '');
        $img.setAttribute('srcset', '');
        $img.setAttribute('alt', '');
    },
};

window.App = TheInstance; // use 'window.app' for easier debugging through browser console.
window.App.init();
