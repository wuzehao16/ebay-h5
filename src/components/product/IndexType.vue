<template>
<div class="container index-container">
<mt-index-list class="type-list">
  <mt-index-section index="A">
    <mt-cell title="Aaron"></mt-cell>
    <mt-cell title="Alden"></mt-cell>
    <mt-cell title="Austin"></mt-cell>
  </mt-index-section>
  <mt-index-section index="B">
    <mt-cell title="Baldwin"></mt-cell>
    <mt-cell title="Braden"></mt-cell>
  </mt-index-section>
  <mt-index-section index="Z">
    <mt-cell title="Zack"></mt-cell>
    <mt-cell title="Zane"></mt-cell>
  </mt-index-section>
</mt-index-list>


<!-- <div class="left-w">
    <ul>
        <li>手机数码</li>
        <li>女装内衣</li>
        <li>男装内衣</li>
        <li>家用电器</li>
        <li>鞋靴箱包</li>
        <li>运动户外</li>
        <li>电脑办公</li>
        <li>个护化妆</li>
        <li>家具建材</li>
    </ul>
</div>
<div class="right-w"></div>-->
</div> 
</template>

<style lang="scss">
.index-container {
    background: #fff;
}
.type-list {
    .mint-indexlist-content{
        margin: 0 0 0 20vw!important;
    }
    .mint-indexlist-nav{
        max-width: 20vw;
        left: 0;
        right: initial;
        justify-content: flex-start;
        li {
            margin: 20px;
        }
    }
}
</style>