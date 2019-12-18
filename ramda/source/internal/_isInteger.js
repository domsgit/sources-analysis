/**
 * Determine if the passed argument is an integer.
 * 判断是否是整型
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
// 如果原生支持`Number.isInteger`，则用原生实现，否则用Polyfill
export default Number.isInteger || function _isInteger(n) {
  return (n << 0) === n;
};
