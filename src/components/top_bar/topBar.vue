<template>
  <mt-navbar fixed class="topbar">
    <mt-tab-item >
      <router-link class="col" :to="{name: 'Hello'}">
      <span class="nd-p">首页</span>
    </router-link>
    </mt-tab-item>
    <mt-tab-item >
      <router-link class="col" :to="{name: 'PopularizeList'}" >
        <span class="nd-p"> 23</span>
      </router-link>
    </mt-tab-item>
  <mt-tab-item >
     <router-link class="col me-tab" :to="{name: 'profile'} ">
      <span class="nd-p">我的</span>
    </router-link>
  </mt-tab-item>
</mt-navbar>


</template>

<script>

export default {
  props: ['name'],
  data () {
    return {
      showAddsdMenu: false,
      showMenuWrap: false
    }
  },
  watch: {
    showAddsdMenu (val) {
      if (val) {
        this.showMenuWrap = true
      } else {
        setTimeout(() => {
          this.showMenuWrap = false
        }, 400)
      }
    }
  },
  methods: {
    toAddSd () {
      this.$router.push('')
    },
    i () {
      this.showAddsdMenu = false
    }
  }
}
</script>
<style scoped>
  .topbar{
    color:#000;
  }
</style>
