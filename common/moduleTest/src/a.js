let a = 'a.js'

let f1 = ()=>{
	console.log(a)
}

f1()

class person {
	constructor(name,age) {
	  this.name = name;
		this.age =age;
		
	}
	sayHi(){
		alert('hihihi')
	}
}

export {a,person};