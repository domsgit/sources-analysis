import _curry1 from './internal/_curry1';


/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 * 返回一个总是返回所给值的函数。请注意，对于非基本元素（即引用类型），返回的值是对原始值的引用。
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 * 这个函数就是其他语言或库中的`const`，`constant`，`k`（组合器k）
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function 值的包装函数
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
var always = _curry1(function always(val) {
  return function() {
    return val;
  };
});
export default always;
