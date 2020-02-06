<template>
  <div>
    <title-bar name="年度概览"></title-bar>
    <ul class="collapse ulList">
      <li class="ulList-title">
        <div class="weui-flex__item">
          <span>年度</span>
          <span>任职公司</span>
          <span>年收入(¥)</span>
        </div>
      </li>
      <li :class="{'js-show':collapseShow.includes(item['年度'])}" v-for="(item,index) in collapseData" :key="index">
        <div class="weui-flex js-category" @click="showCollapse(item)">
          <div class="weui-flex__item">
            <span>{{item['年度']}}年</span>
            <img src="../assets/images/弘驰智能.jpg" width="35px" alt="" v-if="item['单位'].includes('东莞弘驰智能有限公司')">
            <img src="../assets/images/中软国际.jpg" width="50px" alt="" v-if="item['单位'].includes('深圳中软国际软件有限公司')">
            <span class="collapse-total">{{item['总计']}}</span>
          </div>
          <i class="icon" :class="[collapseShow.includes(item['年度'])?'icon-35':'icon-74']"></i>
        </div>
        <div class="page-category js-categoryInner">
          <div class="weui-cells page-category-content">
            <div class="category-content">
              <p>
                <span>补发:</span> 
                <span>{{item['补发']}}</span>
              </p>
              <p>
                <span>个人社保:</span> 
                <span>{{item['个人社保']}}</span>
              </p>
              <p>
                <span>个人公积金:</span> 
                <span>{{item['个人公积金']}}</span>
              </p>
              <p>
                <span>个人所得税:</span> 
                <span>{{item['个人所得税']}}</span>
              </p>
              <p>
                <span>实发工资:</span> 
                <span>{{item['实发工资']}}</span>
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import titleBar from '@/components/TitleBar'
export default {
  name: 'collapsedList',
  props: [],
  data(){
    return{
      collapseShow: '',
    }
  },
  computed: {
    ...mapState(['incomeData']),
    collapseData(){
      let temp = [];
      this.incomeData.forEach(item=>{
        let year = item['月份'].substring(0,4);
        let pushInx = 0;
        temp.forEach((sitem,sindex)=>{
          if(sitem['年度']===year){
            pushInx = sindex+1
          }
        })
        if(pushInx){
          temp[pushInx-1]['年度'] = year;
          temp[pushInx-1]['补发'] = parseFloat((temp[pushInx-1]['补发'] + item['补发']).toFixed(2));
          temp[pushInx-1]['个人社保'] = parseFloat((temp[pushInx-1]['个人社保'] + item['个人社保']).toFixed(2));
          temp[pushInx-1]['个人公积金'] = parseFloat((temp[pushInx-1]['个人公积金'] + item['个人公积金']).toFixed(2));
          temp[pushInx-1]['个人所得税'] = parseFloat((temp[pushInx-1]['个人所得税'] + item['个人所得税']).toFixed(2));
          temp[pushInx-1]['实发工资'] = parseFloat((temp[pushInx-1]['实发工资'] + item['实发工资']).toFixed(2));
          temp[pushInx-1]['单位'].includes(item['单位']) ? '': temp[pushInx-1]['单位'] += ','+item['单位'];
          temp[pushInx-1]['总计'] = parseFloat((temp[pushInx-1]['补发'] + temp[pushInx-1]['个人社保'] + temp[pushInx-1]['个人公积金'] + temp[pushInx-1]['个人所得税'] + temp[pushInx-1]['实发工资']).toFixed(0));
        }
        else{
          temp.push({
            '年度': year,
            '补发': item['补发'],
            '个人社保': item['个人社保'],
            '个人公积金': item['个人公积金'],
            '个人所得税': item['个人所得税'],
            '实发工资': item['实发工资'],
            '单位': item['单位'],
            '总计': item['总计']
            });
        }
      })
      return temp
    }
  },
  components: {
    titleBar
  },
  methods: {
    showCollapse(item){
      this.collapseShow.includes(item['年度']) ? 
      this.collapseShow = this.collapseShow.replace(item['年度'],'') :
      this.collapseShow += item['年度']
    },
  }
}
</script>

<style lang="less">
  .ulList{
    margin-bottom: -10px;
    background: #fff;
    .ulList-title{
      margin-bottom: -5px;
      span{
        display: inline-block;
        text-align: center;
        color: #999!important;
        font-size: 12px;
        &:first-child{
          float: left;
          margin-top: 5px; 
          margin-left: 20px;
          margin-right: 35px;
        }
        &:last-child{
          float: right;
          margin-top: 5px; 
          margin-right: 36px!important;
        }
      }
    }
    li{
      margin: 0;
      .weui-flex__item{
        span:last-child{
          color: red;
        }
        img{
          vertical-align: middle;
          margin-left: 10px;
        }
        .collapse-total{
          float: right;
          margin-right: 10px;
        }
      }
      .category-content{
        padding: 0 15px;
        p{
          display: inline-block;
          width: 50%;
          span:first-child{
            color: #999;
            display: inline-block; 
            width: 50%;
            text-align: right;
            font-size: 12px;
          } 
          span:last-child{
            color: #343434;
            padding-left: 8px;
            font-size: 14px;
          }
        }
        p:nth-child(odd){
          float: left;
        }
        p:nth-child(even){
          float: right;
        }
      }
    }
  }
</style>