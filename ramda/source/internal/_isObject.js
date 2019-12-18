// 判断是否是对象类型
export default function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
