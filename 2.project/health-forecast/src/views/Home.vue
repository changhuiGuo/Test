<template>
  <div class="home">
    <div class="title">体重大数据分析系统</div>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right" >
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item class="active-breadcrumb">{{$route.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="nav-menu">
      <el-menu default-active="1-2" class="nav-el-menu" 
      background-color="#303133"
      text-color="#ffffff"
      @open="handleOpen" 
      @close="handleClose" 
      @select="handleSelect"
      :collapse="isCollapse">
        <i :class="[isCollapse ? 'el-icon-d-arrow-right':'el-icon-d-arrow-left']" class="fold" @click="isCollapse=!isCollapse"></i>
        <el-menu-item index="lineChart">
          <i class="el-icon-s-marketing"></i>
          <span slot="title"> 折线图 </span>
        </el-menu-item>
        <el-menu-item index="kChart">
          <i class="el-icon-data-analysis"></i>
          <span slot="title"> K线图 </span>
        </el-menu-item>
        <!-- <el-menu-item index="userInfo">
          <i class="el-icon-menu"></i>
          <span slot="title">用户信息</span>
        </el-menu-item> -->
        <el-menu-item index="setting">
          <i class="el-icon-edit"></i>
          <span slot="title">大数据</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">待建设</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from '@/common/api.js'
export default {
  name:'home',
  data(){
    return{ 
      isCollapse: true
    }
  },
  created(){

  },
  mounted(){

  },
  methods:{
    handleSelect(index, indexPath){
      this.$router.push(`/home/${index}`);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="less">
  .home{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .title{
      font-size: 26px;
      font-weight: bold;
      background-color: #545c64;
      color: #fff;
      text-align: center;
    }
    .breadcrumb{
      padding: 0 0 10px 50px;
      background:#545c64;
      box-sizing: border-box;
      /deep/ .el-breadcrumb__inner{
        font-size: 18px;
        color:#fff;
      }
      .active-breadcrumb{
        .el-breadcrumb__inner{
          color: #409EFF;
        }
      }
    }
    .nav-menu{
      width: 50px;
      height: calc(~'100% - 63px');
      background: #303133;
      float: left;
      .nav-el-menu{
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        border-right: solid 1px #424320;
        z-index: 999;
        &:not(.el-menu--collapse) {
          width: 200px;
          min-height: 400px;
        }
        li{
          .el-submenu__title,.el-tooltip{
            padding: 0!important;
            i{
              font-size: 26px;
            }
          }
        }
      }
      .fold{
        position: absolute;
        top:48%;
        right:-1px;
        color: #ffd04b;
        font-size: 18px;
        z-index: 999999;
      }
    }
    .content-box{
      width: calc(~'100% - 50px');
      height: calc(~'100% - 63px');
      box-sizing: border-box;
      float: right;
    }
  }
</style>