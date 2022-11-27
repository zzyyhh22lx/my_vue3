const fs = require('fs');
const path = require('path');
const Router = require("koa-router");

const router = new Router(); // 定义路由
const filePath = path.resolve(__dirname,'../../src/index.html');

const main = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(filePath);
    // fs.watchFile(filePath, (cur, prv) => {
    //     if (filePath) {
    //         // 打印出修改时间
    //         // console.log(`cur.mtime>>${cur.mtime.toLocaleString()}`)// console.log(`prv.mtime>>${prv.mtime.toLocaleString()}`)
    //         if (cur.mtime != prv.mtime){ // 根据修改时间判断做下区分，以分辨是否更改
    //             console.log(`${filePath}文件发生更新`)
    //             ctx.response.body = fs.createReadStream(filePath);
    //         }
    //     }
    // })
};

router.get('/', main);

module.exports = router;