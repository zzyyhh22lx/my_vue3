# Vue3架构

## -

### Vue设计思想

- Vue3.0更注重模块上的拆分，在2.0中无法单独使用部分模块。需要引入完整的Vue.js(例如只想使用响应式部分，但是需要引入完整的Vue.js),Vue3中模块之间耦合度低，模块可以独立使用，拆分模块
- Vue2中很多方法( 大量API挂载到Vue对象原型中，难以实现Treeshaking )挂载到了实例中导致没有使用也会被打包（还有很多组件也一样），通过构建工具Tree-shaking机制实现按需引入，减少用户打包后体积。重写API
- Vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式。 **扩展更方便**
  + vue2存在的问题：设计小程序框架，对于vue2需要根据vue2的源码设计框架
  + Vue3.0中支持 自定义渲染器 (Renderer)：这个 API 可以用来自定义渲染逻辑。它可以将 `Virtual DOM` 渲染为 Web 平台的真实 DOM。（在以往像weex和mpvue，需要通过fork源码的方式进行扩展）。
  + 渲染器是围绕 `Virtual DOM` 而存在的，在 Web 平台下它能够把 `Virtual DOM` 渲染为浏览器中的真实 DOM 对象，

>依旧保留Vue2的特色

#### 声明式框架

> Vue3依旧是声明式的框架，用起来简单

**命令式和声明式区别**

- 早在JQ的时代编写的代码都是命令式的，命令式框架重要特点就是关注过程
  + 需要更多的获取数据，绑定数据
  + 操作dom，编写dom
- 声明式框架更加关注结果。命令式的代码封装到了Vuejs中，过程靠vuejs来实现

> 声明式代码更加简单，不需要关注实现，按照要求填代码就可以 （给上原材料就出结果）

```javascript
//- 命令式编程：
let numbers = [1,2,3,4,5]
let total = 0
for(let i = 0; i < numbers.length; i++) {
  total += numbers[i] - 关注了过程
}
console.log(total)

//- 声明式编程：
let total2 = numbers.reduce(function (memo,current) {
  return memo + current
},0)
console.log(total2)
复制代码
```

#### 采用虚拟DOM

传统更新页面，拼接一个完整的字符串innerHTML全部重新渲染，添加虚拟DOM后，可以比较新旧虚拟节点，找到变化在进行更新。虚拟DOM就是一个对象，用来描述真实DOM的

```json
const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    children,
    component: null,
    el: null,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
} 
```

#### 区分编译时和运行时

- 我们需要有一个虚拟DOM，调用渲染方法将虚拟DOM渲染成真实DOM （缺点就是虚拟DOM编写麻烦）
- 专门写个编译时可以将模板编译成虚拟DOM （在构建的时候进行编译性能更高，不需要再运行的时候进行编译，而且vue3在编译中做了很多优化）





## - 

### Vue3整体架构

#### Monorepo 管理项目

> `Monorepo`是管理代码的一种方式，它是指在一个项目仓库（repo）下管理多个包
>
>  Vue3源码采用 monorepo 方式进行管理，将模块拆分到package目录中。

- 一个仓库中维护多个包
- 一个仓库可维护多个模块，不用到处找仓库
- 便于版本管理、依赖管理，模块间的引用，调用都非常的方便
- 缺点就是仓库的体积会变大



#### Vue3项目结构

- **`reactivity`**:响应式系统
- **`runtime-core`**:与平台无关的运行时核心 (可以创建针对特定平台的运行时 - 自定义渲染器)
- **`runtime-dom`**: 针对浏览器的运行时。包括`DOM API`，属性，事件处理等
- **`runtime-test`**:用于测试
- **`server-renderer`**:用于服务器端渲染
- **`compiler-core`**:与平台无关的编译器核心
- **`compiler-dom`**: 针对浏览器的编译模块
- **`compiler-ssr`**: 针对服务端渲染的编译模块
- **`compiler-sfc`**: 针对单文件解析
- **`size-check`**:用来测试代码体积
- **`template-explorer`**：用于调试编译器输出的开发工具
- **`shared`**：多个包之间共享的内容
- **`vue`**:完整版本,包括运行时和编译器

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/455c6de3e0a842e4810ef8184d63229d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)





#### Vue3采用Typescript

Vue2 采用Flow来进行类型检测 （Vue2中对TS支持并不友好）， Vue3源码采用Typescript来进行重写 , 对Ts的支持更加友好。



#### Vue3对比Vue2的变化

- 在Vue2的时候使用defineProperty来进行数据的劫持, 需要对属性进行重写添加`getter`及`setter` **性能差**。
- 当新增属性和删除属性时无法监控变化。需要通过`$set`、`$delete`实现
- 数组不采用defineProperty来进行劫持 （浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理
- vue3的源码采用`monorepo`管理方式，实现了从`模块管理`到`包管理`的转变
- vue2采用的是`Flow`来做静态类型检测，而vue3使用`typescript`重构代码，增强类型检测。
- vue2的方法都放在`实例对象`上，而vue3中都是`函数形式`，所以vue3支持`tree-shaking`，不使用就不会被打包
- vue2的数据劫持是通过`defineProperty`，而这也是vue2最大的性能问题，所以vue3中使用`Proxy`实现数据劫持
- vue3对模板编译进行了优化，编译时生成`Block tree`可以收集动态节点，减少比较
- vue3采用`compositionApi`进行组织功能，优化复用逻辑，相较于`optionApi`类型推断更加便捷
- 增加了 `Fragment`,`Teleport`，`Suspense`组件



> Vue3中使用Proxy来实现响应式数据变化。从而解决了上述问题。



#### CompositionAPI

- 在Vue2中采用的是OptionsAPI, 用户提供的data,props,methods,computed,watch等属性 (用户编写复杂业务逻辑会出现反复横跳问题)
- Vue2中所有的属性都是通过`this`访问，`this`存在指向明确问题
- Vue2中很多未使用方法或属性依旧会被打包，并且所有全局API都在Vue对象上公开。Composition API对 tree-shaking 更加友好，代码也更容易压缩。
- 组件逻辑共享问题， Vue2 采用mixins 实现组件之间的逻辑共享； 但是会有数据来源不明确，命名冲突等问题。 Vue3采用CompositionAPI 提取公共逻辑非常方便

> 简单的组件仍然可以采用OptionsAPI进行编写，compositionAPI在复杂的逻辑中有着明显的优势~。 `reactivity`模块中就包含了很多我们经常使用到的`API` 例如：computed、reactive、ref、effect等



