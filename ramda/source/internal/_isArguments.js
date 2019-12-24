import _has from './_has';


var toString = Object.prototype.toString;
// 是否是 Arguments 类型
var _isArguments = (function () {
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments(x) { return _has('callee', x); };
}());

export default _isArguments;
