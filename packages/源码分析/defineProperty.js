const obj = {
    B:1
}
// 定义只读的对象属性A
Object.defineProperty(obj,"A",{
    value: 1,
    writable: false           // value属性值是只读的
})
console.dir(obj)    // {B:1,A:1}
console.log(obj.A)  // 1
// 给对象的属性赋值，并不会修改属性的值。
obj.A =1001
console.log(obj.A)  // 1


const obj = {}
Object.defineProperty(obj,"age",{
    get(){
        return 18
    },
    set(){
        throw new Error("对不起,你没有权限设置age属性!")
    }
})
console.dir(obj)     // {age:18}
console.log(obj.age)   // 18
obj.age = 80
console.log("设置之后的值是：",obj.age)


// 劫持所有属性 
function observe(obj) {
    Object.keys(obj).forEach(key=>{
      var val = obj[key]
      Object.defineProperty(obj,key,{
        set:function(newVal){
          console.info( `${obj[key]}----->${newVal}`);
        val = newVal;
       },
       get:function(){
        console.info(`get....${key}`)
        return val;
       }
      })
    })
}
  
var data = {salary:1000,bonus:3000}
observe(data);
  
data.salary = 2000; // 更新属性值
data.bonus;
// 在控制台输出:
// get....salary
// 1000----->2000
// get....bonus
  