# list-to-tree
This lib is help-tool for convertation list to tree a data structure.
这个库是用来把列表转成树结构的辅助工具库。

### Attention 注意
> * Recently I have rewritten the project and now it is based on [IronTree](https://github.com/DenQ/iron-tree) - it allowed to do the project in unix way style and added flexibility. IronTree has a fairly rich interface.
>* The tree can now be sorted - you only need to pass your sorting method if you are not satisfied with the native sorting.
> * 我最近重写了该项目，现在依赖于[IronTree](https://github.com/DenQ/iron-tree) - 它可以用于unix的方式动态添加。IronTree更友好的接口。
> * 树现在可以排序 - 如果原生的排序满足不了你的需求，你只需要传入排序函数

## Install on npm 以npm安装
    npm install list-to-tree --save

## Usage 用法
```js
    var LTT = require('list-to-tree');
    var list = [
    {
        id: 1,
        parent: 0
    }, {
        id: 2,
        parent: 1
    }, {
        id: 3,
        parent: 1
    }, {
        id: 4,
        parent: 2
    }, {
        id: 5,
        parent: 2
    }, {
        id: 6,
        parent: 0
    }, {
        id: 7,
        parent: 0
    }, {
        id: 8,
        parent: 7
    }, {
        id: 9,
        parent: 8
    }, {
        id: 10,
        parent: 0
    }
    ];

    var ltt = new LTT(list, {
        key_id: 'id',
        key_parent: 'parent'
    });
    var tree = ltt.GetTree();

    console.log( tree );
```
###### Result 结果

    [{
        "id": 1,
        "parent": 0,
        "child": [
            {
                "id": 2,
                "parent": 1,
                "child": [
                    {
                        "id": 4,
                        "parent": 2
                    }, {
                        "id": 5,
                        "parent": 2
                    }
                ]
            },
            {
                "id": 3,
                "parent": 1
            }
        ]
    }, {
        "id": 6,
        "parent": 0
    }, {
        "id": 7,
        "parent": 0,
        "child": [
            {
                "id": 8,
                "parent": 7,
                "child": [
                    {
                        "id": 9,
                        "parent": 8
                    }
                ]
            }
        ]
    }, {
        "id": 10,
        "parent": 0
    }];


# Properties 属性
* **tree** - This property is `IronTree` type and have methods: add, remove, contains, sort, move, traversal, toJson, etc...
* **tree** - 这个属性是`IronTree`类型，方法有：add, remove, contains, sort, move, traversal, toJson等等
* **options** **配置项**
  * `key_id` (string) Field name for id item. Default: 'id'. 唯一标识字段名配置，默认id
  * `key_parent` (string) Field name for parent id. Default: 'parent'. 父节点唯一标识字段名配置，默认parent
  * `key_child` (string) Field name for children of item. Default  'child'. 子孙节点集合字段名配置，默认child
  * `empty_children` (boolean) Flag for allow empty children property in item. Default: false. 是否允许子元素为空，默认不允许

# Methods 方法
* **constructor(list, options)**
  * params:
    * `list` - array list with elements. Like ```{ id: 5: parent: 1 }```.
    * `options` - optional parameter. Object for describe flags and field names for tree.
* **.GetTree()** This method will be return json tree 该方法返回json树
  * example:
    ```
      tree.GetTree()
    ```
* **.sort(callback)** The custom sort method 自定义排序函数
  * callback(a, b) - a and b have `IronTree\Node` type and have methods: add, remove, get, set, sort, traversal, etc...
  * example:
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
    ltt.sort(compareById(false));
    ```

# Testing 测试
For run testing, typing on your console
在控制台上输入以下内容测试

    npm test
