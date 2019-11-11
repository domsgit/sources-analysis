/**
 * 查找节点
 * @param {Tree} tree 树类
 * @param {Node} node Node类
 * @param {function} criteria 过滤函数
 */
module.exports = function searchNode(tree, node, criteria, options) {
  const currentNode = node || tree.rootNode;
  if (criteria(currentNode)) {
    return currentNode;
  }
  const children = currentNode.children
  let target = null;
  for (let i = 0; i < children.length; i++) {
    const item = children[i];
    target = searchNode(tree, item, criteria);
    if (target) {
      return target;
    }
  }
}
