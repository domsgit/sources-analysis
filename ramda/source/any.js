import _curry2 from './internal/_curry2';
import _dispatchable from './internal/_dispatchable';
import _xany from './internal/_xany';


/**
 * Returns `true` if at least one of the elements of the list match the predicate,
 * `false` otherwise.
 * 只要列表中有一个元素满足 predicate，就返回 true，否则返回 false
 * Dispatches to the `any` method of the second argument, if present.
 * 若第二个参数自身存在 any 方法，则调用其自身的 any。
 * Acts as a transducer if a transformer is given in list position.
 * 若在列表位置中给出 transfomer，则用作 transducer 。
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
 *         otherwise.
 * @see R.all, R.none, R.transduce
 * @example
 *
 *      const lessThan0 = R.flip(R.lt)(0);
 *      const lessThan2 = R.flip(R.lt)(2);
 *      R.any(lessThan0)([1, 2]); //=> false
 *      R.any(lessThan2)([1, 2]); //=> true
 */
var any = _curry2(_dispatchable(['any'], _xany, function any(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}));
export default any;
