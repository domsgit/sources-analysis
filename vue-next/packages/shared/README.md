# @vue/shared

Utility functions and constants shared across packages. This package itself is private and never published. It is inlined into other packages during build - rollup's tree-shaking ensures that only functions used by the importing package are included.

包间共享的工具类函数和常量。这个包是从未发布的私有包。其他包构建时会内联进此包 - rollup的树摇以确保只有函数会被导入。