/**
 * Node 类
 * 
 */
module.exports = class Node {

  /**
   * 构造函数，记录当前节点的内容、子集、大小
   * @param {object} content 内容
   */
  constructor(content) {
    this.content = content;
    this.children = [];
    this.length = 0;
  }

  /**
   * 读取当前节点的键值
   * @param {string} fieldKey 键名
   */
  get(fieldKey) {
    if (typeof this.content[fieldKey] !== 'undefined') {
      return this.content[fieldKey];
    }
  }

  /**
   * 设置当前节点某键
   * @param {string} fieldKey 键名
   * @param {any} value 键值
   */
  set(fieldKey, value) {
    return !!(this.content[fieldKey] = value);
  }

  /**
   * 添加子节点
   * @param {Node|Object} child 子节点
   */
  add(child) {
    const node = (child instanceof Node) ? child : new Node(child);
    node.parent = this;
    this.length++;
    this.children.push(node);
    return node;
  }

  /**
   * 删除子节点
   * @param {function} callback 查找需要删除的子节点的过滤函数
   */
  remove(callback) {
    const index = this.children.findIndex(callback);
    if (index > -1) {
      const removeItems = this.children.splice(index, 1);
      this.length--;
      return removeItems;
    } return [];
  }

  /**
   * 排序，跟原生的sort用法一样
   * @param {function} compare 排序比较函数
   */
  sort(compare) {
    return this.children.sort(compare);
  }

  /**
   * 遍历子节点
   * @param {function} criteria 过滤函数
   * @param {object} callback 遍历函数
   */
  traversal(criteria, callback) {
    criteria = criteria || (() => true);
    this.children
      .filter(criteria)
      .forEach(callback);
  }

  /**
   * 得到当前节点的所有祖先节点
   */
  getPath() {
    const parentList = [];
    let currentNode = this;
    while (currentNode) {
      parentList.push(currentNode);
      currentNode = currentNode.parent;
    }
    return parentList.reverse();
    /**
     * 以上完全没必要这样最后反序一下，可以在添加的时候在数组首部添加，改造成如下：
     * const parentList = [];
     * let currentNode = this;
     * while(currentNode) {
     *  parentList.unshift(currentNode);
     *  currentNode = currentNode.parent;
     * }
     * return parentList;
     */
  }

}
