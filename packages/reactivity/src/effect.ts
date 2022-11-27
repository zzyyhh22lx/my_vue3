// effect 方法接收一个函数作为参数。
// 副作用函数，会影响其他函数执行，执行时机：一是页面首次渲染时，二是它依赖的数据更新时。

export let activeEffect = undefined;

export function effect(fn) {
    // effect 方法接收一个函数参数，需要将其保存，并执行一次；以后还会扩展出更多的功能，所以将其封装为一个 ReactiveEffect 类进行维护
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}

class ReactiveEffect {
    // 这里表示在实例上新增了active属性
    public active = true; // 这个active默认是激活状态
    constructor(public fn){
        this.fn = fn;
    } // 用户传递的参数也会在this上，this.fn = fn; 

    run() { // run 就是执行effect
        if(!this.active) {this.fn()}; // 这里表示如果是非激活的情况，只需要执行函数，不需要进行依赖收集

        // 这里需要依赖收集，核心就是将当前的effect和稍后渲染的属性关联在一起
        try{
            activeEffect = this;
            return this.fn(); // 当稍后调用取值操作的时候，就可以获取到这个全局的activeEffect了
        } finally {
            activeEffect = undefined;
        }
    }
}

// 存储所有的依赖信息，包含 target、key 和 _effect
const targetMap = new WeakMap

/**
 * 依赖收集。关联对象、属性和 _effect。
 */
export function track(target, key) {
    if(!activeEffect) return

    // 从缓存中找到 target 对象所有的依赖信息
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target, depsMap = new Map)
    }
    // 再找到属性 key 所对应的 _effect集合
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, deps = new Set)
    }
 
    // 如果 _effect 已经被收集过了，则不再收集
    let shouldTrack = !deps.has(activeEffect)
    if(shouldTrack) {
        deps.add(activeEffect)
    }
}

// 实现派发更新：实现effect元素改变更新页面渲染
export function trigger(target, key) {
    // 找到 target 的所有依赖
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        return 
    }

    // 属性依赖的 _effect 列表
    let effects = depsMap.get(key)
    if(effects) {
        // 属性的值发生变化，找到它依赖的 _effect 列表，让所有的 _effect 依次执行
        effects.forEach(effect => {
            effect.run()
        })
    }
}