import _isArray from './_isArray';
import _isTransformer from './_isTransformer';


/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 * 返回一个函数，该函数基于列表位置中的对象（最后一个参数）以不同的策略调度。如果这是个数组，执行[fn]。
 * 否则，如果他有一个给定函数名的函数，它将会执行那个函数（函子的情况）。否则，如果是 transformer，
 * 使用 transducer [xf] 来返回一个新的 transformer（transducer的情况）。
 * 否则，返回默认的执行 [fn]。
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation 自定义实现的校验属性
 * @param {Function} xf transducer to initialize if object is transformer 如果对象是 transformer，初始化的transducer
 * @param {Function} fn default ramda implementation 默认的ramda实现
 * @return {Function} A function that dispatches on object in list position 在列表位置的对象上分派的函数
 */
export default function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!_isArray(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}
