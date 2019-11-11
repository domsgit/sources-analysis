
/**
 * 序列化树
 * @param {Tree} tree 树类
 * @param {Node} node Node类
 * @param {Array} target 目标数组
 * @param {Object} options 选项
 */
module.exports = function serializeTree(tree, node = null, target = [], options) {
  const { key_children } = options;
  node = node || tree.rootNode;
  const index = target.push(
    Object.assign({ [key_children]: [] }, node.content)
  );
  node.children.forEach((item) => {
    serializeTree(tree, item, target[index - 1][key_children], options);
  });
  return target;
}
