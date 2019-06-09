class cVue {
	constructor(options) {
	    this.$options = options;
			this.$data = options.data;
			this.$el = options.el;
			this.compile(this.$el);
			this.observe(this.$data);
	}
	observe(data){ //数据劫持
		for(var key in data){
			let value = data[key];
			let _this = this;
			Object.defineProperty(data,key,{
				configurable:true,
				enumerable:true,
				get(){
					console.log('get')
				},
				set(newValue){
					console.log('set',newValue);
					value = newValue;
					_this.compile(_this.$el);
				}
			})
		}
	}
	compile(el){
		let element = document.querySelector(el);
		this.compileNodes(element);
	}
	compileNodes(element){
		let childNodes = element.childNodes;
		childNodes.forEach((nodes)=>{
			if(nodes.nodeType === 3){ // text
				let contentText = nodes.textContent;
				let reg = /\{\{\s*(\S*)\s*\}\}/;
				if(reg.test(contentText)){
					nodes.textContent = this.$data[RegExp.$1];
				}
			}
			if(nodes.childNodes.length){
				this.compileNodes(nodes);
			}
		})
	}
}

class Dep {
	constructor() {
	    this.subs = [];
	}
	addSub(sub){
		this.subs.push(sub);
	}
	notify(){
		this.subs.forEach(v=>{
			v.update();
		})
	}
}

class Watcher {
	cconstructor() {
	    
	}
	update(){
		console.log('update');
	}
}

let w1 = new Watcher();
let w2 = new Watcher();
let w3 = new Watcher();
let d1 = new Dep();
d1.addSub(w1);
d1.addSub(w2);
d1.addSub(w3);
d1.notify();