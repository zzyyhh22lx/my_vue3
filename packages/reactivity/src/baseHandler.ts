import { track, trigger } from './effect'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
// 1) 实同一个对象代理多次，返回同一个代理
// 2) 代理对象被再次代理，可以直接返回
export const mutableHandles = { // 当没有重新定义属性，只是代理，在取值的时候会调用get，当赋值的时候会调用set
    get(target, key, receiver) {
        // 访问到 __v_isReactive 属性时，说明此时的 target 其实是一个 proxy 对象，无需再被代理
        if(key === ReactiveFlags.IS_REACTIVE) return true;

        // 去代理对象上取值，就走get 这里可以监控用户取值
        console.log(`${key}属性被访问，依赖收集`)

        // 依赖收集，让 target, key 和 当前的 _effect 关联起来
        track(target, key)

        return Reflect.get(target, key, receiver);// receiver 改变调用取值的this对象，不用会出现如下情况this问题
        
        // return target[key]
        // 假如有一个对象: let target = { name: 'zf', get alias() { return this.name }}; // alias，es5取属性值
        // 并调用 proxy.alias，此时在alias上取了值，也去了name，但是没有监控到name，
        // this会变成target，而不是代理对象，此时不会进行proxy代理
    },
    set(target, key, value, receiver) {
        console.log(`${key}属性变化了，派发更新`);

        // 派发更新，通知 target 的属性，让依赖它的 _effect 再次执行
        trigger(target, key);

        // 去代理上设置值，就走set，这里可以监控用户设置值
        return Reflect.set(target, key, value, receiver);
    }
}