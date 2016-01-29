//
// Site / Base / Settings
//

'use strict';

// Dependencies
var log = require('bows')('Settings');

// Base
// --------------------------------------------------

module.exports = {

    IsProduction: false,

    CheckInternal: 2500, // in milliseconds
    MuteImage: true,
    MuteIframe: true,
    MuteVideo: true,
    MuteBackgroundImage: true,
    EnableClickToUnmute: true,

    WildcardElementCheckLimit: 100,
};
