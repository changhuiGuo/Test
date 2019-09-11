<template>
  <div class="overView">
    <div id="chart"></div>
    <div class="btn-box">
      <button :class="{active:mode==='day'}" @click="btnClick('day')">日</button>
      <button :class="{active:mode==='week'}" @click="btnClick('week')">周</button>
      <button :class="{active:mode==='month'}" @click="btnClick('month')">月</button>
    </div>
  </div>
</template>

<script>
// var echarts = require('echarts');
import echarts from 'echarts'
import api from '@/common/api.js'

export default {
  name: 'overView',
  data(){
    return{
      healthData: [],
      mode: 'day',
      chartData:[]
    }
  },
  created(){
    this.getData();
  },
  components: {
    
  },
  computed:{
    op(){
      let upColor = '#ec0000';
      let upBorderColor = '#8A0000';
      let downColor = '#00da3c';
      let downBorderColor = '#008F28';
      let data0 = splitData(this.chartData.reverse());

      function splitData(rawData) {
        var categoryData = [];
        var values = []
        for (var i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i])
        }
        return {
          categoryData: categoryData,
          values: values
        };
      }

      function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += parseFloat(data0.values[i - j][1]);
          }
          result.push((sum / dayCount).toFixed(1));
        }
        return result;
      }

      return{
        title: {
          text: '体重变化指数图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          top: 30,
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
          selected: {'日K':true, 'MA5':true, 'MA10':false, 'MA20':false, 'MA30':false}
        },
        grid: {
          left: '4%',
          right: '3%',
          bottom: '14%'
        },
        xAxis: {
          type: 'category',
          data: data0.categoryData,
          scale: true,
          boundaryGap : false,
          axisLine: {onZero: false},
          splitLine: {show: false},
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          },
          min: '60.0',
          max: '70.0'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            },
            markPoint: {
              label: {
                normal: {
                  formatter: function (param) {
                    return param != null ? Math.round(param.value) : '';
                  }
                }
              },
              data: [
                {
                  name: '体重最大值',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: '体重最小值',
                  type: 'min',
                  valueDim: 'lowest',
                  symbolRotate: '180',
                  label: {
                    offset: [0, 10]
                  }
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {opacity: 1}
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {opacity: 1}
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {opacity: 1}
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {opacity: 1}
            }
          },

        ]
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
      this.chartData = [];
      if(type==='day'){
        let date = this.healthData.map(item=>item.date).reverse();
        let weight = this.healthData.map(item=>item.weight).reverse();
        this.healthData.forEach((item,index)=>{
          // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
          if(index){
            this.chartData.push([item.date,this.healthData[index-1].weight,item.weight,this.healthData[index-1].weight,item.weight]);
          }else{
            this.chartData.push([item.date,item.weight,item.weight,item.weight,item.weight]);
          }
        })
      }else if(type==='week'){
        let splitData = [];
        let cnt = Math.floor(this.healthData.length/7);
        let cnt2 = this.healthData.length%7;
        for(var i=0;i<cnt;i++){
          splitData.push(this.healthData.slice(i*7,i*7+7));
        }
        if(cnt2){
          splitData.push(this.healthData.slice(i*7,i*7+cnt2));
        }

        splitData.forEach((item,index)=>{
          // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
          let temp = JSON.parse(JSON.stringify(item));
          temp.sort(function (a, b) {
            return a.weight-b.weight;
          });
          this.chartData.push([item[item.length-1].date,item[item.length-1].weight,item[0].weight,temp[0].weight,temp[item.length-1].weight]);
        })
      }else if(type==='month'){
        let splitData = [],
        splitMonth = Array.from(new Set(
          this.healthData.map(item=>item.date.substring(0,7))
        )).reverse();

        splitMonth.forEach((item,index)=>{
          let monthData = this.healthData.filter((sitem,sindex)=>{
            return sitem.date.substring(0,7) === item;
          })
          splitData.push(monthData);
        })

        splitData.reverse().forEach((item,index)=>{
          // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
          console.log(item[0].date,item[item.length-1].date);
          let temp = JSON.parse(JSON.stringify(item));
          temp.sort(function (a, b) {
            return a.weight-b.weight;
          });
          this.chartData.push([item[item.length-1].date,item[item.length-1].weight,item[0].weight,temp[0].weight,temp[item.length-1].weight]);
        })

        console.log('splitData',splitData);
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
