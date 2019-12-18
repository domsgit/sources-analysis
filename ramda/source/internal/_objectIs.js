// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
// 判断两个值是否是相同的值
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

// 有原生的`Object.is`实现，则用原生的实现，没有，则用Polyfill
export default typeof Object.is === 'function' ? Object.is : _objectIs;
