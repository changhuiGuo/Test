<template>
  <div class="hello">
    <a href class="third-party third-party-weixin">
      <i></i>
      <span></span>
    </a>
    <div>
      <h3>{{num1}}</h3>
      <input-num min='1' max='10' v-model="num1"></input-num>
    </div>
    <div>
      <h3>{{num2}}</h3>
      <input-num min='10' max='20' v-model="num2"></input-num>
    </div>
  </div>
</template>

<script>
import inputNum from './inputNum'
export default {
  name: "test",
  data(){
    return{
      num1:5,
      num2:15,
    }
  },
  components:{
    inputNum
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.third-party {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 48px;
  margin: 0 6%;
  &:hover {
    i {
      &::after {
        transform: scale(1);
      }
    }
  }
  span {
    position: relative;
    display: block;
    width: 48px;
    height: 48px;
    background-size: 30px;
    background-position: center;
    background-repeat: no-repeat;
  }
  i {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    &::before {
      content: "";
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &::after {
      content: "";
      transition: all 0.3s;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: scale(0);
    }
  }
  &.third-party-weixin {
    span {
      background-image: url('https://b-gold-cdn.xitu.io/v3/static/img/wechat.63e1ce0.svg');
    }
    i {
      &::before {
        background-color: #20a839;
      }
      &::after {
        background-color: #30cc54;
      }
    }
  }
}
</style>
