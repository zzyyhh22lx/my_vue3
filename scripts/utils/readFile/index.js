const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname,'../../../src');
fs.watch(filePath, { recursive: true }, (eventType, file) => {
    if (file && eventType === "change") {
        console.log(`${file} 已经改变`);
    }
});