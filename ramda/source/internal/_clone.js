import _cloneRegExp from './_cloneRegExp';
import type from '../type';


/**
 * Copies an object.
 * 复制对象
 *
 * @private
 * @param {*} value The value to be copied 需要复制的目标
 * @param {Array} refFrom Array containing the source references 包含源引用的数组
 * @param {Array} refTo Array containing the copied source references 包含复制了的源引用的数组
 * @param {Boolean} deep Whether or not to perform deep cloning. 是否深度克隆
 * @return {*} The copied value. 克隆的值
 */
export default function _clone(value, refFrom, refTo, deep) {
  var copy = function copy(copiedValue) {
    var len = refFrom.length;
    var idx = 0;
    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
      idx += 1;
    }
    refFrom[idx] = value;
    refTo[idx] = copiedValue;
    for (var key in value) {
      copiedValue[key] = deep ?
        _clone(value[key], refFrom, refTo, true) : value[key];
    }
    return copiedValue;
  };
  switch (type(value)) {
    case 'Object':  return copy({});
    case 'Array':   return copy([]);
    case 'Date':    return new Date(value.valueOf());
    case 'RegExp':  return _cloneRegExp(value);
    default:        return value;
  }
}
