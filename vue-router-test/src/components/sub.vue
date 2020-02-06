<template>
  <div class="subView">
    <button @click="subCnt">sub</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'subCmp',
  props: {

  },
  methods:{
    ...mapMutations(
      ['sub']
    ),
    ...mapActions(
      { sub_actions: 'sub' }
    ),
    subCnt(){
      // this.$store.commit('sub',1)
      // this.$store.dispatch('sub',1)
      // this.sub(1)
      this.sub_actions(1)
    }
  }
}
</script>

<style scoped lang="less">

</style>
