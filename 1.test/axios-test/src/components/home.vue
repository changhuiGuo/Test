<template>
  <div>
    <el-button @click="getWeatherData">请求网络数据</el-button>
    <el-button @click="getMockData">请求模拟数据</el-button>
    <hr>
    <el-card class="box-card" v-loading='isLoading'>
      <h3>{{listData.city}}</h3>
      <div v-for="(item,index) in listData.forecast" :key="index" class="text item">
        {{item.date}}----{{item.type}}----{{item.high}}----{{item.low}}
      </div>
      <p>{{listData.ganmao}}</p>
    </el-card>
  </div>
</template>

<script>
import api from '@/common/api.js'
export default {
  name: 'home',
  data(){
    return{
      activeNames: ['1'],
      isLoading:false,
      listData:{}
    }
  },
  methods:{
    handleChange(val) {
      console.log(val);
    },
    getWeatherData(){
      this.isLoading = true;
      api.getWeatherInfo({city:'深圳'}).then((res)=>{
        console.log('请求成功!',res); 
        this.isLoading = false;
        this.listData = res.data;
      }).catch(err=>{
        this.isLoading = false;
        console.log('请求失败!',err);
      })
    },
    getMockData(){
      api.getAllCity().then((res)=>{
      //  api.getMockData().then(res=>{
        console.log('模拟数据请求成功!',res); 
      }).catch(err=>{
        console.log('模拟数据请求失败!',err);
      })
    }
  }
}
</script>

<style scoped>

</style>
