<template>
  <div class="hello">
  <h3 style="background: #fff;top: 0;width: 100%;
  position: fixed;z-index: 100;height: 50px;margin:0;">ljadlkjdljaldkfj</h3>
<mt-loadmore :top-method="loadTop" :bottom-method="loadB"   ref="loadmore" style="margin-top: 50px;">
  <ul>
    <li v-for="item in list">{{ list - item + 1 }}</li>
  </ul>
</mt-loadmore>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: 80
    }
  },
  methods: {
    loadTop() {
      setTimeout(() => {
        this.list += 5
        this.$refs.loadmore.onTopLoaded()
      }, 1000)

    },
    loadB() {
      setTimeout(() => {
        this.list += 5
        this.$refs.loadmore.onBottomLoaded()
      }, 1000)      
    }
  }
}
</script>

<style scoped>

</style>
