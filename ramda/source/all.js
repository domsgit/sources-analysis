import _curry2 from './internal/_curry2';
import _dispatchable from './internal/_dispatchable';
import _xall from './internal/_xall';


/**
 * Returns `true` if all elements of the list match the predicate, `false` if
 * there are any that don't.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 * 如果列表中的所有元素都满足 predicate，则返回 true；否则，返回 false。
 * 若第二个参数自身存在 all 方法，则调用自身的 all 方法。
 * 若在列表位置中给出 transfomer，则用作 transducer 。
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function. 断言函数
 * @param {Array} list The array to consider. 数组
 * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
 *         otherwise. 循环每个元素,满足断言返回`true`,否则返回`false`
 * @see R.any, R.none, R.transduce
 * @example
 *
 *      const equals3 = R.equals(3);
 *      R.all(equals3)([3, 3, 3, 3]); //=> true
 *      R.all(equals3)([3, 3, 1, 3]); //=> false
 */
var all = _curry2(_dispatchable(['all'], _xall, function all(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    if (!fn(list[idx])) {
      return false;
    }
    idx += 1;
  }
  return true;
}));
export default all;
