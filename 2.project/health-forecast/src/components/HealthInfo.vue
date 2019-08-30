<template>
  <div class="healthInfoView">
    <button @click="insertData()">增</button>
    <button @click="deleteData()">删</button>
    <button @click="updateData()">改</button>
    <button @click="queryData()">查</button>
  </div>
</template>

<script>
import api from '@/common/api.js'
export default {
  name:'HealthInfo',
  data(){
    return{ 

    }
  },
  created(){

  },
  mounted(){

  },
  methods:{
    insertData(){
      api.insertHealthData().then((res)=>{
        console.log('insert res',res);
      })
    },
    deleteData(){
      api.deleteHealthData().then((res)=>{
        console.log('delete res',res);
      })
    },
    updateData(){
      api.updateHealthData().then((res)=>{
        console.log('update res',res);
      })
    },
    queryData(){
      api.getHealthData().then((res)=>{
        console.log('query res',res);
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .healthInfoView{
    button{
      margin-right: 8px;
    }
  }
</style>