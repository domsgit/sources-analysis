/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var forIn = require('for-in');
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(obj, fn, thisArg) {
  forIn(obj, function(val, key) { // 自身和继承的可数属性
    if (hasOwn.call(obj, key)) { // 自身属性
      return fn.call(thisArg, obj[key], key, obj); // 执行回调
    }
  });
};
