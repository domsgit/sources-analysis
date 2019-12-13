// 是否可合并对象
// 条件：1. 非空对象；2. 除去正则、日期、react元素
module.exports = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
}

// 非null的对象类型，typeof除掉null的情况
function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

// 特殊情况处理
function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value)

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
// 是否支持Symbol
var canUseSymbol = typeof Symbol === 'function' && Symbol.for
// react 元素类型
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7

// 是否是React元素
function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}
