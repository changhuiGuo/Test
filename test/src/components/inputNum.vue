<template>
  <div class="content">
    <button class="add" @click="add">+</button>
    <input type="text" :value="currentValue" @change="inputChange">
    <button class="sub" @click="sub">-</button>
  </div>
</template>

<script>
export default {
  name:'inputNum',
  data(){
    return{
      currentValue:''
    }
  },
  props:["min","max","value"],
  mounted(){
    this.currentValue = this.value;
  },
  watch:{
    currentValue(newVal){
      console.log('newVal',newVal);
      this.$emit('input',newVal);
      this.$emit('on-change',newVal);
    }
  },
  methods:{
    inputChange(e){
      console.log('inputChange',e)
    },
    add(){
      if(this.max){
        this.currentValue<this.max?this.currentValue++:'';
      }else{
        this.currentValue++;
      }
    },
    sub(){
      if(this.min){
        this.currentValue>this.min?this.currentValue--:'';
      }else{
        this.currentValue--;
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    display: inline-block;
    .add{
      display: inline-block;
    }
    .sub{
      display: inline-block;
    }
    input{
      width:100px;
      margin:5px 1px;
      text-align: center;
    }
  }
</style>
