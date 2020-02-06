<template>
  <div>
    <title-bar name="总览" tips="数据截至：2018年5月 - 2020年1月" :hr="false"></title-bar>
    <div class="chart-content">
      <canvas id="pieChart" width="360" height="180"></canvas> 
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import F2 from '@antv/f2'
import titleBar from '@/components/TitleBar'
export default {
  name: 'pieCharts',
  props: [],
  data() {
    return {
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
    incomeData(val){
      this.initPieCharts()
    }
  },
  computed: {
    ...mapState(['incomeData']),
    pieChartData(){
      let temp = [];
      this.incomeData.forEach(item=>{
        for(var key in item){
          if(typeof(item[key])=="number"&&key!='总计'){
            let isPush = true;
            temp.forEach(sitem=>{
              if(sitem.name===key){
                isPush = false;
                sitem.money = parseFloat((sitem.money+item[key]).toFixed(2))
              }
            })
            isPush ? temp.push({a: '1',name: key,money: item[key]}) : '';
          }
        }
      })
      let map = {}, total = 0;
      temp.forEach(item=>{
        map[item.name] = '¥ ' + item.money;
        total += item.money;
      });
      return  {data: temp,map: map,total: total}
    },
  },
  components: {
    titleBar
  },
  methods: {
    initPieCharts(){
      const chart = new F2.Chart({
        id: 'pieChart',
        pixelRatio: window.devicePixelRatio,
        padding: [ 20, 'auto' ]
      });
      chart.source(this.pieChartData.data);
      chart.tooltip(false);
      chart.legend({
        position: 'right',
        clickable: false,
        itemFormatter:  (val) => {
          return val + '    ' + this.pieChartData.map[val];
        }
      });
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.85
      });
      chart.axis(false);
      chart.interval()
        .position('a*money')
        .color('name', [ '#F04864','#13C2C2','#2FC25B','#FACC14','#1890FF' ])
        .adjust('stack');

      chart.guide().html({
        position: [ '50%', '45%' ],
        html: `<div style="width: 250px;height: 40px;text-align: center;">
            <div style="font-size: 14px">总计</div>
            <div style="font-size: 18px">¥${this.pieChartData.total.toFixed(0)}</div>
          </div>`
      });
      chart.render();
    },
  }
}
</script>

<style lang="less">
  .chart-content{
    text-align: center;
    background: #fff;
  }
</style>