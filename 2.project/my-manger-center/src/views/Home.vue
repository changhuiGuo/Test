<template>
  <div class="body">
    <header class="weui-tab">
      <div class="weui-navbar">
        <div class="weui-navbar__item" :class="{'tab-blue': navData.active===item.nameCn}" 
        v-for="item in navData.list" :key="item.id" @click="navClick(item)">
          {{item.nameCn}}
        </div>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return{
      navData: {
        active: '',
        list: [
          {nameCn: '收入',nameEn: 'InCome',id: 1},
          {nameCn: '负债',nameEn: 'Debts',id: 2}
        ]
      },
    }
  },
  components: {
  },
  created(){
    this.navData.active = this.$route.name==='InCome'?'收入':'负债'
  },
  methods: {
    navClick(item){
      this.navData.active = item.nameCn;
      this.$router.push({path:`/${item.nameEn}`})
    }
  }
}
</script>

<style lang="less">
  .body{
    background: #f7f7f7;
    padding-bottom: 100px; 
    header{
      height: 54px!important;
      .weui-navbar{
        .weui-navbar__item{
          background: #fff!important;
          &.tab-blue{
            color: #4169e2!important;
            border-bottom-color: #4169e2!important;
          }
        }
      }
    }
  }
</style>
