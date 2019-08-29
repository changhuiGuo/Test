<template>
  <div class="home">
    <HelloWorld msg="This is an home page"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

let cm1 = new HelloWorld({
  propsData:{
    msg:'this is copy!'
  }
})
// let vm = cm1.$mount();
//  console.log('vm1.$el',vm1.$el);


export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
