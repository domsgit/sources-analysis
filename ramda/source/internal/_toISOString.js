/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
// 一位数时前面补0
var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };

// 格式参考： 2020-01-01T01:01:01.696Z
var _toISOString = typeof Date.prototype.toISOString === 'function' ?
  function _toISOString(d) {
    return d.toISOString();
  } :
  function _toISOString(d) {
    return (
      d.getUTCFullYear() + '-' +
      pad(d.getUTCMonth() + 1) + '-' +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + ':' +
      pad(d.getUTCMinutes()) + ':' +
      pad(d.getUTCSeconds()) + '.' +
      (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
    );
  };

export default _toISOString;
