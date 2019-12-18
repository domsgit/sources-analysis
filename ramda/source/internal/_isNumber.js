// 判断是否是数字类型
export default function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}
