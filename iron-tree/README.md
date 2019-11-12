# iron-tree
This package builds a tree and gives a lot of useful methods for managing a tree and its nodes
该包构造一个树类，该树提供一些有用的管理树和节点的方法。

# Install 安装
`npm install @denq/iron-tree --save`

# Base usage 基本用法

```js
// create tree 创建树
const object = { id: 1, title: 'Root' };
const tree = new Tree(object);

// add nodes 添加节点
const regularObject = { id:2, title: 'Node 2'}
tree.add((parentNode) => {
  return parentNode.get('id') === 1;
}, regularObject);

// contains node 取子树
const targetNode = tree.contains((currentNode) => {
  return currentNode.get('id') === 2;
});  

// remove node 删除节点
const result = tree.remove((currentNode) => {
  return currentNode.get('id') === 2;
});

// traversal 遍历
const criteria = (currentNode) => currentNode.get('id') === 1;
tree.traversal(criteria, (currentNode) => {
  currentNode.set('some', true);
});

// getPath 路径
const criteria = (currentNode) => currentNode.get('id') === 6;
const targetNode = tree.contains(criteria);
const path = targetNode.getPath();
const pathString = path
  .map((item) => item.get('id'))
  .join(',');
```
```js
function compareById(vector) {
  return (a, b) => {
    const aid = Number(a.get('id'));
    const bid = Number(b.get('id'));
    if (aid > bid) {
      return vector ? 1 : -1;
    } else if (aid < bid) {
      return vector ? -1 : 1;
    } else {
      return 0
    }
  };
}
tree.sort(compareById(false));  // desc 降序
```
The following are the other methods available. 下面是其他可用的方法。
****
# Tree
This is the class of tree management. 这是管理树的类

### Properties 属性
* **rootNode** Root tree node 树的根节点
  * type `Node`

### Methods 方法
* **contstructor(object)** 构造函数
  * params 参数
    * object - json `object`. Optional 对象类型，可选
  * return `IronTree`
  * example 例子
  ```js
    const object = { id: 1, title: 'Root' };
    const tree = new Tree(object);
  ```
* **.add(criteria, object)** Adds a node to the tree if the criterion is true. 如果criterion为true，添加一个节点到树上
  * params
    * criteria(Node) - `function` or `string`. If `string` then criteria is **"root"** 当criteria为`string`类型时，**"root"**为树的根
    * object - content for the node 当前节点
  * return `IronTree`
  * examples
  ```js
  const object = { id: 1, title: 'Root' };
  const tree = new Tree();
  const resultTree = tree.add('root', object);
  ```
  ```js
  const regularObject = { id:2, title: 'Node 2'}
  const resultTree = tree.add((parentNode) => {
      return parentNode.get('id') === 1;
  }, regularObject);
  ```
* **.remove(criteria)** Removes a node from a tree if the criterion is true. 当criterion为true时，移除节点
  * params
    * criteria(Node) - return `boolean`
  * return `boolean`
  * examples
  ```js
  const result = tree.remove((currentNode) => {
      return currentNode.get('id') === 7;
  });
  ```
* **.contains(criteria)** Searches for a node in a tree according to the criterion. 根据criterion，取子树
  * params
    * criteria(Node) - return `boolean`
  * return `Node`
  * examples
  ```js
  const targetNode = tree.contains((currentNode) => {
      return currentNode.get('id') === 7;
  });
  ```

* **.sort(compare)** Sorts a tree. 树排序
  * params
    * compare(a:Node, b:Node) - comparison function 排序函数
  * return `null`
  * examples
  ```js
  function compareById(vector) {
      return (a, b) => {
          const aid = Number(a.get('id'));
          const bid = Number(b.get('id'));
          if (aid > bid) {
            return vector ? 1 : -1;
          } else if (aid < bid) {
            return vector ? -1 : 1;
          } else {
            return 0
          }
      };
  }
  tree.sort(compareById(false));  //Desc
  ```
* **.move(criteria, destination)** Moves the desired branch or node to the node or branch of the destination, according to the criteria.移动某节点
  * params
    * criteria(Node) - callback
    * destination(Node) - callback
  * return `boolean`
  * examples
  ```js
  const search = (currentNode) => currentNode.get('id') === 7;
  const destination = (currentNode) => currentNode.get('id') === 3;
  const result = tree.move(search, destination);
  ```
