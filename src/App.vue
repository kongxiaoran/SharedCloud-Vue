<template>
  <div id="app">
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <myheader @sharePage="sharePage" @mainPage="mainPage" class="myheader" ></myheader>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #f7f7f7">
        <myslider @event="getMyEvent" @listMyShare="getListMyShare"></myslider>
      </a-layout-sider>
      <a-layout style="padding: 4px 15px 4px;background:#fff">
        <!-- <div class="buttons">
          <a-button type="primary" style="width:90px;"><a-icon type="upload"/> 上传</a-button>
          <a-button style="width:100px;" >新建文件夹</a-button>

          <a-button style="width:50px;float:right"><a-icon type="bars"/></a-button>
          <a-input-search
            placeholder="搜索您的文件"
            style="width: 240px;float:right;background:#f1f2f4;"
            @search="onSearch"
          />
        </div> -->

        <a-layout-content :style="{ background: '#fff', padding: '4px', margin: 0, minHeight: '480px' }">
          <index ref='index'></index>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  </div>
</template>
<style>
#components-layout-demo-top-side-2 .logo {
  width: 120px;
  height: 31px;
  background: rgba(255,255,255,.2);
  margin: 16px 28px 16px 0;
  float: left;
}

.header{
  background-color: white;
}

.buttons{
  float: left;
}


</style>

<script>
import myheader from '@/components/header.vue'
import myslider from '@/components/slider.vue'
import index from '@/components/index.vue'

export default {
  name: 'App',
  components: {
    index,
    myheader,
    myslider,
    key() {
        return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
  methods:{
    getMyEvent:function(type){
      this.$refs['index'].getByType(type);
    },
    getListMyShare:function(){
      this.$refs['index'].listMyShare();
    },
    sharePage:function(){
      this.$refs['index'].sharePage();
    },
    mainPage:function(){
      this.$refs['index'].listX('*');
    }
  }
}
</script>

<style>

.myheader{
  position:absolute;
  top:0%;
  left:0%;
  width: 100%;
  display:block;
  height: 90px;
  background-color: white;
  border-bottom:1px solid #87CEFA
}
.myslider{
  position:absolute;
  top:14%;
  float: left;
}

#app /deep/ .ant-layout-header{
  height: 91px;
}


</style>
