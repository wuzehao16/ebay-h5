<template>
  <div class="container">
    <mt-field placeholder="标题 品牌 品牌类型都是买家喜欢搜索的" type="text" v-model="productNane"></mt-field>
    <mt-field placeholder="描述一下宝贝的细节或故事" type="textarea" rows="4" v-model="productMemo"></mt-field>

    <div class="upload">
      <div class="pic" v-for="(item,i) in picArray">
        <div class="delete" @click="removePic(i)">
          x
        </div>
          <img :src="item" alt="goods" height="80" width="80">
      </div>
      <vue-core-image-upload
      :class="['btn', 'btn-primary']"
      :crop="false"
      text="添加图片"
      input-of-file="file"
      @imageuploaded="imageuploaded"
      :data="data"
      :max-file-size="5242880"
      url="http://localhost:8089/sell/seller/upload" >
    </vue-core-image-upload>
    </div>

    <div class="page-part">
      <mt-field label="价格" placeholder="￥0.00" type="number" v-model="productPrice"></mt-field>
      <mt-field label="税费" placeholder="￥0.00" type="number" v-model="taxFee"></mt-field>
      <mt-field label="运费" placeholder="￥0.00" type="number" v-model="carriageFee"></mt-field>
    </div>
    <mt-cell title=" 商品类型(一级分类) " style="font-size:14px;margin-top:10px;"></mt-cell>
    <select class="select" v-model="categoryPid" placeholder="请选择">
      <option value='' disabled selected style='display:none;'>请选择</option>
      <option v-for="i in categoryList" :key="i.queue" :value="i.id">{{i.name}}</option>
    </select>
    <mt-cell title=" 商品类型（二级分类） " style="font-size:14px;"></mt-cell>
    <select class="select mg" v-model="productType" placeholder="请选择">
      <option value='' disabled selected style='display:none;'>请选择</option>
      <option v-for="i in categorySubList" :key="i.queue" :value="i.id">{{i.name }}</option>
    </select>
    <footer >
      <div class="submit" @click="submit">
        确实发布
      </div>
    </footer>
  </div>
</template>

<script>
import VueCoreImageUpload from 'vue-core-image-upload'
import { Toast, Indicator } from 'mint-ui'
import { reqSellerProductSave, reqCategoryList } from '../../api'
export default {
  name: 'SelfSelectGoods',
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
  },
  data () {
    return {
      data:{},
      productNane:"",
      productMemo: "",
      productStatus:"下架",
      productPic:"",
      picArray:[],
      carriageFee:"",
      taxFee:"",
      userWxOpenid: JSON.parse(sessionStorage.getItem('ebay-app')).userWxOpenid,
      productPrice:"",
      categoryList:[],
      categorySubList:[],
      productType:"",
      categoryPid:""
    }
  },
  methods: {
    validate() {
      if (!this.productNane) {
        Toast('请选择商品名称')
        return false
      }
      if (!this.productMemo || this.productMemo.match(/^[ ]*$/)) {
        Toast('请输入商品介绍')
        return false
      }
      if (!this.picArray.length > 1) {
        Toast('请上传两张及以上图片')
        return false
      }
      if (!this.productPrice) {
        Toast('请输入商品价格')
        return false
      }
      if (!this.taxFee) {
        Toast('请输入商品税费')
        return false
      }
      if (!this.carriageFee) {
        Toast('请输入商品运费')
        return false
      }
      if (!this.categoryPid || !this.productType) {
        Toast('请选择商品分类')
        return false
      }

      return true
    },
    submit(){
      if (!this.validate()) {
        return false
      }
      const {productNane,productMemo,productStatus,userWxOpenid,productType} = this;
      let data = {
        productNane,
        productMemo,
        productStatus,
        productIcon:this.picArray.slice(0,1),
        productPic:this.picArray.join("@"),
        carriageFee:parseInt(this.carriageFee),
        taxFee:parseInt(this.taxFee),
        productPrice:parseInt(this.productPrice),
        userWxOpenid,
        productType,
      }
      console.log(data)
      reqSellerProductSave(data).then((res) => {
        Indicator.close()
        if (res.data.code == 0) {
          let instance = Toast('提审成功')
          setTimeout(() => {
            instance.close()
            this.loading = false
            this.$router.push({
              name: 'PopularizeList',
              params: {
                justAdded: true
              }
            })
          }, 2000)
        } else {
          Toast(res.data.msg)
          this.loading = false
        }
      }).catch(err => {
        Indicator.close()
        Toast(err)
      })
    },
    removePic(i) {
      this.picArray.splice(i,1)
    },
    imageuploaded(res) {
      console.log(res)
      if (res.code == 0) {
        this.picArray.push(res.data);
      }
    },
    getCategoryList() {
      reqCategoryList({ pid: 0 }).then((res) => {
        this.categoryList = res.data.data;
      })
    },
    getCategorySubList() {
      reqCategoryList({ pid: this.categoryPid }).then((res) => {
        this.categorySubList = res.data.data;
      })
    },
  },
  mounted() {
    this.getCategoryList();
  },
  watch:{
    categoryPid(a) {
      this.productType = ''
      this.categorySubList = []
      this.getCategorySubList()
    },
  }
}
</script>

<style lang="scss" scoped>
.upload{
  background-color: #fff;
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
  .pic{
    position: relative;
    margin-right: 8px;
    .delete{
      position: absolute;
      top: 0;
      right: 0;
      height: 20px;
      width: 20px;
      text-align: center;
      border-radius: 10px;
      background-color: #f10215;
      color: #fff;
    }
  }
}
.btn{
  height: 80px;
  line-height: 80px;
  text-align: center;
  border:1px solid #eaeaea;
  width:  80px;
}
.page-part{
  margin-top: 15px;
}
.select {
  height: 40px;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  z-index: 10;
  font-size: 14px;
  padding: 0px 10px;
  display: block;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #FFFFFF;
  color: #333333;
  border-radius: 4px;
}
.mg{
  margin-bottom: 90px;
}
footer{
  background-color: #fff;
  position: absolute;
  bottom:50px;
  width: 100%;
}
.submit{
  width: 100%;
  margin: auto;
  height: 30px;
  background-color: #f10215;
  color:#fff;
  text-align: center;
  line-height: 30px;
}
</style>
