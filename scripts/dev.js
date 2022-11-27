const args = require('minimist')(process.argv.slice(2));// node scripts/dev.js reactivity -f global

const { resolve } = require('path') // node中的内置模块，可以解析路径
const { build } = require('esbuild'); // 打包
//进程输出 -f 自定义属性， --format
// minist 用来解析命令行参数的

const target = args._[0] || 'reactivity'; // 需要打包的模块。默认打包 reactivity 模块
const format = args.g || 'global'; // 打包的格式。默认为 global，即打包成 IIFE 格式，在浏览器中使用

// 开发环境只打包某一个

// 打包的入口文件。每个模块的 src/index.ts 作为该模块的入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

// 打包文件的输出格式
const outputFormat = format.startsWith('global') ? 'iife': format === 'cjs' ? 'cjs': 'esm'

// 打包的输出文件，输出到模块目录下的 dist 目录下，并以各自的模块规范为后缀名作为区分
const outfile = resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`)

// 读取模块的 package.json，它包含了一些打包时需要用到的配置信息
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));
// iife 立即执行函数 (function () {})()
// cjs node中的模块  module.exports
// esm  浏览器中的esModule模块  import

// buildOptions.name 是模块打包为 IIFE 格式时的全局变量名字
const pgkGlobalName = pkg?.buildOptions?.name

// koa 服务器
const Koa = require('koa');
const fs = require('fs');
const static = require("./utils/static"); // 处理静态资源文件
const readFile = require("./utils/readFile"); // 实时更新文件
const router = require("./router");

const port = '7788', host = '0.0.0.0';

const app = new Koa();

app.use(static()) // 设置静态资源

// 天生支持
build({ // 打包
    entryPoints: [entry],
    outfile,
    bundle: true, // 把所有的包打包在一起
    sourcemap: true, // Source Maps（源映射）映射位置信息
    
    format: outputFormat, //输出的格式
    globalName: pkg.buildOptions?.name, //打包的全局名字

    // 平台默认情况下，esbuild 构建会生成用于浏览器的代码。如果打包的文件是在 node 环境运行，需要将平台设置为node
    platform: format === 'cjs'? 'node': 'browser',
    watch: {// 监控js文件变化
        onRebuild(error) {
            if(!error) console.log(`rebuild~~~~~~~~`)
        }
    }
}).then(() => {

    // 自动丰富 response 相应头，当未设置响应状态(status)的时候自动设置，在所有路由中间件最后设置(全局，推荐)，也可以设置具体某一个路由（局部），例如：router.get('/index', router.allowedMethods()); 这相当于当访问 /index 时才设置
    app.use(router.routes()).use(router.allowedMethods()) // 注册路由
    app.listen(port, host, () => {
        console.log(` ${ host } API server listening on http://localhost:${ port }`)
    });
})

