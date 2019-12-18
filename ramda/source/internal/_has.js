// 判断某对象上是否有某属性
export default function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
