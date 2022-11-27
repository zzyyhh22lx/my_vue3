 
 ```json
    "scripts": {
        "dev": "node scripts/dev.js reactivity -f global",
        "build": "node scripts/build.js reactivity -f global"
    }
 ```
 - 意思是，以 IIFE 的格式，打包 reactivity 模块，打包后的文件可以运行在浏览器中。