var defaultIsMergeableObject = require('is-mergeable-object')

// 根据入参判断返回时空对象还是空数组
function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

// 除非另有规定才合并
function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

// 默认的数组合并规则
function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

// 合并规则，满足条件时用自定义规则，否则用深度合并
function getMergeFunction(key, options) {
	if (!options.customMerge) { // 没有自定义合并规则，则使用深度合并
		return deepmerge
	}
	var customMerge = options.customMerge(key)
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

// 得到自身可数的Symbol属性键组成的数组
function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) { // 过滤掉不可数的属性键
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

// 得到目标对象的属性键组成的数组
function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	/*
		上面等同于： Reflect.ownKeys(target).filter(name => target.propertyIsEnumerable(name))，
		更多参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys
	*/
}

// 属性是否是对象上的可数属性
function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
// 防止原型中毒和意外合并原型链。
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
																				// 属性如不在对象上则合并时安全
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
																								// 如果在原型链上，则不安全
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
																												// 如果不可数，则不安全
}

// 合并对象
function mergeObject(target, source, options) {
	var destination = {}
	if (options.isMergeableObject(target)) { // 合并target
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options)
		})
	}
	getKeys(source).forEach(function(key) { // 合并source
		if (propertyIsUnsafe(target, key)) { // 不安全的属性键 跳过
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) { // 递归处理
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options)
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options)
		}
	})
	return destination
}

// 深度合并
function deepmerge(target, source, options) {
	options = options || {}
	options.arrayMerge = options.arrayMerge || defaultArrayMerge
	options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	// cloneUnlessOtherwiseSpecified添加到`options`上，以便自定义的arrayMerge()实现能用到它。调用不会被覆盖。
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified

	var sourceIsArray = Array.isArray(source)
	var targetIsArray = Array.isArray(target)
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray

	if (!sourceAndTargetTypesMatch) { // 处理类型不匹配的情况
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) { // 处理source是数组的情况
		return options.arrayMerge(target, source, options)
	} else { // 处理其他情况
		return mergeObject(target, source, options)
	}
}

// 深度合并所有
deepmerge.all = function deepmergeAll(array, options) {
	// 校验入参，首参数必须为数组
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	// 两两深度合并
	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
}

module.exports = deepmerge
