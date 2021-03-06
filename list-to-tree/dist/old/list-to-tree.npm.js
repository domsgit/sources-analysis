/**
 * Created by DenQ on 31.08.2015.
 * Repo: https://github.com/DenQ/list-to-tree
 */
//var _ = require('lodash');
var LTT, list, ltt;

// 取对象集合某key的值为新集合
function pluck(collection, key) {
  return collection.map(function (item) {
    return item[key];
  });
}

// 集合过滤
function unique(collection) {
  return collection.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });
}

// 多字段排序
function sortBy(collection, propertyA, propertyB) {
  return collection.sort(function (a, b) {
    if (a[propertyB] < b[propertyB]) {
      if (a[propertyA] > b[propertyA]) {
        return 1;
      }
      return -1;
    } else {
      if (a[propertyA] < b[propertyA]) {
        return -1;
      }
      return 1;
    }
  });
};

// list-to-tree 这种写法很有意思，外面用IIFE，里面用原型的方式重写成面向对象LTT
LTT = (function () {
  LTT.prototype.groupParent = [];

  LTT.prototype.key_id = 'id';

  LTT.prototype.key_parent = 'parent';

  LTT.prototype.key_child = 'child';

  LTT.prototype.options = {};

  function LTT(list, options) {
    this.list = list;
    this.options = options != null ? options : {};
    this.ParseOptions();
    this.list = sortBy(this.list, this.key_parent, this.key_id);
    this.groupParent = unique(pluck(this.list, this.key_parent));
    return this;
  }

  // 解析配置，方便定制化id, parent, child键名
  LTT.prototype.ParseOptions = function () {
    var that = this;
    ['key_id', 'key_parent', 'key_child'].forEach(function (item) {
      if (typeof that.options[item] !== 'undefined') {
        that[item] = that.options[item];
      }
    });
  };

  // 获取祖先项
  LTT.prototype.GetParentItems = function (parent) {
    var item, result, _i, _len, _ref;
    result = [];
    _ref = this.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item[this.key_parent] === parent) {
        result.push(item);
      }
    }
    return result;
  };

  // 根据id取某项
  LTT.prototype.GetItemById = function (id) {
    var item, _i, _len, _ref;
    _ref = this.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item[this.key_id] === id) {
        return item;
      }
    }
    return false;
  };

  // 取树
  LTT.prototype.GetTree = function () {
    var child, i, obj, parentId, result, _i, _j, _len, _len1, _ref;
    result = [];
    _ref = this.groupParent;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parentId = _ref[_i];
      obj = this.GetItemById(parentId);
      child = this.GetParentItems(parentId);
      if (obj === false) {
        for (_j = 0, _len1 = child.length; _j < _len1; _j++) {
          i = child[_j];
          result.push(i);
        }
      } else {
        obj[this.key_child] = child;
      }
    }
    return result;
  };

  return LTT;

})();

module.exports = LTT;