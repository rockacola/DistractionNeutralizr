//
// Site / Base / Utils
//

'use strict';

// Dependencies
var log = require('bows')('Utils');

// Base
// --------------------------------------------------

var Utils = {

    // Lodash Utils ----------------

    forEach: require('lodash/forEach'),
    //assign: require('lodash/assign'),
    //debounce: require('lodash/debounce'),

    // NPM Libraries ----------------

    //raf: require('raf'),
    //ua: require('universal-analytics'),
    //xhr: require('xhr'),

    // Misc ----------------

    isNullOrUndefinedOrEmpty: function(obj) {
        if(obj === undefined || obj === null) {
            return true;
        } else if(obj.length <= 0) {
            return true;
        }
        return false;
    },
};



// Exports
// --------------------------------------------------

module.exports = Utils;
