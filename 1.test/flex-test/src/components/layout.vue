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
    padding: 15px;
    .item{
      flex-grow: 1;
      border: 1px solid blue;;
      display: flex;
      justify-content: center;
      align-items: center;
      color: blue;
      font-weight: bold;
      font-size: 20px;
    }
    .text{
      position: absolute;
      height: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center; 
      color: green;
    }
    .header{
      height: 15%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
      padding: 10px;
    }
    .content{
      height: 30%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
      padding: 10px;
    }
    .footer{
      height: 55%;
      display: flex;
      justify-content: space-around;
      border: 1px solid green;
      flex-grow: 1;
      position: relative;
      padding: 10px;
    }
    @media screen and (min-width: 300px) {
    .item{
          font-size:30px;
      }
    }
    @media screen and (min-width: 400px) {
    .item{
          font-size:35px;
      }
    }
    @media screen and (min-width: 500px) {
    .item{
          font-size:40px;
      }
    }
    @media screen and (min-width: 600px) {
    .item{
          font-size:45px;
      }
    }
    @media screen and (min-width: 700px) {
    .item{
          font-size:50px;
      }
    }
    @media screen and (min-width: 800px) {
    .item{
          font-size:55px;
      }
    }
    @media screen and (min-width: 900px) {
    .item{
          font-size:60px;
      }
    }
  }
</style>

