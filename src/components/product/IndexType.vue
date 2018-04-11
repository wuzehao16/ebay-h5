<template>
  <div class="container index-container">
    <div class="left-w">
      <ul>
        <li v-for="(v, i) in typeArr" :class="{'type-is-active': (typeIndex == v.index)}" @click="findTheType(v)">
          {{ v.name }}</li>
      </ul>
    </div>
    <div class="right-w">
      <p>热门品类</p>
      <ul>
        <li>
          <img :src="staticBase + '/resource/temp/male.png'">
          <br/>男鞋
        </li>
        <li>
          <img :src="staticBase + '/resource/temp/female.png'">
          <br/>女鞋
        </li>
        <li>
          <img :src="staticBase + '/resource/temp/xiu.png'">
          <br/>休闲鞋
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { staticBase } from '../../api'
export default {
  data() {
    return {
      staticBase: staticBase,
      typeIndex: null,
      typeArr: []
    }
  },
  methods: {
    findTheType(v) {
        this.typeIndex = v.index
    }
  },
  activated() {
    this.typeArr = [{
      name: '手机数码',
      index: 1
    }, {
      name: '女装内衣',
      index: 2
    }, {
      name: '男装内衣',
      index: 3
    }, {
      name: '家用电器',
      index: 4
    }, {
      name: '鞋靴箱包',
      index: 5
    }, {
      name: '运动户外',
      index: 6
    }, {
      name: '电脑办公',
      index: 7
    }, {
      name: '个护化妆',
      index: 8
    }, {
      name: '家具建材',
      index: 9
    }, ]
    console.log('llll', this.$route)
    this.typeIndex = this.$route.params.index
  }
}

</script>
<style lang="scss">
.type-is-active {
  color: #ef4f4f;
}

.index-container {
  background: #fff;
  display: flex;
  .left-w {
    flex-shrink: 0;
    ul {
      overflow: auto;
      height: 100%;
      margin-bottom: 53px;
      li {
        margin: 8px 0 10px 6px;
      }
    }
  }
  .right-w {
    flex: 1;
    margin: 8px 0 0 20px;
    ul {
      list-style-type: none;
      display: flex;
      li {
        width: 33%;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}

</style>
