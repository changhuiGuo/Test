<template>
  <div>
    <title-bar name="收入趋势图"></title-bar>
    <div class="chart-content">
      <p class="chart-period"></p>
      <canvas id="trendChart" width="360" height="260"></canvas> 
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import F2 from '@antv/f2';
import _ from 'lodash'
import titleBar from '@/components/TitleBar'
export default {
  name: 'trendCharts',
  props: ['sourceData'],
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
      this.initTrendCharts()
    }
  },
  computed: {
    ...mapState(['incomeData']),
    trendChartData(){
      let temp = []
      this.incomeData.forEach(item=>{
        for(var key in item){
          if(typeof(item[key])=="number"){
            temp.push({value: item[key],name: key,date: item['月份']})
          }
        }
      })
      return temp
    }
  },
  components: {
    titleBar 
  },
  methods: {
    initTrendCharts(){
      const chart = new F2.Chart({ 
          id: 'trendChart',
          padding: [85, 'auto', 'auto', 'auto'],
          pixelRatio: window.devicePixelRatio // 指定分辨率
      });
      chart.source(this.trendChartData, {
        date: {
          range: [ 0, 1 ],
          type: 'timeCat',
          mask: 'YYYY-MM'
        },
      });
      chart.tooltip({
        alwaysShow: true,
        showCrosshairs: true,
        custom: true, // 自定义 tooltip 内容框
        onChange: function onChange(obj) {
          const legend = chart.get('legendController').legends.top[0];
          const tooltipItems = obj.items;
          const legendItems = legend.items;
          const map = {};
          legendItems.forEach(function(item) {
            map[item.name] = _.clone(item);
          });
          tooltipItems.forEach(function(item) {
            const name = item.name;
            const value = item.value;
            if (map[name]) {
              map[name].value = value;
            }
          });
          document.querySelector('.chart-period').innerHTML = `${obj.items[0].title} 明细`
          legend.setItems(_.values(map));
        },
        onHide: function onHide() {
          const legend = chart.get('legendController').legends.top[0];
          legend.setItems(chart.getLegendItems().country);
        }
      });
      // 设置图例居中显示
      chart.legend({
        align: 'center',
        offsetY: 5,
        offsetX: -10,
        clickable: false,
        itemMarginBottom: 10,
        itemWidth: 150 // 图例项按照实际宽度渲染
      });
      chart.axis('date', {
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.area()
        .position('date*value')
        .color('name');
      chart.line()
        .position('date*value')
        .color('name');
      chart.render();
    }
  }
}
</script>

<style lang="less">
  .chart-content{
    text-align: center;
    background: #fff;
    .chart-period{
      min-height: 1px;
      margin-bottom: -16px;
    }
  }
</style>