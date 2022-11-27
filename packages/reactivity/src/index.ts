import { isObject } from "@myvue/shared";
import { reactive } from "./reactive"
import { effect } from "./effect"

console.log(isObject([]));

const obj = {
    name: '柯兰芝',
    age: 19
}
const person = reactive(obj)
effect(() => {
    console.log(person.name) // 林浩扬
})
setTimeout(() => {
    person.name = '我是大傻逼'
}, 1000)

person.name = '林浩扬'

person.age = 20
console.log(person.age)