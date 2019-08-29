<template>
  <div id="charts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "charts",
  data() {
    return {};
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "cross",
          //   crossStyle: {
          //     color: "#999"
          //   }
          // }
        },
        legend: {
          data: ["降水量", "平均温度"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "水量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value}%"
            }
          }
        ],
        series: [
          {
            name: "降水量",
            type: "bar",
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: "平均温度",
            type: "line",
            symbol:'circle',
            symbolSize:10,
            yAxisIndex: 1,
            lineStyle: {
              color: 'red',
              width: 2,
              type: 'solid',
            },
            itemStyle: {
              color: 'yellow',
              borderColor: 'blue',
              borderWidth: 2,
              borderType: 'solid',
            },
            emphasis:{
              itemStyle: {
                color: 'yellow',
                borderColor: 'blue',
                borderWidth: 2,
                borderType: 'solid',
              },
            },
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.querySelector("#charts"));
      // 绘制图表
      myChart.setOption(this.option);
      window.onresize = function(){
        myChart.resize();
      }
    }

  }
};
</script>


<style scoped lang="less">
  #charts{
    height:600px;
  }
</style>
