<template>
  <div>
    <el-button @click="getData">请求网络数据</el-button>
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
    getData(){
      // 添加响应拦截器
      this.axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response.data.data;
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });
      console.log('发送网络请求!');
      this.isLoading = true;
      this.axios.get('/api/weatherApi?city=深圳').then(res=>{
        console.log('请求成功!',res); 
        this.isLoading = false;
        this.listData = res;
      }).catch(err=>{
        this.isLoading = false;
        console.log('请求失败!',err);
      })
    },
    getMockData(){
       this.axios.get('/mock/data.json').then(res=>{
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
