# Vue3开发环境搭建



## 搭建`monorepo`环境

### 是什么

`monorepo`是一个将多个 `packages` 放在一个repo中的代码管理模式（实现复用）



#### loader（装载机）

##### 为什么不用webpack

vue, react 基于webpack；

- loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

- ##### 如果你要开发js库，那webpack的繁琐和打包后的文件体积就不太适用了。有需求就有工具，所以rollup的产生就是针对开发js库的。

- rollup生成代码只是把我们的代码转码成目标js并无其他,同时如果需要,他可以同时帮我们生成支持umd/commonjs/es的js代码,vue/react/angular都在用他作为打包工具。查看他们的官网代码都可以看到rollup的影子。

### Pnpm 和 Monorepo

`Pnpm` 是新一代的 `nodejs` 包管理工具。第一个 `“P”`意为 `Performance`，代表着更佳的性能。

它的主要优点有两个，一是采用了 `hard-link` 机制，避免了包的重复安装，节省了空间，同时能提高项目依赖的安装速度。二是对`monorepo` 的支持非常友好，只需要一条配置就能实现。

`Monorepo` 是一种新的仓库管理方式。过去的项目，大多采用一个仓库维护一个项目的方案。对于一个庞大复杂的项目，哪怕只进行一处小小的修改，影响的也是整体。而采用 `monorepo` 的形式，我们可以在一个仓库中管理多个包。每个包都可以单独发布和使用，就好像是一个仓库中又有若干个小仓库。

**Vue3 源码采用 monorepo 方式进行管理，将众多模块拆分到 packages 目录中。**



这带来的最直观的好处，就是方便管理和维护。而且，它不像 `Vue2` 那样将源码整体打包对外暴露。`Vue3`的这种组织形式，方便的实现了 `Tree-shaking`，需要哪个功能就引入对应的模块，能大大减少打包后项目的体积。



**开发阶段使用 esbuild 作为构建工具**，**在生产阶段采用 rollup 进行打包**。

- ##### `rollup`（下一代ES模块捆绑器）

#### 说明

##### 安装依赖：

```sql
# 源码采用 typescript 编写
pnpm add  -D -w typescript

# 构建工具，命令行参数解析工具
pnpm add -D -w esbuild rollup rollup-plugin-typescript2 @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs minimist execa 
```



- `-D`：作为开发依赖安装

- `-w`：`monorepo` 环境默认会认为应该将依赖安装到具体的 `package`中。**使用 -w 参数，告诉 pnpm 将依赖安装到 workspace-root**，也就是项目的根目录。



依赖说明：

| 依赖                        | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| typescript                  | 项目使用 typescript 进行开发                                 |
| esbuild                     | 开发阶段的构建工具                                           |
| rollup                      | 生产阶段的构建工具                                           |
| rollup-plugin-typescript2   | rollup 编译 ts 的插件                                        |
| @rollup/plugin-json         | rollup 默认采用 esm 方式解析模块，该插件将 json 解析为 esm 供 rollup 处理 |
| @rollup/plugin-node-resolve | rollup 默认采用 esm 方式解析模块，该插件可以解析安装在 node_modules 下的第三方模块 |
| @rollup/plugin-commonjs     | 将 commonjs 模块 转化为 esm 模块                             |
| minimist                    | 解析命令行参数                                               |
| execa                       | 生产阶段开启子进程                                           |





Vue3中使用`pnpm`(好像是yarn),`workspace`来实现`monorepo` (pnpm

是快速、节省磁盘空间的包管理器。主要采用符号链接的方式管理模块)



```shell
npm install pnpm -g
pnpm init -y

#创建.npmrc文件
#比如express 用到 connect包，我们开发的时候就不需要再次安装connect了，可以直接使用，但是如果express升级不需要依赖该包，就会出错了--> 解决幽灵依赖
shamefully-hoist = true

#-w(workspace) 安装到根部
#minimist 命令行
#esbuild 打包工具，比webpack快一堆
pnpm install typescript minimist -w
pnpm install vue -w

```

- 创建`pnpm-workspace.yaml`文件（`yaml`->配置文件）

  + ```yaml
    packages:
      - 'packages/*'
    ```

  + 

- 或者在package.json

  + ```json
  {
      "private": true,
      "workspaces": [
        "packages/*"
    ]
    }
  ```
  
  + 

