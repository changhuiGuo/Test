<template>
  <div class="layout">
    <div class="header">
      <div class="item">1</div>
      <h3 class="text">Header</h3>
    </div>
    <div class="content">
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
      <div class="item">7</div>
      <div class="item">8</div>
      <h3 class="text">content</h3>
    </div>
    <div class="footer">
      <div class="item">9</div>
      <div class="item">x</div>
      <h3 class="text">Footer</h3>
    </div>
  </div>
</template>

<script>
export default {
  name:'layout',
  data(){
    return{

    }
  }
}
</script>

<style lang="less" scoped>
  .layout{
    margin-top: 15px;
    border: 1px dotted red;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .item{
      flex-grow: 1;
      border: 1px solid blue;;
      display: flex;
      justify-content: center;
      align-items: center;
      color: red;
      font-weight: bold;
      font-size: 50px;
    }
    .text{
      position: absolute;
      height: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center; 
    }
    .header{
      height: 15%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
    }
    .content{
      height: 30%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
    }
    .footer{
      height: 55%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
    }
  }
</style>