* **.traversal(criteria, callback)** Bypasses the tree and, according to the criterion, calls a function for each node.遍历树，每个criterion返回为true的节点都调用回调函数
  * params
    * criteria(Node) - return `boolean`
    * callback(Node)
  * return `null`
  * examples
  ```js
  const criteria = (currentNode) => currentNode.get('id') === 7;
  tree.traversal(criteria, (currentNode) => {
      currentNode.set('some', true);
  });
  ```
  ```js
  tree.traversal(null, (currentNode) => {
      if (currentNode.get('id')%2 === 0) {
        currentNode.set('some', true);
      }
  });
  ```
* **.toJson(options)** Represents a tree in the form of a json format.代表json格式的树。
  * params
    * options - `object`. Optional
      * empty_children - Type `boolean`. Allow empty children. Default `true` 是否允许空子集，默认为`true`
      * key_children - Type `string`. Field name for children. Default `children` 子集名，默认为`children`
  * return `object`
  * examples
  ```js
  const json = tree.toJson();
  ```
****

# Node
This is the node management class. 这是管理节点的类

### Properties 属性
* **content** Content of the node 当前节点
  * type `object`
* **children** Children of the node 子节点
  * type `array`
* **length** Number children of the node 子节点数
  * type `number`

### Methods 方法
* **constructor(json)**
  * params
    * json - simple `json` object
  * examples
  ```js
  const rootContent = {
    id: 1,
    name: 'Root',
  }
  let node = new Node(rootContent);
  ```

* **.add(child)** Adding a child to the node. 给节点添加一个子节点
  * return `Node` - created node
  * params
    * child - type `object`/json
  * examples
  ```js
  const rootContent = {
    id: 1,
    name: 'Root',
  }
  let node = new Node(rootContent);
  const childNode = node.add({ id: 2, name: 'Two node'});
  ```
* **.remove(criteria)** Removing a child node according to the criterion. 移除一个子节点
  * return - removed `Node`
  * params
    * criteria - criteria function for removing nodes
  * examples
  ```js
  const removedNodes = node.remove((itemNode) => {
      return itemNode.get('id') === 3;
  })
  ```

* **.get(path)** Access to node content by field name. 通过某字段名，取节点
  * return `mixed`
  * params
    * path - key name for object in node. For example `id` or `fullname`, etc... 节点中的键名，如`id`或`fullname`等等。。。
  * examples
  ```js
    node.get('id'); // 1
    node.get('name') // "Some name"
  ```
* **.set(path, value)** Setting a value or creating a new field in the contents of a node. 设置节点中的键值
  * return `boolean`
  * params
    * path - `String` field name
    * value - `mixed`
  * examples
  ```js
  node.set('id', 100)); // returned `true`. Node.content.id = 100
  node.get('id'); // 100
  ```
* **.sort(compare)** Sorting child nodes 节点排序
  * return `null`
  * params
    * compare - custom function for sorting 自定义排序函数
  * examples
  ```js
  function compareById(vector) {
      return (a, b) => {
        const aid = Number(a.get('id'));
        const bid = Number(b.get('id'));
        if (aid > bid) {
          return vector ? 1 : -1;
        } else if (aid < bid) {
          return vector ? -1 : 1;
        } else {
          return 0
        }
      };
  }
  node.sort(compareById(false));
  ```
* **.traversal(criteria, callback)** Bypassing child nodes according to the criterion and applying function to them. 遍历节点
  * return `null`
  * params
    * criteria - `function` criteria each nodes 判断是否需要触发回调的函数
    * callback - `function` fire when criteria is true for node 当criteria为true时，触发该回调
  * examples
  ```js
  // for all nodes 所有节点
  node.traversal(null, (currentNode) => {
    const name = currentNode.get('name');
    currentNode.set('name', `${name}!`);  // Last symbol "!"
  });
  ```
  ```js
  // only for node.id == 3 仅当node.id == 3时的节点
  node.traversal((currentNode) => currentNode.get('id') === 3, (currentNode) => {
    const name = currentNode.get('name');
    currentNode.set('name', `${name}!`);  // Last symbol "!"
  });
  ```

* **.getPath()** This method return array Nodes from `root node` to `current node`. It maybe helpful for breadcrumbs. 该方法返回从根节点到当前节点的节点集合。当需要概览时会很有用。
  * return `Array`
  * exampels
  ```js
  const path = targetNode.getPath();
  const pathString = path
    .map((item) => item.get('id'))
    .join(','); // 1,3,4,5,6
  ```

****

## TDD 测试
`npm test`
