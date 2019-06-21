<template>
  <div>
    <h1 class="text-red">{{msg}}</h1>
    <button @click="msg='我被点了哟'">快来点我呀</button>
  </div>
</template>

<script>
import girl from '../img/test.jpg'
export default {
  name: "home",
  data() {
    return {
      msg: "红色字体",
      imgSrc: girl
    };
  }
};
</script>

<style lang="less" scoped>
  @girls: '../img/test.jpg';
  div{
    height: 600px;
    background-image: url(@girls)
  }
  .text-red{
    color:red;
  }
</style>




