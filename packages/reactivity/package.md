### json文件配置
 - 在浏览器中以 `IIFE` 格式使用响应式模块时，需要给模块指定一个全局变量名字，
   通过 `buildOptions.name` 进行指定，将来打包时会作为配置使用。
   `main` 指定的文件支持 `commonjs` 规范进行导入，也就是说在`nodejs` 环境中，
   通过 `require` 方法导入该模块时，会导入 `main` 指定的文件。
   同理，`module` 指定的是使用 `ES Module` 规范导入模块时的入口文件。

### 包依赖
 - 意思是，将本地 `workspace` 内的 `@my-vue/shared` 包，安装到 `@my-vue/reactivity`包中去。
 - 此时，查看 `reactivity` 包的依赖信息：
 ```json
    "dependencies": {
        "@myvue/shared": "workspace:^1.0.0"
    }
 ```
 - 此时，在reactivity\src\index.ts 可以引用shared包