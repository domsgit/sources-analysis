'use strict';

var os = require('os');
if (typeof os.homedir !== 'undefined') { // os.homedir 存在
  module.exports = os.homedir;
} else {
  module.exports = require('./polyfill.js');
}

