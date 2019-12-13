# is-mergeable-object 是否可合并对象

<!--js
const isMergeableObject = require('./')
-->

The biggest difficulty deep merge libraries run into is figuring out which properties of an object should be recursively iterated over.
深度合并库遇到的最大困难是弄清楚应该递归地迭代对象的哪些属性。

This module contains the algorithm used by [`deepmerge`](https://github.com/KyleAMathews/deepmerge/).
该模块包含[`deepmerge`](https://github.com/KyleAMathews/deepmerge/)库需要的算法。

<!--js
const someReactElement = {
	$$typeof: Symbol.for('react.element')
}
-->

```js
isMergeableObject(null) // => false

isMergeableObject({}) // => true

isMergeableObject(new RegExp('wat')) // => false

isMergeableObject(undefined) // => false

isMergeableObject(new Object()) // => true

isMergeableObject(new Date()) // => false

isMergeableObject(someReactElement) // => false
```
