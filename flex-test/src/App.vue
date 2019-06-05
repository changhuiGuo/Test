<template>
  <div id="app">
    <router-link :to="{path:'/dice'}" style="margin-right:20px;">dice show</router-link>
    <router-link :to="{path:'/layout'}">layout show</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import dice from './components/dice.vue'

export default {
  name: 'app',
  components: {
    dice
  }
}
</script>
