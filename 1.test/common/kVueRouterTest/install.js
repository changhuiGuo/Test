let install = function(Vue){
  Vue.prototype.$sayHi = function(msg){
    console.log(msg)
  }
}