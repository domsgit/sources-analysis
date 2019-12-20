/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

// 用 typeof 判断目标类型，并排除掉 null 和 数组 的情况
// 另外可以用： Object.prototype.toString.call(val) === '[object Object]' 来判断
export default function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};
