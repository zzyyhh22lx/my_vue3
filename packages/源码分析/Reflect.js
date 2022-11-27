// Reflect.apply(func, thisArg, args)
const person = {
    age: 18, sayHello: function() {  console.log(`Hello! 我是${this.name}`); }
}
// 执行 sayHello 方法
// func：要执行的函数, thisArg：指定this, args：函数执行需要的参数
Reflect.apply(person.sayHello, person, []); // Hello! 我是kw
// 更新 age 属性。属性设置成功，返回 true
Reflect.set(person, 'age', 20); // true
Reflect.get(person, 'age'); // 20


Reflect.apply(Math.floor, undefined, [1.75]) // 1


const ages = [11,33,12,54,18]
// 旧写法 
// fn.apply(obj, args)
let yongest = Math.min.apply(Math, ages); // 11
let oldest = Math.max.apply(Math, ages);
let type = Object.prototype.toString.call(yongest) // [object Number]
// 新写法 
// Reflect.apply(func, thisArg, args)
yongest = Reflect.apply(Math.min, Math, ages);
oldest = Reflect.apply(Math.max, Math, ages);
type = Reflect.apply(Object.prototype.toString, yongest, []); // [object Number]