- 创建`packages`文件（所有的包环境）

  + 在浏览器中以 `IIFE` 格式使用响应式模块时，需要给模块指定一个全局变量名字，通过 `buildOptions.name` 进行指定，将来打包时会作为配置使用。

    `main` 指定的文件支持 `commonjs` 规范进行导入，也就是说在`nodejs` 环境中，通过 `require` 方法导入该模块时，会导入 `main` 指定的文件。

    同理，`module` 指定的是使用 `ES Module` 规范导入模块时的入口文件。

  + 创建`reactivity`

    + ```shell
      pnpm init -y
      ```

    + `package.json`

      ```json
      {
        "name": "@vue/reactivity",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "buildOptions": {
          "name": "VueReactivity",
          "formats": [
            "global",
            "cjs",
            "esm-bundler"
          ]
        }
      }
      ```

    + 创建`src`文件

      + 创建`index.ts`

  + 创建`shared`(共享模块)

    + `json`

    + ```json
      {
        "name": "@vue/shared", //注意 name 字段的值，我们使用了一个 @scope 作用域，它相当于 npm 包的命名空间，可以使项目结构更加清晰，也能减少包的重名。
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "buildOptions": {
          "name": "VueReactivity",
          "formats": [
            "cjs",
            "esm-bundler"
          ]
        }
      }
      
      ```

    + 创建`src`文件

      + 创建`index.ts`


  在浏览器中以 `IIFE` 格式使用响应式模块时，需要给模块指定一个全局变量名字，通过 `buildOptions.name` 进行指定，将来打包时会作为配置使用。

  `main` 指定的文件支持 `commonjs` 规范进行导入，也就是说在`nodejs` 环境中，通过 `require` 方法导入该模块时，会导入 `main` 指定的文件。

  同理，`module` 指定的是使用 `ES Module` 规范导入模块时的入口文件。

  编写该模块的入口文件：

  ```javascript
  // src/index.ts
  
  import { isObject } from '@my-vue/shared'
  
  const obj = {name: 'Vue3'}
  
  console.log(isObject(obj))
  复制代码
  ```

  在 `reactivity` 包中用到了另一个包 `shared` ，需要安装才能使用：

  ```sql
  pnpm add @my-vue/shared@workspace --filter @my-vue/reactivity
  复制代码
  ```

  意思是，将本地 `workspace` 内的 `@my-vue/shared` 包，安装到 `@my-vue/reactivity`包中去。

  此时，查看 `reactivity` 包的依赖信息：

  ```less
  "dependencies": {
     "@my-vue/shared": "workspace:^1.0.0"
  }
  ```

  

  

  + ```shell
    #安装ts配置 或者自己创建创建`tsconfig.json`配置ts文件
    pnpm tsc --init
    ```

    ```json
    {
      "compilerOptions": {
        "outDir": "dist", //输出的目录
        "sourceMap": true, //采用soucemap
        "target": "ES2016", //目标语法
        "module": "esnext", //模块格式
        "moduleResolution": "node", //模块解析模式
        "strict": false, //严格模式
        "resolveJsonModule": true, //解析json模块
        "esModuleInterop": true, //允许通过es6语法映入commonjs模块
        "jsx": "preserve", //jsx不转义
        "lib": ["esnext", "dom"], //支持的类库"esnext", "dom"
        "baseUrl": ".",
        "paths": {
          "@vue/*": ["packages/*/src"] //查找路径
        }
      }
    }
    ```

