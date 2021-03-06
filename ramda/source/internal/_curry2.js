import _curry1 from './_curry1';
import _isPlaceholder from './_isPlaceholder';


/**
 * Optimized internal two-arity curry function.
 * 内部优化的二元柯里化函数。
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry. 需要柯里化的函数。
 * @return {Function} The curried function. 已经柯里化的函数。
 */
export default function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a)
          ? f2
          : _curry1(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b)
          ? f2
          : _isPlaceholder(a)
            ? _curry1(function(_a) { return fn(_a, b); })
            : _isPlaceholder(b)
              ? _curry1(function(_b) { return fn(a, _b); })
              : fn(a, b);
    }
  };
}
