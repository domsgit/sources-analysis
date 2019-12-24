import _isFunction from './_isFunction';
import _toString from './_toString';

// 断言是否是Promise
export default function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError('`' + name + '` expected a Promise, received ' + _toString(p, []));
  }
}
