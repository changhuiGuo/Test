<template>
  <div id="app" @scroll="scrollChange">
    <home></home>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import home from '@/views/Home'
export default {
  name: "App",
  data(){
    return{
    }
  },
  components: {
    home
  },
  methods:{
    ...mapMutations(['getScrollTop']),
    scrollChange(e){
      this.getScrollTop(e.target.scrollTop)
    }
  }
}
</script>

<style lang="less">
html body #app{
  height: 100%;
  overflow: auto;
}
</style>
