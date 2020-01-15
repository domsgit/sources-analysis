/*!
 * object.pick <https://github.com/jonschlinkert/object.pick>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var isObject = require('isobject');

module.exports = function pick(obj, keys) {
  // obj 必须为对象
  if (!isObject(obj) && typeof obj !== 'function') {
    return {};
  }

  var res = {};
  // 当keys为字符串的情况
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }
  
  // 当keys为数组的情况
  var len = keys.length;
  var idx = -1;

  while (++idx < len) {
    var key = keys[idx];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};
