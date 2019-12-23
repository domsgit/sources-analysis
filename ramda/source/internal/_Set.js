import _includes from './_includes';

// 原生支持Set，则用原生的Set，否则polyfill
function _Set() {
  /* globals Set 全局Set */
  this._nativeSet = typeof Set === 'function' ? new Set() : null;
  this._items = {};
}

// until we figure out why jsdoc chokes on this
// @param item The item to add to the Set 需要添加到Set的item
// @returns {boolean} true if the item did not exist prior, otherwise false 如果item不存在，则添加成功返回true，否则添加失败返回false
// 
_Set.prototype.add = function (item) {
  return !hasOrAdd(item, true, this);
};

//
// @param item The item to check for existence in the Set 判断元素是否存在于Set中
// @returns {boolean} true if the item exists in the Set, otherwise false 存在返回true,不存在返回false
//
_Set.prototype.has = function (item) {
  return hasOrAdd(item, false, this);
};

//
// Combines the logic for checking whether an item is a member of the set and
// for adding a new item to the set.
// 结合判断元素是否存在于Set中，添加新元素到Set中两逻辑
//
// @param item       The item to check or add to the Set instance. 需要校验或添加到Set实例上的元素
// @param shouldAdd  If true, the item will be added to the set if it doesn't 如果设置为true，如元素不存在于Set中，则将元素添加到Set中
//                   already exist.
// @param set        The set instance to check or add to. Set实例
// @return {boolean} true if the item already existed, otherwise false. 元素存在返回true，否则返回false
//
function hasOrAdd(item, shouldAdd, set) {
  var type = typeof item;
  var prevSize, newSize;
  switch (type) {
    case 'string':
    case 'number':
      // distinguish between +0 and -0
      // -0的情况
      if (item === 0 && 1 / item === -Infinity) {
        if (set._items['-0']) {
          return true;
        } else {
          if (shouldAdd) {
            set._items['-0'] = true;
          }
          return false;
        }
      }
      // these types can all utilise the native Set
      // 原生支持
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = {};
            set._items[type][item] = true;
          }
          return false;
        } else if (item in set._items[type]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][item] = true;
          }
          return false;
        }
      }

    case 'boolean':
      // set._items['boolean'] holds a two element array
      // representing [ falseExists, trueExists ]
      // set._items['boolean']是两个元素的数组 [ falseExists, trueExists ]
      if (type in set._items) {
        var bIdx = item ? 1 : 0;
        if (set._items[type][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][bIdx] = true;
          }
          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type] = item ? [false, true] : [true, false];
        }
        return false;
      }

    case 'function':
      // compare functions for reference equality
      // 比较函数判断引用是否相同
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = [item];
          }
          return false;
        }
        if (!_includes(item, set._items[type])) {
          if (shouldAdd) {
            set._items[type].push(item);
          }
          return false;
        }
        return true;
      }

    case 'undefined':
      if (set._items[type]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type] = true;
        }
        return false;
      }

    case 'object':
      if (item === null) {
        if (!set._items['null']) {
          if (shouldAdd) {
            set._items['null'] = true;
          }
          return false;
        }
        return true;
      }
    /* falls through */
    default:
      // reduce the search size of heterogeneous sets by creating buckets
      // for each type.
      // 给各种各样的类型创建插槽
      type = Object.prototype.toString.call(item);
      if (!(type in set._items)) {
        if (shouldAdd) {
          set._items[type] = [item];
        }
        return false;
      }
      // scan through all previously applied items
      // 遍历之前添加的元素判断是否已经存在了
      if (!_includes(item, set._items[type])) {
        if (shouldAdd) {
          set._items[type].push(item);
        }
        return false;
      }
      return true;
  }
}

// A simple Set type that honours R.equals semantics
// 致敬R.equals语义化
export default _Set;
