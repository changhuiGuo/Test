<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="value">
    <button @click="hanleClick">搜索</button>
    <!-- <ul class="list"> -->
      <transition-group tag="ul" class="list" name="fade">
        <li v-for="(item,index) in searchData" :key="item.id">
          {{item.msg}}
          <button @click="delList(index)">删除</button>
        </li>
      </transition-group>
    <!-- </ul> -->

    <router-link to='/about/1'>子组件1</router-link>
    <router-link to='/about/2'>子组件2</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'about',
  data(){
    return{
      value: '',
      searchKey: '',
      searchData: [],
      listData: [
        { id: 1, msg: '列表1' },
        { id: 2, msg: '列表2' },
        { id: 3, msg: '列表3' },
        { id: 4, msg: '列表4' },
        { id: 5, msg: '列表5' },
        { id: 6, msg: '列表6' },
      ]
    }
  },
  created(){
    this.searchData = this.listData;
  },
  computed:{
    ...mapState({
      list: state=>state.list
    }),
    // searchData(){
    //   return this.listData.filter(item=>item.msg.includes(this.searchKey))
    // }
  },
  methods:{
    hanleClick(){
      // this.searchKey = this.value;
      this.searchData = this.listData.filter(item=>item.msg.includes(this.value))
    },
    delList(index){
      this.listData.splice(index,1);
    }
  }
}
</script>>

<style lang="less" scoped>
  .list{
    li{
      width: 100px;
      height: 50px;
      background: #ccc;
      list-style: none;
      margin: 5px auto;
    }
  }
</style>