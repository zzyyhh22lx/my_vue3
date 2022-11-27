var VueReactivity = (() => {
  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.fn = fn;
    }
    run() {
      if (!this.active) {
        this.fn();
      }
      ;
      try {
        activeEffect = this;
        return this.fn();
      } finally {
        activeEffect = void 0;
      }
    }
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
    }
  }
  function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    if (effects) {
      effects.forEach((effect2) => {
        effect2.run();
      });
    }
  }

  // packages/reactivity/src/baseHandler.ts
  var mutableHandles = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */)
        return true;
      console.log(`${key}\u5C5E\u6027\u88AB\u8BBF\u95EE\uFF0C\u4F9D\u8D56\u6536\u96C6`);
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log(`${key}\u5C5E\u6027\u53D8\u5316\u4E86\uFF0C\u6D3E\u53D1\u66F4\u65B0`);
      trigger(target, key);
      return Reflect.set(target, key, value, receiver);
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target))
      return;
    if (target["__v_isReactive" /* IS_REACTIVE */])
      return target;
    let exisitingProxy = reactiveMap.get(target);
    if (exisitingProxy)
      return exisitingProxy;
    const proxy = new Proxy(target, mutableHandles);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/index.ts
  console.log(isObject([]));
  var obj = {
    name: "\u67EF\u5170\u829D",
    age: 19
  };
  var person = reactive(obj);
  effect(() => {
    console.log(person.name);
  });
  setTimeout(() => {
    person.name = "\u6211\u662F\u5927\u50BB\u903C";
  }, 1e3);
  person.name = "\u6797\u6D69\u626C";
  person.age = 20;
  console.log(person.age);
})();
//# sourceMappingURL=reactivity.global.js.map
