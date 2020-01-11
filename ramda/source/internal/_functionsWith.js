import _filter from './_filter';


/**
 * @private
 * @param {Function} fn The strategy for extracting function names from an object 从对象上抽出函数名的方法
 * @return {Function} A function that takes an object and returns an array of function names. 一个接收一个对象返回函数名的数组的函数
 */
export default function _functionsWith(fn) {
  return function(obj) {
    return _filter(function(key) { return typeof obj[key] === 'function'; }, fn(obj));
  };
}
