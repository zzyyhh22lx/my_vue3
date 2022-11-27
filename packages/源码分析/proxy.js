const me = { name: '柯兰芝', call: false };
const meWithProxy = new Proxy(me, {
    get(target, prop) {
        if (prop === 'name') {
          return '她是大傻逼'; 
        }
        if(!me.prop) {
            return 'nothing';
        }
        return target[prop];
    },
    set(target, prop, value) {
        if (prop === 'call' && value) {
            throw Error('你在狗叫什么!');
        }
        target[prop] = value;
    }
});
console.log(meWithProxy.user);
meWithProxy.call = true;