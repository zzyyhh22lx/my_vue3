// 使用 reactive 时需要注意的地方：

// 只能实现对象数据的响应式
// 同一个对象，只会被代理一次
// 被代理过的对象，不会被再次代理
// 支持嵌套属性的响应式

import { isObject } from '@myvue/shared';
import { mutableHandles, ReactiveFlags } from './baseHandler'
// 将数据转化为响应式的数据，只能做对象的代理
const reactiveMap = new WeakMap(); // 持有的是每个键对象的“弱引用”，用于垃圾回收，相比于map
// 缓存机制// key只能是对象

export function reactive(target) {
    if(!isObject(target))  return;
    // Vue2 中通过给 Observer 实例 增加一个__ob__属性作为标识，表示它已经被观测过了，无需再被观测。Vue3 是通过给 proxy 对象增加一个__v_isReactive 属性，表示该 proxy 对象已经是响应式数据了，从而无需再被代理：
    if(target[ReactiveFlags.IS_REACTIVE]) return target; // 如果目标是一个代理对象，则一定被代理过了，会走get(ReactiveFlags.IS_REACTIVE)

    // 判断 target 是否是响应式对象
    // 每当一个 target 需要响应式时，先判断其有没有该属性。此时产生属性访问操作，如果 target 被代理过，则会进入下面的 get 方法中，做进一步的判断。   
    let exisitingProxy = reactiveMap.get(target);
    if(exisitingProxy) return exisitingProxy;
    // 第一次普通对象代理，我们会通过new Proxy代理一次
    // 下一次你传递的是proxy，我们可以看一下有没有被代理过，如果访问中有proxy，有get方法就证明被访问过了
    
    const proxy = new Proxy(target, mutableHandles)

    reactiveMap.set(target, proxy); // 加一个标志
    return proxy;
}