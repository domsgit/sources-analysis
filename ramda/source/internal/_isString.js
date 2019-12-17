// 判断是否是字符串类型的内部方法
export default function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
