const Node = require('./node');
const searchNode = require('../utils/search-node');
const traversalTree = require('../utils/traversal-tree');
const serializeTree = require('../utils/serialize-tree');
const removeEmptyChildren = require('../utils/remove-empty-children');

/**
 * Tree 类
 */
class Tree {

  /**
   * 树类构造函数
   * @param {object} object 内容
   */
  constructor(object = undefined) {
    this.rootNode = null;
    if (object) {
      this.rootNode = new Node(object);
    }
  }

  // only for rootNode
  // 仅支持树的根节点
  get(path) {
    return this.rootNode.get(path);
  }

  // only for rootNode
  // 仅支持树的根节点
  set(path, value) {
    this.rootNode.set(path, value);
  }

  /**
   * 新增子树
   * @param {function|string} callback 目标节点
   * @param {object} object 新增节点的内容
   */
  add(callback, object) {
    const type = typeof callback;
    if (type === 'string' && callback === 'root') {
      this.rootNode = new Node(object);
      return this;
    } else if (type === 'function') {
      const target = searchNode(this, null, callback);
      if (target && target.add(object)) {
        return this;
      } else {
        console.log('Warning', object);
      }
    }
  }

  /**
   * 树中是否有某节点
   * @param {function} criteria 校验函数
   */
  contains(criteria) {
    return searchNode(this, null, criteria);
  }

  /**
   * 删除树中某节点，成功返回true,失败返回false
   * @param {function} criteria 过滤函数
   */
  remove(criteria) {
    const targetNode = this.contains(criteria);
    if (targetNode) {
      return !!targetNode.parent.remove(criteria);
    }
    return false;
  }

  /**
   * 移动树节点
   * @param {function} search 需要移动的树的查找函数
   * @param {function} destination 移动到的目标的查找函数
   */
  move(search, destination) {
    const targetNode = this.contains(search);
    if (targetNode && this.remove(search)) {
      const destinationNode = this.contains(destination);
      return !!destinationNode.add(targetNode);
    }
    return false;
  }

  // 遍历该树
  traversal(criteria, callback) {
    traversalTree(this, null, criteria, callback);
  }

  // 排序
  sort(compare) {
    this.traversal(null, (currentNode) => {
      currentNode.sort(compare);
    });
  }

  // 树结构转成json结构
  toJson(options = {}) {
    const optionsDefault = {
      key_children: 'children',
      empty_children: true,
    };
    options = Object.assign(optionsDefault, options);
    const result = serializeTree(this, null, [], options);

    if (!options.empty_children) {
      removeEmptyChildren(result, null, options);
    }

    if (result && result.length > 0) {
      return result[0];
    }
  }
}

// 在树类上挂载Node类
Tree.Node = Node;

module.exports = Tree; 