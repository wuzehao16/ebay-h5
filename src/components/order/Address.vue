<template>
<div class="container">

<mt-field label="收货人" v-model="addForm.cneeName" placeholder="请输入收货人姓名" ></mt-field>
<mt-field label="手机号" v-model="addForm.cneePhone" placeholder="请输入收货人手机号码" type="tel"></mt-field>
<mt-field label="身份证号" v-model="addForm.cneeIdcard" placeholder="请输入收货人身份证号" type="tel"></mt-field>
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
  <mt-button type="default" size="large" style="margin-bottom: 8px;" @click="setDefault" v-if="isEdit">设为默认地址</mt-button>
  <mt-button type="danger" size="large" @click="deleteSubmit" v-if="isEdit">删除地址</mt-button>  
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
.address-details {
  .mint-cell-title {
    margin-top: -50px;
  }
}
.address-info {
  color: gray;
  padding-left: 10px;
  padding-top: 5px;
  font-size: 14px;
}
.input-address {
  .mint-cell-title {
    color: #999;
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
import { reqAddressCreate, reqAddressDelete, reqAddressJson } from "../../api";
import { Toast, Indicator } from "mint-ui";
export default {
  name: "address",
  data() {
    return {
      addrJson: {},
      isEdit: false,
      popupVisible: false,
      popupVisible2: false,
      popupVisible3: false,
      popupVisible4: false,
      addForm: {
        cneeAddress: "",
        cneeName: "",
        cneePhone: "",
        cneeIdcard: "",
        userId: "",
        isDefaute: "N"
      },
      addForm_bak: {},
      companyName: "",
      addressSlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      citySlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      xianSlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      streetSlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      addressProvince: "",
      addressCity: "",
      addressXian: "",
      addressStreet: "",
      addressDetail: "",
      initFlag: 0
    };
  },
  methods: {
    deleteSubmit() {
      let obj = {
        id: this.addForm.id,
        isDelete: "Y"
      }
      Indicator.open({
        spinnerType: 'fading-circle'
      })      
      reqAddressDelete(obj).then(res => {
        Indicator.close()
        if (res.data.code == 0) {
          Toast({
            message: "删除成功,即将返回",
            iconClass: "icon icon-success"
          })
          let _this = this
          setTimeout(function() {
            _this.$router.push({
                name: 'AddressList',
                params: {
                   needRefresh: true
                }
            })
          }, 2000)  
        } else {
          Toast(res.data.msg)
        }

      }).catch((err) => {})
    },
    validateForm() {
      if (this.addForm.cneeName.match(/^[ ]*$/)) {
        Toast({
          message: "请输入收货人姓名",
          position: "top"
        })
        return false
      }
      if (!/^1[3|4|5|7|8]\d{9}$/.test(this.addForm.cneePhone)) {
        Toast({
          message: "请输入正确手机号",
          position: "top"
        })
        return false
      }
      if ( !/(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$)/.test(this.addForm.cneeIdcard) ){
        Toast({
          message: "请输入正确身份证号码",
          position: "top"
        })
        return false    
      }
      if (!this.addressProvince ||!this.addressCity ||!this.addressXian||!this.addressStreet||this.addressProvince.match(/^[ ]*$/)||this.addressCity.match(/^[ ]*$/)||this.addressXian.match(/^[ ]*$/)||this.addressStreet.match(/^[ ]*$/)) {
        Toast({
          message: "请输入收货人地址",
          position: "top"
        })
        return false
      }
      if (this.addressDetail.match(/^[ ]*$/)) {
        Toast({
          message: "请输入收货详细地址",
          position: "top"
        })
        return false
      }
      return true
    },
    setDefault () {
      this.addForm.isDefaute = "Y"
      this.addressSubmit()
    },
    addressSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.addForm.cneeAddress =
        this.addressProvince +
        "@" +
        this.addressCity +
        "@" +
        this.addressXian +
        "@" +
        this.addressStreet +
        "@" +
        this.addressDetail;
      Indicator.open({
        spinnerType: 'fading-circle'
      })           
      reqAddressCreate(this.addForm).then(res => {
        Indicator.close()
        if (res.data.code == 0) {
          let i = Toast({
            message: "操作成功,即将返回",
            iconClass: "icon icon-success"
          })
          let _this = this
          setTimeout(function() {
            _this.$router.push({
                name: 'AddressList',
                params: {
                   needRefresh: true
                }
            })
          }, 2000)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    onProvinceChange(picker, values) {
      if (this.initFlag++ > 1) {
        this.addressProvince = values[0]
      }
      this.addressCity = ""
      this.addressXian = ""
      this.addressStreet = ""
    },
    touchCity() {
      if (this.addressProvince) {
        this.citySlots[0].values = Object.keys(this.addrJson[this.addressProvince]);
        this.popupVisible2 = true;
      } else {
        Toast({
          message: "请选择省份",
          position: "bottom",
          duration: 1000
        });
      }
    },
    touchXian() {
      if (this.addressCity) {
        let xianObj = this.addrJson[this.addressProvince][this.addressCity];
        this.xianSlots[0].values = Object.keys(xianObj);
        this.popupVisible3 = true;
      } else {
        Toast({
          message: "请选择市",
          position: "bottom",
          duration: 1000
        });
      }
    },
    touchStreet() {
      if (this.addressXian) {
        let streetObj =
          this.addrJson[this.addressProvince][this.addressCity][this.addressXian];
        this.streetSlots[0].values = streetObj;
        this.popupVisible4 = true;
      } else {
        Toast({
          message: "请选择区/县",
          position: "bottom",
          duration: 1000
        });
      }
    },
    onCityChange(p, v) {
      this.addressCity = v[0];
      this.addressXian = "";
      this.addressStreet = "";
    },
    onXianChange(p, v) {
      this.addressXian = v[0];
      this.addressStreet = "";
    },
    onStreetChange(picker, values) {
      this.addressStreet = values[0];
    }
  },
  activated() {
    setTimeout(() => {
      Indicator.close()
    }, 400)
    this.addForm.userId = JSON.parse(sessionStorage.getItem('ebay-app')).id
    if (this.$route.params.address_info) {
      this.addForm = this.$route.params.address_info;
      let arr = this.addForm.cneeAddress.split("@");
      this.addressProvince = arr[0];
      this.addressCity = arr[1];
      this.addressXian = arr[2];
      this.addressStreet = arr[3];
      this.addressDetail = arr[4];
      this.isEdit = true;
    }
  },
  deactivated() {
    this.addForm = Object.assign({}, this.addForm_bak)
    this.addressProvince = ""
    this.addressCity = ""
    this.addressXian = ""
    this.addressStreet = ""
    this.addressDetail = ""    
  },
  mounted() {
    this.addForm_bak = Object.assign({}, this.addForm)

    reqAddressJson().then((res) => {
      this.addrJson = res.data
      this.addressSlots[0].values = Object.keys(res.data)
    }).catch(err => {})
  }
};
</script>
