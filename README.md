# `my_Vue3`

### -

### 服务器

- 基于`koa`框架搭建后台
- 基于`esbuild` 打包模块





### -



### 功能：

- 实现渲染模板 `{{}}`：在`vue`源码中是通过解析`template`并建立虚拟`dom`实现的。以`{{message}}`为例，将`{{message}}`解析为一个独立的`DocumentFragment`节点，当`message`变化时更新该节点的值。
- 实现 `reactive` ：对于对象的 `proxy` 代理，将数据转为响应式
- 实现 `effect`：effect 代表的是副作用，如果次函数依赖的数据发送变化了，会重新执行
- 实现 `ref`：响应式管理任何类型
- 实现`watch`
- 实现计算属性`computed`
- `diff` 算法

