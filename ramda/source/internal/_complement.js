// 对传入的函数参数包裹一层函数，该函数返回执行后的取反
export default function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}
