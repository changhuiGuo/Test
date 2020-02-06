<template>
  <div style="background:#f7f7f7;">
    <div class="hr1" :class="{'border-none':!hr}"></div>
    <div class="title-bar">
      <i></i>
      <span class="title-text">{{name}}</span>
      <span class="title-tip">{{tips}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'titleBar',
  props: {
    name:{
      type: String,
      required: true
    },
    tips:{
      type: String
    },
    hr:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return {

    }
  },
  created(){
  },
  methods: {

  }
}
</script>

<style lang="less">
  .border-none{
    border-width: 0px!important;
  }
  .title-bar{
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #ebebeb;
    background: #fff;
    text-align: left;
    margin-top: 10px;  
    color: #343434;
    i{
      width: 4px;
      height: 14px;
      display: inline-block;
      background: #4169e2;
      vertical-align: middle;
      margin-right: 8px;
    }
    .title-tip{
      float: right;
      color: #999;
      font-size: 12px;
    }
  }
</style>