# find-up-sync

### Description 描述
Find a file by walking up parent directories (barebones implementation, no dependencies). 
通过遍历父目录查找文件（准系统实现，没有依赖性）。

Useful to automatically find the path to configuration files that should exist in a predefined directory. See example below.
用于自动查找预定义目录中应存在的配置文件的路径。 请参见下面的示例。

### Install

```sh
npm install --save find-up-sync
```

### Example

Assume your filesystem has a structure like this:
假设你有架构如下的文件系统：
```
/
└── home
    └── pvieira
        └── my-app
            ├── config
                └── email-key.txt
            └── xyz
                └── abc
                    └── find-key.js
```

We want to obtain the path to `config/email-key.txt` from any module in the application, without using relative paths or any other dependency specific to the application (such as a global `__rootDir` variable).
我们希望从应用程序中的任何模块获取`config/email-key.txt`的路径文件，而无需使用相对路径或应用程序特定的任何其他依赖项（例如全局`__rootDir`变量）。

### Related modules 相关模块

- `find-up` - https://www.npmjs.com/package/find-up
- `look-up` - https://www.npmjs.com/package/look-up
- `find-config` - https://www.npmjs.com/package/find-config

