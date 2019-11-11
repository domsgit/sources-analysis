/**
 * 遍历树
 * @param {Tree} tree Tree类
 * @param {Node} node Node类
 * @param {function} criteria 过滤函数
 * @param {function} callback 回调
 */
module.exports = function traversalTree(tree, node = null, criteria, callback) {
  const currentNode = node || tree.rootNode;
  if (!node) {
    if (typeof criteria === 'function' && criteria(currentNode)) {
      callback(currentNode);
    } else if (criteria === null) {
      callback(currentNode);
    }
  }
  currentNode.traversal(criteria, callback);
  const children = currentNode.children;

  // 递归子树
  children.forEach((item) => {
    traversalTree(tree, item, criteria, callback);
  });
}