- 在`package.json`中将`script`里面的`"test"`改为`dev`（打包相应模块 `-f global` 全局）

  ```json
  "scripts": {
      "dev": "node scripts/dev.js reactivity -f global"
    },
  ```

  + 创建一个`scripts`文件夹

    + 创建一个`dev.js`

      ```js
      const args = require('minimist')(process.argv.slice(2));// node scripts/dev.js reactivity -f gloabl
      //进程输出 -f 自定义属性， --format
      // minist 用来解析命令行参数的
      console.log(args);
      
      ```

    + `npm run dev`中shell输出

      ```shell
      > my_vue3@1.0.0 dev
      > node scripts/dev.js reactivity -f global
      
      { _: [ 'reactivity' ], f: 'global' }
      ```

    + `dev.js`

      ```js
      const args = require('minimist')(process.argv.slice(2));// node scripts/dev.js reactivity -f gloabl
      const {resolve} = require('path') // node中的内置模块，可以解析路径
      const { build } = require('esbuild'); // 打包
      //进程输出 -f 自定义属性， --format
      // minist 用来解析命令行参数的
      
      const target = args._[0] || 'reactivity';
      const format = args.g || 'gloabl';
      
      // 开发环境只打包某一个
      const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));
      // iife 立即执行函数 (function () {})()
      // cjs node中的模块  module.exports
      // esm  浏览器中的esModule模块  import
      const outputFormat = format.startsWith('global') ? 'iife': format === 'cjs' ? 'cjs': 'esm'
      
      const outfile = resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`) // 打包的输出文件，放在dist文件
      
      // 天生支持
      build({
          entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
          outfile,
          bundle: true, // 把所有的包打包在一起
          sourcemap: true, 
          format: outputFormat, //输出的格式
          globalName: pkg.buildOptions?.name, //打包的全局名字
          platform: format === 'cjs'? 'node': 'browser', // 平台
          watch: {// 监控文件变化
              onRebuild(error) {
                  if(!error) console.log(`rebuild~~~~~~~~`)
              }
          }
      }).then(() => {
          console.log(`watching~~~~~~~~`)
      })
      ```

    + 此时用`pnpm run dev` 打包完，在dist文件夹找到相应js文件。并且搞个`index.html`用`<script src="./***.js"/>`导入js文件即可看到输出 







## 实现reactive

- 安装vue

```shell
pnpm install vue -w
```

- 在上述dist文件夹的`index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="app"></div>

    <script src="../../../node_modules/@vue/reactivity/dist/reactivity.global.js"></script>
    <!-- 也可以是  ../../../node_modules/vue/dist/vue.global.js -->
    <!--  const {effect, reactive, shallowReactive, readonly,shallowReadonly} = Vue -->
    <script>
        // effect 代表的是副作用，如果次函数依赖的数据发送变化了，会重新执行
        // reactive 将数据变成响应式 proxy

        const {effect, reactive, shallowReactive, readonly,shallowReadonly} = VueReactivity
        const state = reactive({name:'zf', age: 13, address:{num:517}})

        // readonly 不能改内部元素
        // shallowReactive 浅层的reactive
        // 都是基于reactive
        const state2 = shallowReactive({name:'zf', age: 13, address:{num:517}})
        console.log(state2.address) // 对象里面的对象不会被proxy

        effect(()=>{ // 此effect函数会先执行一次，对响应式数据取值(取值的过程数据会依赖于当前的effect)
            app.innerHTML = state.name + '今年' + state.age + '岁了'
        })
        // 稍后name和age变化会重新执行effect函数
        setTimeout(()=>{
            state.age = 14;
        },1000)

    </script>
</body>
</html>
```



- 在src目录下建一个`reactive.ts`

```typescript
// reactive ： 将数据转化为响应式的数据，只能进行对象的代理

import {isObject} from '@vue/shared';
import {mutableHandles, ReactiveFlags} from './baseHandler'
// 将数据转化为响应式的数据，只能做对象的代理
const reactiveMap = new WeakMap(); // 持有的是每个键对象的“弱引用”，用于垃圾回收，相比于map
// 缓存机制// key只能是对象

export function reactive(target) {
    if(!isObject(target))  return;
    if(target[ReactiveFlags.IS_REACTIVE]) return target; // 如果目标是一个代理对象，则一定被代理过了，会走get
   
    let exisitingProxy = reactiveMap.get(target);
    if(exisitingProxy) return exisitingProxy;
    // 第一次普通对象代理，我们会通过new Proxy代理一次
    // 下一次你传递的是proxy，我们可以看一下有没有被代理过，如果访问中国proxy，有get方法就证明被访问过了
    
    const proxy = new Proxy(target, mutableHandles)

    reactiveMap.set(target, proxy); // 加一个标志
    return proxy;
}
```

- 建一个`baseHandler.ts`

```typescript
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
// 1) 实同一个对象代理多次，返回同一个代理
// 2) 代理对象被再次代理，可以直接返回
export const mutableHandles = { // 当没有重新定义属性，只是代理，在取值的时候会调用get，当赋值的时候会调用set
    get(target, key, receiver) {
        if(key === ReactiveFlags.IS_REACTIVE) return true;
        // 去代理对象上取值，就走get 这里可以监控用户取值
        return Reflect.get(target, key, receiver);// receiver 改变调用取值的this对象，不用会出现如下情况this问题
        
        // return target[key]
        // 假如有一个对象: let target = { name: 'zf', get alias() { return this.name }}; // alias，es5取属性值
        // 并调用 proxy.alias，此时在alias上取了值，也去了name，但是没有监控到name，
        // this会变成target，而不是代理对象，此时不会进行proxy代理
    },
    set(target, key, value, receiver) {
        // 去代理上设置值，就走set，这里可以监控用户设置值
        return Reflect.set(target, key, value, receiver);
    }
}
```

