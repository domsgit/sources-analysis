/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 * 一个特殊的占位符值，用于指定柯里化函数中的“间隙”，允许不管位置的部分参数的任何组合。
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 * 如果`g`是三元的柯里化的函数，`_`代表`R.__`，则下面是等效的：
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
export default {'@@functional/placeholder': true};
