import _isArray from './_isArray';


/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 * 校验函数是否有[methodname]方法。如果有这个方法，将会执行这个方法，否则默认ramda实现。
 * 
 * 返回函数,该函数如果没有参数,直接执行fn;该函数最后一个参数不是函数类型,把参数作为fn的参数执行;
 * 该函数的最后一个参数是函数类型,执行这个参数为函数类型的函数,最后一个参数之前的参数作为参数.
 *
 * @private
 * @param {Function} fn ramda implemtation ramda实现
 * @param {String} methodname property to check for a custom implementation 需要校验是否私人实现的属性
 * @return {Object} Whatever the return value of the method is. 函数执行结果返回
 */
export default function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}
