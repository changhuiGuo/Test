import * as a from './src/a.js'
import("./moduleTest/src/b.js").then((res)=>{
	console.log('异步引入的b'+res.b)
},(error)=>{
	console.log("加载失败")
})
// import b from './src/b.js'
// a='d.js';
// let c = a+b;
let p1 = new a.person();
p1.sayHi();

