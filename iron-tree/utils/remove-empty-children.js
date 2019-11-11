// for json tree
// 仅支持json格式的树
/**
 * 删除空的子元素
 * @param {object} jTree json格式的树结构
 * @param {Node} node Node节点类
 * @param {object} options 选项
 */
module.exports = function removeEmptyChildren(jTree, node = null, options) {
  const { key_children } = options;
  node = node || jTree[0];
  if (node[key_children].length === 0) {
    delete node[key_children];
  } else {
    // 递归删除子树
    node[key_children].forEach((item) => {
      removeEmptyChildren(jTree, item, options);
    });
  }
}
