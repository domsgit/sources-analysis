const IronTree = require('@denq/iron-tree');

// 默认配置
const defaultOptions = {
  key_id: 'id',
  key_parent: 'parent',
  key_child: 'child',
  empty_children: false,
};

// 排序
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

// list-to-tree类
module.exports = class LTT {

  // 构造函数
  constructor(list, options = {}) {
    // 拷贝list
    const _list = list.map((item) => item);

    // 合并配置
    options = Object.assign({}, defaultOptions, options);
    this.options = options;
    const { key_id, key_parent } = options;

    sortBy(_list, key_parent, key_id);
    // 把list上的元素挂载到树节点上
    const tree = new IronTree({ [key_id]: 0 });
    _list.forEach((item, index) => {
      tree.add((parentNode) => {
        return parentNode.get(key_id) === item[key_parent];
      }, item);
    });

    this.tree = tree;
  }

  // 排序
  sort(criteria) {
    this.tree.sort(criteria);
  }

  // 获取树
  GetTree() {
    const { key_child, empty_children } = this.options;
    return this.tree.toJson({
      key_children: key_child,
      empty_children
    })[key_child];
  }

}
