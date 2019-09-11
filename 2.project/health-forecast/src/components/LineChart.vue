<template>
  <div class="overView">
    <div id="chart">
    </div>
    <div class="btn-box">
      <button :class="{active:mode==='day'}" @click="btnClick('day')">日</button>
      <button :class="{active:mode==='week'}" @click="btnClick('week')">周</button>
      <button :class="{active:mode==='month'}" @click="btnClick('month')">月</button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import api from '@/common/api.js'

export default {
  name: 'overView',
  data(){
    return{
      healthData: [],
      mode: 'day',
      chartData:{
        date: [],
        month: [],
      }
    }
  },
  created(){
    this.getData();
  },
  components: {
    
  },
  computed:{
    op(){
      return{
        grid:{
          left: '4%',
          right: '3%'
        },
        title:{
          text: '体重变化趋势图',
          top: 5,
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.chartData.date
        },
        yAxis: {
          type: 'value',
          min: '60.0',
          max: '70.0'
        },
        series: [{
          data: this.chartData.weight,
          type: 'line',
          markPoint: {
            data: [
              {
                name: '体重最大值',
                type: 'max'
              }, 
              {
                name: '体重最小值',
                type: 'min',
                symbolRotate: '180',
                label: {
                  offset: [0, 10]
                }
              }, 
            ],
          }
        }],
        tooltip:{
          show: true,
          trigger: 'axis',
          formatter: '日期: {b}<br>体重: {c} Kg'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
          }
        ],
      }
    }
  },
  methods:{
    getData(){
      api.getHealthData().then((res)=>{
        console.log('query res',res);
        this.healthData = res;
        this.btnClick('day');
        this.initCharts();
      })
    },
    initCharts(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('chart'));
      // 绘制图表
      myChart.setOption(this.op);
    },
    btnClick(type){
      this.mode = type;
      if(type==='day'){
        this.chartData.date = this.healthData.map(item=>item.date).reverse();
        this.chartData.weight = this.healthData.map(item=>item.weight).reverse();
      }else if(type==='week'){
        this.chartData.date = [];
        this.chartData.weight = [];
        let splitData = [];
        let cnt = Math.floor(this.healthData.length/7);
        let cnt2 = this.healthData.length%7;
        for(var i=0;i<cnt;i++){
          splitData.push(this.healthData.slice(i*7,i*7+7));
        }
        if(cnt2){
          splitData.push(this.healthData.slice(i*7,i*7+cnt2));
        }
        splitData.reverse().forEach((item,index)=>{
          this.chartData.date.push(item[0].date);
        })
        let splitWeight = splitData.map(item=>item.map(sitem=>sitem.weight));
        splitWeight.forEach((item,index)=>{
          let averAge = (item.reduce((preValue, curValue) => parseFloat(preValue) + parseFloat(curValue)) / item.length);
          this.chartData.weight.push(averAge.toFixed(1));
        })
      }else if(type==='month'){
         this.chartData.date = Array.from(new Set(
          this.healthData.map(item=>item.date.substring(0,7))
        )).reverse();
        this.chartData.weight = [];
        this.chartData.date.forEach((month,index)=>{
          let splitMonth = this.healthData.filter((item,index) => item.date.includes(month));
          let splitWeight = splitMonth.map(item=>item.weight).reverse();
          let averAge = (splitWeight.reduce((preValue, curValue) => parseFloat(preValue) + parseFloat(curValue)) / splitWeight.length);
          this.chartData.weight.push(averAge.toFixed(1));
        })
      }

      this.initCharts();
    }
  }
}
</script>

<style lang="less" scoped>
  .overView{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    #chart{
      width: 100%;
      height: 100%;
    }
    .btn-box{
      padding: 15px;
      position: absolute;
      top: 0;
      right: 100px;
      button{
        margin-right: 15px;
        &.active{
          color: red;
          background-color: #eee;
        }
      }
    }
  }
</style>
