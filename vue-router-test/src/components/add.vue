<template>
  <div class="addView">
    <button @click="addCnt">add</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'addCmp',
  props: {

  },
  methods:{
    ...mapMutations([
      'add'
    ]),
    ...mapActions(
      { add_actions: 'add' }
    ),
    addCnt(){
      // this.$store.commit('add',1)
      // this.$store.dispatch('add',1)
      // this.add(1)
      this.add_actions(1)
    }
  }
}
</script>

<style scoped lang="less">

</style>
