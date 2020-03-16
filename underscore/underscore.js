//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

/**
* 最外面用了立即执行函数(IIFE)，这么做有利于模块化，避免命名冲突
* 具体更多关于IIFE的内容参考：
* http://wangdoc.com/javascript/types/function.html#立即调用的函数表达式（iife）
*/
(function () {

  // Baseline setup
  // 起手式
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  // 初始化root对象，浏览器中的`window`(`self`)，服务端的`global`，或是一些
  // 虚拟机中的`this`。我们这里使用`self`，而不用`window`，是为了支持`WebWorker`。
  //
  // 判断流程：有`self`就取`self`，没有再看`global`，然后是`this`，最后再是`{}`
  // 最后的`{}`是为了防止后面`root.xxx`时报错
  // 优先级：`typeof` > `==`和`===` > `&&` > `||`
  // 每种判断后面都加上`&& self`，`&& global`，是为了把条件成立时的`self`或是`global`值赋给root
  var root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this ||
    {};

  // Save the previous value of the `_` variable.
  // 缓存之前的`_`变量值。
  /*
    一般的UMD库处理方式都是这样：
    1. 引入该库之前，先把之前的也是以该库名作为变量的变量值缓存起来，把这个库名改写成本库：`var previousUnderscore = root._;`
    2. 定义一个防止冲突的函数：
      `_.noConflict = function () {
        root._ = previousUnderscore;
        return this; // 这里的`this`为`_`
      }`
    3. 这样，在引入该库后，直接：`var $_ = _.noConflict();`就可以用自己定义的`$_`作为本库的名字，而之前定义的`root._`变量仍在
  */
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  // 缩小（不是压缩）版节省一些字节：
  //
  // 用的地方较多的原型变量缓存成一个字节名少的变量，可以少敲几个字母，缩小版也节省一些字节
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  // ES5之前没有`Symbol`，为了兼容低版本，这里判空一下`Symbol`
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  // 创建快速调用主原型的链接。
  //
  // 原型链查找也是要花时间的。如果原型链比较深，或是某个原型上的函数用得地方比较多，
  // 不妨新建一个变量缓存一下，以牺牲一个变量的空间换取重复原型链查找的时间
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  // 下面是所有本库用到的原生**ECMAScript 5**函数实现。
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  // `surrogate-prototype-swapping`的裸函数引用
  // `surrogate-prototype-swapping`的理解：
  // `Ctor`就是一个裸函数，本身并没有什么特别的，特别之处在于用途
  // `Ctor`用于在baseCreate函数中暂存要继承的原型对象，并构造一个新的对象
  var Ctor = function () { };

  // Create a safe reference to the Underscore object for use below.
  // 创建对`Underscore`对象的安全引用
  var _ = function (obj) {
    if (obj instanceof _) return obj;
    // 没有用`new`构造函数的时候，内部构造函数实例化
    if (!(this instanceof _)) return new _(obj);
    // 把构造函数传入的参数存入`_wrapped`中
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  // 为了向后兼容旧模块的API，给**Node.js**暴露`Underscore`。
  // 如果是在浏览器端，添加`_`为全局对象。
  // (`nodeType`的校验是为了防止`module`和`exports`不是HTML元素。)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  // 当前版本
  //
  // 一般正归的库都有库的版本常量，常量一般用大写标识符
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  // 根据传入的回调返回有效率的（对当前引擎来说）版本的内部函数，以便在其他Underscore函数中复用。
  var optimizeCb = function (func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function (value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      // 第二个参数没有用到，省略掉
      case 3: return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function () {
      return func.apply(context, arguments);
    };
  };

  // 内建迭代
  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  // 一个内部函数，生成一个可以应用到集合中的每个元素的回调，返回需要的结果————
  // 无论是身份认证，还是任意的回调，属性匹配，或是属性存取器。
  var cb = function (value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  // 内部回调生成器的包装器。用户也许想私人订制`_.iteratee`，如果他们想另外predicate/iteratee速记方式。
  // 这种抽象隐藏了仅供内部使用的argCount参数。
  _.iteratee = builtinIteratee = function (value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  // 一些函数在开始时采用可变数量的参数，或者在开头采用一些预期参数，然后对可变数量的值进行运算。
  // 该辅助函数将函数的参数长度（或显式的“ startIndex”）之后的所有剩余参数累加到一个数组中，该数组成为最后一个参数。
  // 与ES6的“rest参数”相似。
  var restArguments = function (func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function () {
      var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  // 内部函数，新建一个对象，该对象继承另一个对象
  var baseCreate = function (prototype) {
    // prototype 如果不是对象，则返回`{}`
    if (!_.isObject(prototype)) return {};
    // 如果支持原生的`Object.create`，则调用原生的`Object.create`并返回结果
    if (nativeCreate) return nativeCreate(prototype);
    // `Ctor`是一个裸函数，继承传入的参数`prototype`
    Ctor.prototype = prototype;
    // 实例化
    var result = new Ctor;
    // 清空`Ctor`裸函数原型，以便下次使用
    Ctor.prototype = null;
    // 返回实例化的结果，该结果继承了传入的参数`prototype`
    return result;
  };

  // 获取浅属性
  var shallowProperty = function (key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Object.hasOwnProperty的简写，判断是否是自身有的属性，而非继承来的属性
  var has = function (obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  // 深度（属性层级嵌套深）取对象属性
  var deepGet = function (obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  // 方法集的辅助方法，以确定是否收集应该作为数组或对象进行迭代。
  // 相关： http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // 避免一个讨厌的在ARM-64上的ios 8 即时编译的bug。#2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1; // 数组最大索引
  var getLength = shallowProperty('length');
  // 是否是类数组
  // 判断依据，看是否有length属性，且属性大小在0-MAX_ARRAY_INDEX之间的数字类型
  var isArrayLike = function (collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // 集合函数
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  // `each`函数，也叫`forEach`，是基础函数。
  // 除了处理类似数组的对象外，还处理原始对象。 犹如对待稠密函数一样，对待所有
  // 稀疏数组。
  // 详细用法(https://underscorejs.org/#each)：
  /**
      _.each(list, iteratee, [context]) Alias: forEach
      Iterates over a list of elements, yielding each in turn to an iteratee function.
      The iteratee is bound to the context object, if one is passed.
      Each invocation of iteratee is called with three arguments: (element, index, list).
      If list is a JavaScript object, iteratee's arguments will be (value, key, list). Returns the list for chaining.
      _.each(list, iteratee, [context]) 也称: forEach
      遍历元素列表，依次将每个元素传递到iteratee函数。如果已传递，则iteratee绑定到上下文对象。
      每次调用iteratee时都会调用三个参数：(element, index, list)。
      如果list为JavaScript对象，iteratee的参数为：(value, key, list)。返回元素列表以便链式调用。

      ```js
      _.each([1, 2, 3], alert);
      => alerts each number in turn... // 依次弹出每个数字
      _.each({one: 1, two: 2, three: 3}, alert);
      => alerts each number value in turn... // 依次弹出每个数字
      ```

      Note: Collection functions work on arrays, objects, and array-like objects such as arguments, NodeList and similar.
      But it works by duck-typing, so avoid passing objects with a numeric length property.
      It's also good to note that an each loop cannot be broken out of — to break, use _.find instead.
      注意：集合函数适用于数组，对象和类似数组的对象，例如arguments，NodeList等。
      但是鸭子类型也可运行，因此请避免传递具有数字长度属性的对象。另外注意循环无法中断————需要中断，以`_.find`替代。
   */
  _.each = _.forEach = function (obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) { // 类数组
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else { // 对象
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  // 返回将iteratee应用于每个元素的结果。
  // 详细用法(https://underscorejs.org/#map):
  /**
    _.map(list, iteratee, [context]) Alias: collect
    Produces a new array of values by mapping each value in list through a transformation function (iteratee).
    The iteratee is passed three arguments: the value, then the index (or key) of the iteration, and finally a reference to the entire list.
    _.map(list, iteratee, [context]) 也叫: collect
    通过转换函数（iteratee）映射列表中的每个值来生成新的值数组。
    iteratee函数有三个参数：值，索引（或键名），最后一个是整个列表的引用。

    ```js
    _.map([1, 2, 3], function(num){ return num * 3; });
    => [3, 6, 9]
    _.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
    => [3, 6, 9]
    _.map([[1, 2], [3, 4]], _.first);
    => [1, 3]
    ```
   */
  _.map = _.collect = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length,
      results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  // 创建向左或向右迭代的函数。
  var createReduce = function (dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    // 将代码变量包装在一个单独的函数中，而不是访问`arguments.length`，以避免性能下降。(#1991)
    var reducer = function (obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function (obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  // **Reduce**从值的列表中构建成一个单值，也叫`inject`或`foldl`。
  // 详细用法(https://underscorejs.org/#reduce):
  /**
      _.reduce(list, iteratee, [memo], [context])   Aliases: inject, foldl
      Also known as inject and foldl, reduce boils down a list of values into a single value.
      Memo is the initial state of the reduction, and each successive step of it should be returned by iteratee.
      The iteratee is passed four arguments: the memo, then the value and index (or key) of the iteration, and finally a reference to the entire list.
      _.reduce(list, iteratee, [memo], [context])   也叫: inject, foldl
      也叫inject、foldl，reduce将值列表简化为单个值。Memo是reduce的初始状态，它的每个后续步骤都应该由iteratee返回。
      iteratee有四个参数：memo，迭代的值和索引，最后一个是整个列表的引用。

      If no memo is passed to the initial invocation of reduce, the iteratee is not invoked on the first element of the list.
      The first element is instead passed as the memo in the invocation of the iteratee on the next element in the list.
      如果没有memo传递给reduce的初始调用，则不会在列表的第一个元素上调用iteratee。

      ```js
      var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
      => 6
      ```
   */
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  // 右开始的reduce，也叫`foldr`。
  // 详细用法参考：https://underscorejs.org/#reduceRight
  /**
      _.reduceRight(list, iteratee, [memo], [context]) Alias: foldr
      The right-associative version of reduce. Foldr is not as useful in JavaScript as it would be in a language with lazy evaluation.
      右开始的reduce。Foldr在JavaScript中的用处不如在具有延迟评估的语言中有用。

      ```js
      var list = [[0, 1], [2, 3], [4, 5]];
      var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
      => [4, 5, 2, 3, 0, 1]
      ```
   */
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  // 返回通过真值测试的第一个值。也叫`detect`。
  // 详细用法参考：https://underscorejs.org/#find
  /*
      _.find(list, predicate, [context]) Alias: detect
      Looks through each value in the list, returning the first one that passes a truth test (predicate), or undefined if no value passes the test.
      The function returns as soon as it finds an acceptable element, and doesn't traverse the entire list.
      predicate is transformed through iteratee to facilitate shorthand syntaxes.
      遍历列表中的每个值，返回第一个通过真值测试（断言）的值，如果没有值通过测试，则返回undefined。
      该函数在找到满足条件的元素后立即返回，并且不会遍历整个列表。 断言通过迭代进行转换，以简化语法。

      ```js
      var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
      => 2
      ```
  */
  _.find = _.detect = function (obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  // 返回所有的通过真值测试的元素。也叫`select`。
  // 详细用法参考：https://underscorejs.org/#filter
  /*
      _.filter(list, predicate, [context]) Alias: select
      Looks through each value in the list, returning an array of all the values that pass a truth test (predicate).
      predicate is transformed through iteratee to facilitate shorthand syntaxes.
      遍历列表中的每个值，返回所有通过真值测试（断言）的值的数组。断言通过迭代进行转换，以简化语法。

      ```js
      var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
      => [2, 4, 6]
      ```
  */
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function (value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  // 返回所有的没通过真值测试的元素。
  // 详细用法参考：https://underscorejs.org/#reject
  /*
      _.reject(list, predicate, [context])
      Returns the values in list without the elements that the truth test (predicate) passes. The opposite of filter.
      predicate is transformed through iteratee to facilitate shorthand syntaxes.
      返回列表中的值，其中不包含真值测试（断言）通过的元素。与filter相反。断言通过迭代进行转换，以简化语法。

      ```js
      var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
      => [1, 3, 5]
      ```
  */
  _.reject = function (obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  // 确定是否所有元素都与真相测试匹配。
  // 详细用法参考：https://underscorejs.org/#every
  /*
    _.every(list, [predicate], [context]) Alias: all
    Returns true if all of the values in the list pass the predicate truth test.
    Short-circuits and stops traversing the list if a false element is found.
    predicate is transformed through iteratee to facilitate shorthand syntaxes.
    如果列表中的所有值均通过真值测试，则返回true。如果发现错误元素，则短路并停止遍历该列表。
    断言通过迭代进行转换，以简化语法。

    ```js
    _.every([2, 4, 5], function(num) { return num % 2 == 0; });
    => false
    ```
  */
  _.every = _.all = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  // 确定对象中的至少一个元素是否与真实性测试匹配。
  // 详细用法参考：https://underscorejs.org/#some
  /*
      _.some(list, [predicate], [context]) Alias: any
      Returns true if any of the values in the list pass the predicate truth test.
      Short-circuits and stops traversing the list if a true element is found.
      predicate is transformed through iteratee to facilitate shorthand syntaxes.
      如果列表中的任何值通过真值测试，则返回true。如果找到正确的元素，则短路并停止遍历该列表。
      断言通过迭代进行转换，以简化语法。

    ```js
      _.some([null, 0, 'yes', false]);
      => true
    ```
  */
  _.some = _.any = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  // 判断一个数组或对象中是否包含给定的元素（全等判断）
  // 详细用法参考：https://underscorejs.org/#contains
  /*
    _.contains(list, value, [fromIndex]) Aliases: include, includes
    Returns true if the value is present in the list. Uses indexOf internally, if list is an Array.
    Use fromIndex to start your search at a given index.
    如果列表中有该元素，返回true。如果列表是数组，直接用indexOf。使用fromIndex在给定索引处开始搜索。

    ```js
    _.contains([1, 2, 3], 3);
    => true
    ```
  */
  _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  // https://underscorejs.org/#invoke
  /*
    _.invoke(list, methodName, *arguments)
    Calls the method named by methodName on each value in the list. Any extra arguments passed to invoke will be forwarded on to the method invocation.
    在list的每个元素上执行methodName方法。 任何传递给invoke的额外参数，invoke都会在调用methodName方法的时候传递给它。
    
    _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
    => [[1, 5, 7], [1, 2, 3]]
  */
  _.invoke = restArguments(function (obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function (context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  // https://underscorejs.org/#pluck
  /*
    _.pluck(list, propertyName)
    A convenient version of what is perhaps the most common use-case for map: extracting a list of property values.
    pluck也许是map最常使用的用例模型的简化版本，即萃取数组对象中某属性值，返回一个数组。

    var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
    _.pluck(stooges, 'name');
    => ["moe", "larry", "curly"]
  */
  _.pluck = function (obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  // https://underscorejs.org/#where
  /*
    _.where(list, properties)
    Looks through each value in the list, returning an array of all the values that matches the key-value pairs listed in properties.
    遍历list中的每一个值，返回一个数组，这个数组里的元素包含 properties 所列出的键 - 值对。

    _.where(listOfPlays, {author: "Shakespeare", year: 1611});
    => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
        {title: "The Tempest", author: "Shakespeare", year: 1611}]
  */
  _.where = function (obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  // https://underscorejs.org/#findWhere
  /*
    _.findWhere(list, properties)
    Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
    遍历整个list，返回 matches（匹配） properties参数所列出的所有 键 - 值 对的第一个值。

    If no match is found, or if list is empty, undefined will be returned.
    如果没有找到匹配的属性，或者list是空的，那么将返回undefined。

    _.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
    => {year: 1918, newsroom: "The New York Times",
      reason: "For its public service in publishing in full so many official reports,
      documents and speeches by European statesmen relating to the progress and
      conduct of the war."}
  */
  _.findWhere = function (obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  // https://underscorejs.org/#max
  /*
    _.max(list, [iteratee], [context])
    Returns the maximum value in list. If an iteratee function is provided, it will be used on each value to generate the criterion by which the value is ranked. 
    -Infinity is returned if list is empty, so an isEmpty guard may be required. Non-numerical values in list will be ignored.
    返回list中的最大值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。
    如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 。

    var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
    _.max(stooges, function(stooge){ return stooge.age; });
    => {name: 'curly', age: 60};
  */
  _.max = function (obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
      value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function (v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  // https://underscorejs.org/#min
  /*
    _.min(list, [iteratee], [context])
    Returns the minimum value in list. If an iteratee function is provided, 
    it will be used on each value to generate the criterion by which the value is ranked. 
    Infinity is returned if list is empty, so an isEmpty guard may be required. Non-numerical values in list will be ignored.
    返回list中的最小值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。
    如果list为空，将返回Infinity，所以你可能需要事先用isEmpty检查 list 。

    var numbers = [10, 5, 100, 2, 1000];
    _.min(numbers);
    => 2
  */
  _.min = function (obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
      value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function (v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  // 清洗一个集合。
  // https://underscorejs.org/#shuffle
  /*
    _.shuffle(list)
    Returns a shuffled copy of the list, using a version of the Fisher-Yates shuffle.

    _.shuffle([1, 2, 3, 4, 5, 6]);
    => [4, 1, 6, 3, 5, 2]
  */
  _.shuffle = function (obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  // https://underscorejs.org/#sample
  /*
    _.sample(list, [n])
    Produce a random sample from the list. Pass a number to return n random elements from the list. 
    Otherwise a single random item will be returned.
    从 list中产生一个随机样本。传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项。

    _.sample([1, 2, 3, 4, 5, 6]);
    => 4

    _.sample([1, 2, 3, 4, 5, 6], 3);
    => [1, 6, 2]
  */
  _.sample = function (obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  // https://underscorejs.org/#sortBy
  /*
    _.sortBy(list, iteratee, [context])
    Returns a (stably) sorted copy of list, ranked in ascending order by the results of running each value through iteratee. 
    iteratee may also be the string name of the property to sort by (eg. length).
    返回一个（稳定的）排序后的list拷贝副本。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。
    用来进行排序迭代器也可以是属性名称的字符串(比如 length)。

    _.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
    => [5, 4, 6, 3, 1, 2]

    var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
    _.sortBy(stooges, 'name');
    => [{name: 'curly', age: 60}, {name: 'larry', age: 50}, {name: 'moe', age: 40}];
  */
  _.sortBy = function (obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function (value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function (left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  // 一个内部函数，用来聚合“分组”操作。
  var group = function (behavior, partition) {
    return function (obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function (value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  // https://underscorejs.org/#groupBy
  /*
    _.groupBy(list, iteratee, [context])
    Splits a collection into sets, grouped by the result of running each value through iteratee. 
    If iteratee is a string instead of a function, groups by the property named by iteratee on each of the values.
    把一个集合分组为多个集合，通过 iterator 返回的结果进行分组. 如果 iterator 是一个字符串而不是函数, 
    那么将使用 iterator 作为各元素的属性名来对比进行分组。

    _.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
    => {1: [1.3], 2: [2.1, 2.4]}

    _.groupBy(['one', 'two', 'three'], 'length');
    => {3: ["one", "two"], 5: ["three"]}
  */
  _.groupBy = group(function (result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  // 按照类似于“groupBy”的准则索引对象的值，但仅对于当您知道索引值将是唯一的时。
  // https://underscorejs.org/#indexBy
  /*
    _.indexBy(list, iteratee, [context])
    Given a list, and an iteratee function that returns a key for each element in the list (or a property name), 
    returns an object with an index of each item. Just like groupBy, but for when you know your keys are unique.
    给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator 函数（或属性名）， 返回一个每一项索引的对象。
    和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。

    var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
    _.indexBy(stooges, 'age');
    => {
      "40": {name: 'moe', age: 40},
      "50": {name: 'larry', age: 50},
      "60": {name: 'curly', age: 60}
    }
  */
  _.indexBy = group(function (result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  // 对按特定条件分组的对象的实例进行计数。传递要计数的字符串属性或返回条件的函数。
  // https://underscorejs.org/#countBy
  /*
    _.countBy(list, iteratee, [context])
    Sorts a list into groups and returns a count for the number of objects in each group.
    Similar to groupBy, but instead of returning a list of values, returns a count for the number of values in that group.
    将列表分为几组，并返回每个组中对象数的计数。与groupBy相似，但不返回值列表，而是返回该组中值数量的计数。

    ```js
    _.countBy([1, 2, 3, 4, 5], function(num) {
      return num % 2 == 0 ? 'even': 'odd';
    });
    => {odd: 3, even: 2}
    ```
  */
  _.countBy = group(function (result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  // 从任何可迭代的对象安全地创建一个真实的实时数组。
  // https://underscorejs.org/#toArray
  /*
    _.toArray(list)
    Creates a real Array from the list (anything that can be iterated over). Useful for transmuting the arguments object.
    从列表（任何可以迭代的）中创建一个数组。对于转换arguments对象很有用。

    ```js
    (function(){ return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
    => [2, 3, 4]
    ```
  */
  _.toArray = function (obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      // 保持代理配对字符在一起
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  // 返回对象中元素个数
  // https://underscorejs.org/#size
  /*
    _.size(list)
    Return the number of values in the list.
    返回列表中元素的个数

    ```js
    _.size([1, 2, 3, 4, 5]);
    => 5

    _.size({one: 1, two: 2, three: 3});
    => 3
    ```
  */
  _.size = function (obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  // 将集合分为两个数组：一个数组的所有元素均满足给定条件，另一个数组的所有元素均不满足条件。
  // https://underscorejs.org/#partition
  /*
    _.partition(list, predicate)
    Split list into two arrays: one whose elements all satisfy predicate and one whose elements all do not satisfy predicate.
    predicate is transformed through iteratee to facilitate shorthand syntaxes.
    把列表拆成两个数组：一个所有元素都满足条件，另一个所有元素都不满足条件。
    断言通过迭代进行转换，以简化语法。

    ```js
    _.partition([0, 1, 2, 3, 4, 5], isOdd);
    => [[1, 3, 5], [0, 2, 4]]
    ```
  */
  _.partition = group(function (result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // 数组函数
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  // 取数组中的第一个元素。传递n将会返回数组中的前N个值。
  // 也叫`head`、`take`。**guard**参数以确保能在`_.map`中使用。
  // https://underscorejs.org/#first
  /*
    first_.first(array, [n]) Aliases: head, take
    Returns the first element of an array. Passing n will return the first n elements of the array.
    返回数组中的第一个元素。传入n则返回数组的前n个元素。

    ```js
        _.first([5, 4, 3, 2, 1]);
        => 5
    ```
  */
  _.first = _.head = _.take = function (array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  // 返回除数组的最后一项以外的所有内容。特别是在arguments对象上特别有用。
  // 传递**n**将返回数组中除了最后的N外的所有值。
  // https://underscorejs.org/#initial
  /*
    _.initial(array, [n])
    Returns everything but the last entry of the array. Especially useful on the arguments object.
    Pass n to exclude the last n elements from the result.
    返回除数组的最后一项以外的所有内容。特别是在arguments对象上特别有用。
    传递**n**将返回数组中除了最后的N外的所有值。

    ```js
`    _.initial([5, 4, 3, 2, 1]);
    => [5, 4, 3, 2]`
    ```
  */
  _.initial = function (array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  // 取数组中最后的元素。传递**n**将返回数组的最后N个元素。
  /* https://underscorejs.org/#last
    _.last(array, [n])
    Returns the last element of an array. Passing n will return the last n elements of the array.

    ``js
      _.last([5, 4, 3, 2, 1]);
      => 1
    ```
  */
  _.last = function (array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  /* https://underscorejs.org/#rest
    _.rest(array, [index]) Aliases: tail, drop
    返回数组中除了第一个元素外的其他全部元素。传递 index 参数将返回从index开始的剩余所有元素 。

    _.rest([5, 4, 3, 2, 1]);
    => [4, 3, 2, 1]
  */
  _.rest = _.tail = _.drop = function (array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  /* https://underscorejs.org/#compact
    _.compact(list)
    返回一个除去了所有 falsy(假) 值的 list 副本。 
    在javascript中, false, null, 0, "", undefined 和 NaN 都是falsy(假)值.

    _.compact([0, 1, false, 2, '', 3]);
    => [1, 2, 3]
  */
  _.compact = function (array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function (input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  /* https://underscorejs.org/#flatten
    _.flatten(array, [shallow])
    将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 
    如果你传递 shallow参数，数组将只减少一维的嵌套。

    _.flatten([1, [2], [3, [[4]]]]);
    => [1, 2, 3, 4];

    _.flatten([1, [2], [3, [[4]]]], true);
    => [1, 2, 3, [[4]]];
  */
  _.flatten = function (array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  /* https://underscorejs.org/#without
    _.without(array, *values)
    返回一个删除所有values值后的 array副本。（注：使用===表达式做相等测试。）

    _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
    => [2, 3, 4]
  */
  _.without = restArguments(function (array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  /* https://underscorejs.org/#uniq
    _.uniq(array, [isSorted], [iteratee]) Alias: unique
    返回 array去重后的副本, 使用 === 做相等测试. 如果您确定 array 已经排序, 
    那么给 isSorted 参数传递 true值, 此函数将运行的更快的算法. 如果要处理对象元素, 
    传递 iteratee函数来获取要对比的属性。

    _.uniq([1, 2, 1, 4, 1, 3]);
    => [1, 2, 4, 3]
  */
  _.uniq = _.unique = function (array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  /* https://underscorejs.org/#union
      _.union(*arrays)
    返回传入的 arrays（数组）并集：按顺序返回，返回数组的元素是唯一的，可以传入一个或多个 arrays （数组）。

    _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
    => [1, 2, 3, 101, 10]
  */
  _.union = restArguments(function (arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  /* https://underscorejs.org/#intersection
    _.intersection(*arrays)
    返回传入 arrays（数组）交集。结果中的每个值是存在于传入的每个arrays（数组）里。

    _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
    => [1, 2]
  */
  _.intersection = function (array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  /* https://underscorejs.org/#difference
    _.difference(array, *others)
    类似于without，但返回的值来自array参数数组，并且不存在于other 数组。

    _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
    => [1, 3, 4]
  */
  _.difference = restArguments(function (array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function (value) {
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  /* https://underscorejs.org/#unzip
    _.unzip(array)
    与zip功能相反的函数，给定若干arrays，返回一串联的新数组，其第一元素个包含所有的输入数组的第一元素，
    其第二包含了所有的第二元素，依此类推。（感谢 @周文彬1986、 @未定的终点 指出示例错误）。

    _.unzip([["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]);
    => [['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]]
  */
  _.unzip = function (array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  /* https://underscorejs.org/#zip
    _.zip(*arrays)
    将每个 arrays 中相应位置的值合并在一起。 当您有通过匹配数组索引进行协调的独立数据源时，这非常有用。 
    结合 apply 一起使用传入一个二维数组。 如果你用来处理矩阵嵌套数组时，则可以使用它来转换矩阵。

    _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
    => [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
  */
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function (list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function (dir) {
    return function (array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function (array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function (dir, predicateFind, sortedIndex) {
    return function (array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function (start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++ , start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function (array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = `baseCreate`(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function (func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function (callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function (func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function () {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function (obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function (func, hasher) {
    var memoize = function (key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function (func, wait, args) {
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function (func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function () {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function (func, wait, immediate) {
    var timeout, result;

    var later = function (context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function (args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function () {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function (func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function (predicate) {
    return function () {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function () {
    var args = arguments;
    var start = args.length - 1;
    return function () {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function (times, func) {
    return function () {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function (times, func) {
    var memo;
    return function () {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // 对象函数
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function (obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function (obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function (obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function (obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
      length = keys.length,
      results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function (obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function (obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function (obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function (keysFunc, defaults) {
    return function (obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function (obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function (value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function (obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function (obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function (value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function (prototype, props) {
    var result = `baseCreate`(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function (obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function (object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function (a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function (a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
        && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function (a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  // 给定的是否是空数组，空字符串，或者是空对象？
  // 一个“空”对象没有可数的自身属性。
  _.isEmpty = function (obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  // 给定的是否是一个DOM元素，nodeType 为 1，则为元素；
  _.isElement = function (obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  // 判断是否是数组？实现ECMA5原生的`Array.isArray`
  _.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  // 判断是否是对象
  // && !!obj：这里是为了过滤掉`null`
  _.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  // 统一加入类型判断：isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
    _['is' + name] = function (obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  // _.isArguments 方法在 IE < 9 下的兼容
  // IE < 9 下对 arguments 调用 Object.prototype.toString.call 方法
  // 结果是 [object Object]
  // 而并非我们期望的 [object Arguments]。
  // 所以 用是否含有 callee 属性来判断，对`isArguments`函数重写
  if (!_.isArguments(arguments)) {
    _.isArguments = function (obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function (obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function (obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function (obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function (obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function (obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function (obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function (obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // 工具函数
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  // 以*noConflict*模式运行Underscore.js，返回之前如存在的`_`变量。该函数返回Underscore对象的引用。
  /* https://underscorejs.org/#noConflict
    _.noConflict()
    放弃Underscore 的控制变量 _。返回Underscore 对象的引用。

    var underscore = _.noConflict();
  */
  _.noConflict = function () {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  // 保留身份功能以进行默认迭代。
  /* https://underscorejs.org/#identity
    _.identity(value)
    返回与传入参数相等的值. 相当于数学里的: f(x) = x
    这个函数看似无用, 但是在Underscore里被用作默认的迭代器iterator.

    var stooge = {name: 'moe'};
    stooge === _.identity(stooge);
    => true
  */
  _.identity = function (value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  // 断言生成函数。 通常在Underscore之外有用。
  /* https://underscorejs.org/#constant
    _.constant(value)
    创建一个函数，这个函数 返回相同的值 用来作为_.constant的参数。

    var stooge = {name: 'moe'};
    stooge === _.constant(stooge)();
    => true
  */
  _.constant = function (value) {
    return function () {
      return value;
    };
  };

  // 空函数
  /* https://underscorejs.org/#noop
    _.noop()
    返回undefined，不论传递给它的是什么参数。 可以用作默认可选的回调参数。

    obj.initialize = _.noop;
  */
  _.noop = function () { };

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  // 创建一个函数，当传递对象时，该函数将沿给定的“路径”遍历该对象的属性，该路径指定为键或索引的数组。
  _.property = function (path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function (obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  // 为给定对象生成一个函数，该函数返回给定属性。
  _.propertyOf = function (obj) {
    if (obj == null) {
      return function () { };
    }
    return function (path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  // 返回一个断言，用于检查对象是否具有给定的“键：值”对。
  _.matcher = _.matches = function (attrs) {
    attrs = _.extendOwn({}, attrs);
    return function (obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  // 运行一个函数**n**次
  _.times = function (n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  // 返回一个在min到max（包含）之间的随机数字
  _.random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  // 获取当前时间戳的整数值
  _.now = Date.now || function () {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  // 要转义的HTML实体列表。
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function (map) {
    var escaper = function (match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function (string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function (obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function (match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function (text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function (data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  // 添加一个 ”链式“ 函数。开始链式一个包装Underscore对象。
  _.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  // 面向对象
  // ---------------
  // 如果Underscore以函数调用，将会返回一个类面向对象的包装对象。
  // 这个包装器包含所有的underscore函数。包装对象可以链式调用。

  // Helper function to continue chaining intermediate results.
  // 辅助函数可继续链式调用中间结果
  var chainResult = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // 添加自定义的函数到Underscore对象上
  _.mixin = function (obj) {
    _.each(_.functions(obj), function (name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function () {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  // 添加所有Underscore函数到包装对象上
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  // 将所有变量数组函数添加到包装器。
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  // 将所有访问器数组函数添加到包装器。
  _.each(['concat', 'join', 'slice'], function (name) {
    var method = ArrayProto[name];
    _.prototype[name] = function () {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  // 从包装链式的对象中抽出结果
  _.prototype.value = function () {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  // 在某些内部操作，诸如算术和JSON字符串化中，提供给一些函数未包裹的代理
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  // 重写`toString`方法
  _.prototype.toString = function () {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  // 为了兼容AMD加载，最后这里注册AMD支持。AMD模块可能在下个版本不需要了。
  // 一般来说，AMD注册应该是匿名注册，underscore把它作为一个命名模块注册是因为，
  // 诸如JQuery这样的库是一个流行的足以捆绑支持第三方库的库，但它不是AMD加载的一部分。
  // 这种情况，在一个加载请求的外面匿名调用`define()`会导致错误。
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function () {
      return _;
    });
  }
}());
