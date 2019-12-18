

/**
 * A function that always returns `false`. Any passed in parameters are ignored.
 * 一个总是返回`false`的函数。任何传入的参数都会被忽略。
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.T
 * @example
 *
 *      R.F(); //=> false
 */
var F = function() {return false;};
export default F;
