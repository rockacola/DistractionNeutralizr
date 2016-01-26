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
    BlockImage: true,
    BlockIframe: true,
    BlockVideo: true,
    //BlockGoogleAd: true,
    //BlockFlash: true,
    EnableClickToUnmute: true,
};
