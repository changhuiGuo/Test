<template>
  <div>
    <h1 class="text-red">红色字体</h1>
    <button @click="this.msg='被点了'">点我呀</button>
  </div>
</template>

<script>
export default {
  name:'home',
  data(){
    return{
      msg:'红色字体'
    }
  }
}
</script>

<style scoped>
  .text-red{
    border: 1px solid #ccc;
    color: red;
  }
</style>

