# deepmerge 深度合并

Merges the enumerable properties of two or more objects deeply.
深度合并两个或多个可数的对象属性

> UMD bundle is 723B minified+gzipped
> UMD包只有 723B 大小的压缩包

## Getting Started 如何开始

### Example Usage 用法实例
<!--js
const merge = require('./')
-->

```js
const x = {
	foo: { bar: 3 },
	array: [{
		does: 'work',
		too: [ 1, 2, 3 ]
	}]
}

const y = {
	foo: { baz: 4 },
	quux: 5,
	array: [{
		does: 'work',
		too: [ 4, 5, 6 ]
	}, {
		really: 'yes'
	}]
}

const output = {
	foo: {
		bar: 3,
		baz: 4
	},
	array: [{
		does: 'work',
		too: [ 1, 2, 3 ]
	}, {
		does: 'work',
		too: [ 4, 5, 6 ]
	}, {
		really: 'yes'
	}],
	quux: 5
}

merge(x, y) // => output
```


### Installation 安装

With [npm](http://npmjs.org) do:
用 [npm](http://npmjs.org) 安装：

```sh
npm install deepmerge
```

deepmerge can be used directly in the browser without the use of package managers/bundlers as well:  [UMD version from unpkg.com](https://unpkg.com/deepmerge/dist/umd.js).
deepmerge库可以直接在浏览器中使用，而不需要包管理工具打包它：[UMD版本](https://unpkg.com/deepmerge/dist/umd.js))


### Include 包括

deepmerge exposes a CommonJS entry point:
deepmerge暴露一个通用的入口：

```
const merge = require('deepmerge')
```

The ESM entry point was dropped due to a [Webpack bug](https://github.com/webpack/webpack/issues/6584).
因为一个[Webpack bug](https://github.com/webpack/webpack/issues/6584)，ESM入口已经废弃了。

# API


## `merge(x, y, [options])`

Merge two objects `x` and `y` deeply, returning a new merged object with the
elements from both `x` and `y`.
深度合并两个对象`x`和`y`，返回合并后的新对象。

If an element at the same key is present for both `x` and `y`, the value from
`y` will appear in the result.
如果`x`和`y`有相同的键名，则最后的值将会是`y`。

Merging creates a new object, so that neither `x` or `y` is modified.
合并新建一个新对象，即不是`x`，也不是`y`。

**Note:** By default, arrays are merged by concatenating them.
**注意：** 默认的，数组是级联合并。

## `merge.all(arrayOfObjects, [options])`

Merges any number of objects into a single result object.
合并任意数量的对象成一个结果对象。

```js
const foobar = { foo: { bar: 3 } }
const foobaz = { foo: { baz: 4 } }
const bar = { bar: 'yay!' }

merge.all([ foobar, foobaz, bar ]) // => { foo: { bar: 3, baz: 4 }, bar: 'yay!' }
```


## Options

### `arrayMerge`

There are multiple ways to merge two arrays, below are a few examples but you can also create your own custom function.
有很多种方式合并两个数组，下面是一些例子，当然，你也可以创建你自己的自定义函数。

Your `arrayMerge` function will be called with three arguments: a `target` array, the `source` array, and an `options` object with these properties:
你的`arrayMerge`函数有三个参数：`target`数组，`source`数组，`options`包含下面属性的对象：

- `isMergeableObject(value)`
- `cloneUnlessOtherwiseSpecified(value, options)`

#### `arrayMerge` example: overwrite target array

Overwrites the existing array values completely rather than concatenating them:
完全覆盖现有数组值，而不是串联它们：

```js
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

merge(
	[1, 2, 3],
	[3, 2, 1],
	{ arrayMerge: overwriteMerge }
) // => [3, 2, 1]
```

#### `arrayMerge` example: combine arrays

Combines objects at the same index in the two arrays.
两个数组相同索引合并。

This was the default array merging algorithm pre-version-2.0.0.
这是在2.0.0前的版本数组合并的默认算法。

```js
const combineMerge = (target, source, options) => {
	const destination = target.slice()

	source.forEach((item, index) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
		} else if (options.isMergeableObject(item)) {
			destination[index] = merge(target[index], item, options)
		} else if (target.indexOf(item) === -1) {
			destination.push(item)
		}
	})
	return destination
}

merge(
	[{ a: true }],
	[{ b: true }, 'ah yup'],
	{ arrayMerge: combineMerge }
) // => [{ a: true, b: true }, 'ah yup']
```

### `isMergeableObject`

By default, deepmerge clones every property from almost every kind of object.
默认情况下，deepmerge几乎从每种对象中克隆每个属性。

You may not want this, if your objects are of special types, and you want to copy the whole object instead of just copying its properties.
如果您的对象属于特殊类型，并且您想复制整个对象而不是仅复制其属性，则可能不需要这样做。

You can accomplish this by passing in a function for the `isMergeableObject` option.
您可以通过传入isMergeableObject`选项的函数来实现。

If you only want to clone properties of plain objects, and ignore all "special" kinds of instantiated objects, you probably want to drop in [`is-plain-object`](https://github.com/jonschlinkert/is-plain-object).
如果只想克隆普通对象的属性，而忽略所有“特殊”类型的实例化对象，则可能需要插入[`is-plain-object`](https://github.com/jonschlinkert/is-plain-object)

```js
const isPlainObject = require('is-plain-object')

function SuperSpecial() {
	this.special = 'oh yeah man totally'
}

const instantiatedSpecialObject = new SuperSpecial()

const target = {
	someProperty: {
		cool: 'oh for sure'
	}
}

const source = {
	someProperty: instantiatedSpecialObject
}

const defaultOutput = merge(target, source)

defaultOutput.someProperty.cool // => 'oh for sure'
defaultOutput.someProperty.special // => 'oh yeah man totally'
defaultOutput.someProperty instanceof SuperSpecial // => false

const customMergeOutput = merge(target, source, {
	isMergeableObject: isPlainObject
})

customMergeOutput.someProperty.cool // => undefined
customMergeOutput.someProperty.special // => 'oh yeah man totally'
customMergeOutput.someProperty instanceof SuperSpecial // => true
```

### `customMerge`

Specifies a function which can be used to override the default merge behavior for a property, based on the property name.
自定义函数，以属性名为基，覆盖默认的合并行为。

The `customMerge` function will be passed the key for each property, and should return the function which should be used to merge the values for that property.
将向`customMerge`函数传递每个属性的键，并应返回该函数，该函数应用于合并该属性的值。

It may also return undefined, in which case the default merge behaviour will be used.
也可以返回undefined，这种情况则会使用默认的合并方式。

```js
const alex = {
	name: {
		first: 'Alex',
		last: 'Alexson'
	},
	pets: ['Cat', 'Parrot']
}

const tony = {
	name: {
		first: 'Tony',
		last: 'Tonison'
	},
	pets: ['Dog']
}

const mergeNames = (nameA, nameB) => `${nameA.first} and ${nameB.first}`

const options = {
	customMerge: (key) => {
		if (key === 'name') {
			return mergeNames
		}
	}
}

const result = merge(alex, tony, options)

result.name // => 'Alex and Tony'
result.pets // => ['Cat', 'Parrot', 'Dog']
```


### `clone`

*Deprecated.*
*不推荐使用*

Defaults to `true`.
默认为`true`

If `clone` is `false` then child objects will be copied directly instead of being cloned.  This was the default behavior before version 2.x.
如果`clone`为`false`，则子对象将直接拷贝过去而不是克隆过去。这是2.x版本前的默认行为。


# Testing

With [npm](http://npmjs.org) do:

```sh
npm test
```


# License

MIT
