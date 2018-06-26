<template>
  <div class="select">
    <div class="center">
      <mt-button @click="toEbay" type="default">ebay商品</mt-button>
      <mt-button @click="toSelf" type="default">自选商品</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectAddMode',
  data () {
    return {
      list: 80
    }
  },
  methods: {
    toEbay(){
      this.$router.push("/popularize/add")
    },
    toSelf(){
      this.$router.push("/popularize/self")
    },

  }
}
</script>

<style lang="scss" scoped>
  .center{
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    button{
      margin-bottom: 20px;
      width:200px;
    };
  }
</style>
