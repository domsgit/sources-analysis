import _isPlaceholder from './_isPlaceholder';


/**
 * Optimized internal one-arity curry function.
 * 优化的内部一元柯里化函数。
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry. 需要柯里化的函数。
 * @return {Function} The curried function. 已经柯里化的函数。
 */
export default function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) { // 如果参数为空或者是占位符，则返回该函数
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
