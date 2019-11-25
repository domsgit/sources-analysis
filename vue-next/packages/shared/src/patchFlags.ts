// Patch flags are optimization hints generated by the compiler.
// when a block with dynamicChildren is encountered during diff, the algorithm
// enters "optimized mode". In this mode, we know that the vdom is produced by
// a render function generated by the compiler, so the algorithm only needs to
// handle updates explicitly marked by these patch flags.
// 补丁标志是编译器生成的优化提示。
// 当在diff阶段遇到动态子元素块时，算法进入 “优化模式”。
// 在这个模式中，我们知道vdom是编译时生成的一个渲染函数渲染而成的，所以算法只需要
// 更新处理这些patch标记就可以了。

// Patch flags can be combined using the | bitwise operator and can be checked
// using the & operator, e.g.
//
//   const flag = TEXT | CLASS
//   if (flag & TEXT) { ... }
//
// Check the `patchElement` function in './createRenderer.ts' to see how the
// flags are handled during diff.

// Patch状态能通过`|`位操作符结合状态，与之`&`操作符来校验，比如：
//
//    const flag = TEXT | CLASS
//    if (flag & TEXT) { ... }
//
// 通过'./createRenderer.ts'文件中的`patchElement`函数来看diff阶段时是怎么处理状态的。

// patch阶段状态枚举
export const enum PatchFlags {
  // Indicates an element with dynamic textContent (children fast path)
  TEXT = 1,

  // Indicates an element with dynamic class binding.
  CLASS = 1 << 1,

  // Indicates an element with dynamic style
  // The compiler pre-compiles static string styles into static objects
  // + detects and hoists inline static objects
  // e.g. style="color: red" and :style="{ color: 'red' }" both get hoisted as
  //   const style = { color: 'red' }
  //   render() { return e('div', { style }) }
  STYLE = 1 << 2,

  // Indicates an element that has non-class/style dynamic props.
  // Can also be on a component that has any dynamic props (includes
  // class/style). when this flag is present, the vnode also has a dynamicProps
  // array that contains the keys of the props that may change so the runtime
  // can diff them faster (without having to worry about removed props)
  PROPS = 1 << 3,

  // Indicates an element with props with dynamic keys. When keys change, a full
  // diff is always needed to remove the old key. This flag is mutually
  // exclusive with CLASS, STYLE and PROPS.
  FULL_PROPS = 1 << 4,

  // Indicates an element that only needs non-props patching, e.g. ref or
  // directives (vnodeXXX hooks). It simply marks the vnode as "need patch",
  // since every patched vnode checks for refs and vnodeXXX hooks.
  // This flag is never directly matched against, it simply serves as a non-zero
  // value.
  NEED_PATCH = 1 << 5,

  // Indicates a fragment with keyed or partially keyed children
  KEYED_FRAGMENT = 1 << 6,

  // Indicates a fragment with unkeyed children.
  UNKEYED_FRAGMENT = 1 << 7,

  // Indicates a component with dynamic slots (e.g. slot that references a v-for
  // iterated value, or dynamic slot names).
  // Components with this flag are always force updated.
  DYNAMIC_SLOTS = 1 << 8,

  // A special flag that indicates that the diffing algorithm should bail out
  // of optimized mode. This is only on block fragments created by renderSlot()
  // when encountering non-compiler generated slots (i.e. manually written
  // render functions, which should always be fully diffed)
  BAIL = -1
}

// runtime object for public consumption
// 公共消费的运行时对象
export const PublicPatchFlags = {
  TEXT: PatchFlags.TEXT,
  CLASS: PatchFlags.CLASS,
  STYLE: PatchFlags.STYLE,
  PROPS: PatchFlags.PROPS,
  NEED_PATCH: PatchFlags.NEED_PATCH,
  FULL_PROPS: PatchFlags.FULL_PROPS,
  KEYED_FRAGMENT: PatchFlags.KEYED_FRAGMENT,
  UNKEYED_FRAGMENT: PatchFlags.UNKEYED_FRAGMENT,
  DYNAMIC_SLOTS: PatchFlags.DYNAMIC_SLOTS,
  BAIL: PatchFlags.BAIL
}

// dev only flag -> name mapping
// 仅开发标识 -> 名称映射
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.BAIL]: `BAIL`
}