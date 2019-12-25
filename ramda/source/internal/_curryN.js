import _arity from './_arity';
import _isPlaceholder from './_isPlaceholder';


/**
 * Internal curryN function.
 * 内部N元柯里化函数。
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.  柯里化函数的多样化。
 * @param {Array} received An array of arguments received thus far. 到目前为止，已收到一系列参数。
 * @param {Function} fn The function to curry. 需要柯里化的函数。
 * @return {Function} The curried function. 已经柯里化的函数。
 */
export default function _curryN(length, received, fn) {
  return function() {
    var combined = []; // 已经整合处理的参数
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0
      ? fn.apply(this, combined) // 参数够了，执行函数
      : _arity(left, _curryN(length, combined, fn)); // 参数不够，继续柯里化
  };
}
