<template>
  <div>
    <pie-charts></pie-charts>
    <trend-charts></trend-charts>
    <collapsed-list></collapsed-list>
    <collapsed-table></collapsed-table>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import api from '@/common/api'
import pieCharts from '@/components/PieCharts'
import trendCharts from '@/components/TrendCharts'
import collapsedList from '@/components/CollapsedList'
import collapsedTable from '@/components/CollapsedTable'
export default {
  name: 'inCome',
  data() {
    return {
    }
  },
  components:{
    trendCharts,
    pieCharts,
    collapsedList,
    collapsedTable
  },
  created(){
    api.getIncomeData().then(res=>{
      this.setIncomeData(res.data)
    })
  },
  mounted(){
  },
  computed: {
  },
  methods: {
    ...mapMutations([
      'setIncomeData'
    ])
  }
}
</script>

<style lang="less">
  
</style>