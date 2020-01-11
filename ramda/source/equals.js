import _curry2 from './internal/_curry2';
import _equals from './internal/_equals';


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 * 如果参数相等,返回`true`,否则返回`false`.可以处理循环引用的数据结构.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 * 如果存在，则对称分配给两个参数的“等于”方法。
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
var equals = _curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});
export default equals;
