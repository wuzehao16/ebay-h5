<template>
<div class="container">

<mt-field label="收货人" v-model="addForm.cneeName" placeholder="请输入收货人姓名" ></mt-field>
<mt-field label="手机号" v-model="addForm.cneePhone" placeholder="请输入收货人手机号码" type="tel"></mt-field>

<mt-field label="省" placeholder="请选择省份" class="input-address" 
  v-model="addressProvince" >
  <div @click="popupVisible = true"></div>
</mt-field>
<mt-field label="市" placeholder="请选择市" class="input-address" 
  v-model="addressCity" >
  <div @click="touchCity"></div>
</mt-field>
<mt-field label="区/县" placeholder="请选择区/县" class="input-address" 
  v-model="addressXian" >
  <div @click="touchXian"></div>
</mt-field>
<mt-field label="乡镇/街道" placeholder="请选择乡镇/街道" class="input-address" 
  v-model="addressStreet">
  <div @click="touchStreet"></div>
</mt-field>
<mt-field label="详细地址" v-model="addressDetail" placeholder="请输入详细地址" 
  rows="3" type="textarea" class="address-details"></mt-field>

<div class="address-info">详细地址需填写楼栋层或房间号信息</div>

<div style="margin: 10px;">
  <mt-button type="primary" size="large" style="margin-bottom: 8px;" @click="addressSubmit">确认</mt-button>
  <mt-button type="default" size="large" @click="deleteSubmit" v-if="isEdit">删除地址</mt-button>
</div>
<!-- 省 -->
<mt-popup class="popup-width"
  v-model="popupVisible"
  position="bottom">
  <mt-picker :slots="addressSlots" class="picker"
    @change="onProvinceChange" :visible-item-count="5" >
  </mt-picker >
</mt-popup>

<!-- 市 -->
<mt-popup class="popup-width"
  v-model="popupVisible2"
  position="bottom">
  <mt-picker :slots="citySlots" class="picker"
    @change="onCityChange" :visible-item-count="5" >
  </mt-picker >
</mt-popup>

<!-- 区/县 -->
<mt-popup class="popup-width"
  v-model="popupVisible3"
  position="bottom">
  <mt-picker :slots="xianSlots" class="picker"
    @change="onXianChange" :visible-item-count="5" >
  </mt-picker >
</mt-popup>

<!-- 乡镇/街道 -->
<mt-popup class="popup-width" v-model="popupVisible4" position="bottom">
  <mt-picker :slots="streetSlots" ref="picker" class="picker"
     @change="onStreetChange" :visible-item-count="5" >
  </mt-picker >
</mt-popup>
</div>
</template>

<style lang="scss">
.address-details{
  .mint-cell-title{
    margin-top: -50px;
  }
}
.address-info{
   color: gray;
   padding-left:10px;
   padding-top: 5px;
   font-size: 14px;
}
.input-address {
  .mint-cell-title{
    color:#999;
  }
  .mint-field-other {
    position: absolute;
    height: 100%;
    width: 100%;
    div {
      height: 100%;
    }
  }
}
.popup-width {
  width: 100%;
}
</style>

<script>
import s from '@/assets/address4.json'
import {reqAddressCreate, reqAddressDelete} from '../../api'
import { Toast } from 'mint-ui'
  export default {
    name: 'address',
    data () {
      return {
        isEdit: false,
        popupVisible: false,
        popupVisible2: false,
        popupVisible3: false,
      	popupVisible4: false,
        addForm: {
          cneeAddress: '',
          cneeName: '',
          cneePhone: '',
          userId: JSON.parse(sessionStorage.getItem('ebay-app')).id
        },
        companyName:'',
        addressSlots: [
          {
            flex: 1,
            values: Object.keys(s),
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        citySlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        xianSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        streetSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        addressProvince: '',
        addressCity: '',
        addressXian: '',
        addressStreet: '',
        addressDetail: ''
        
      }
    },
    methods: {
      deleteSubmit () {

        let obj = {
          id: this.addForm.id,
          isDelete: 'Y'
        }
        reqAddressDelete(obj).then((res) => {
          Toast({
            message: '删除成功,即将返回',
            iconClass: 'icon icon-success'
          })
          let _this = this
          setTimeout(function() {
            _this.$router.push("/order/addresslist")
          }, 2000)           
        })

       
      },
      addressSubmit () {
        this.addForm.cneeAddress = this.addressProvince + '@' + this.addressCity + '@' +
              this.addressXian + '@' + this.addressStreet + '@' + this.addressDetail
        reqAddressCreate(this.addForm).then((res) => {
          let i = Toast({
            message: '操作成功,即将返回',
            iconClass: 'icon icon-success'
          })
          let _this = this
          setTimeout(function() {
            _this.$router.push("/order/addresslist")
          }, 2000)          
        })
      },
      onProvinceChange(picker, values) {
        this.addressProvince = values[0]
        this.addressCity = ''
        this.addressXian = ''
        this.addressStreet = ''
      },
      touchCity () {
        if (this.addressProvince) {
          this.citySlots[0].values = Object.keys(s[this.addressProvince])
          this.popupVisible2 = true
        } else {
          Toast({
            message: '请选择省份',
            position: 'bottom',
            duration: 1000
          })
        }
      },
      touchXian () {
        if (this.addressCity ) {
          let xianObj = s[this.addressProvince][this.addressCity]
          this.xianSlots[0].values = Object.keys(xianObj)
          this.popupVisible3 = true
        } else {
          Toast({
            message: '请选择市',
            position: 'bottom',
            duration: 1000
          })
        }
      },
      touchStreet () {
        if (this.addressXian) {
          let streetObj = s[this.addressProvince][this.addressCity][this.addressXian]
          this.streetSlots[0].values = streetObj
          this.popupVisible4 = true
        } else {
          Toast({
            message: '请选择区/县',
            position: 'bottom',
            duration: 1000
          })          
        }
      },
      onCityChange(p, v) {
        this.addressCity = v[0]
        this.addressXian = ''
        this.addressStreet = ''        
      },
      onXianChange(p, v) {
        this.addressXian = v[0]
        this.addressStreet = ''
      },
      onStreetChange(picker, values){
        this.addressStreet = values[0]
      },
    },
    watch: {

    },
    created(){
     
    },
    mounted(){
      if (this.$route.params.address_info) {
        this.addForm = this.$route.params.address_info
        let arr = this.addForm.cneeAddress.split('@')
        this.addressProvince = arr[0]
        this.addressCity = arr[1]
        this.addressXian = arr[2]
        this.addressStreet = arr[3]
        this.addressDetail = arr[4]
        this.isEdit = true
      }
    }
  }
</script>
