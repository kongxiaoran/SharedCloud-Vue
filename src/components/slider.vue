<template>
<div>
  <a-menu
    mode="inline"
    :openKeys="openKeys"
    @openChange="onOpenChange"
    style="width: 200px;background:#f7f7f7"
    :defaultSelectedKeys="['1']"
  >
    <a-menu-item key="1" @click="getByType(['*'])"><a-icon type="cloud"/>全部文件</a-menu-item>
    <a-menu-item key="2" @click="getByType(['png','jpg','jpeg','gif','psd','swf','svg','bmp'])">图片</a-menu-item>
    <a-menu-item key="3" @click="getByType(['doc','docx','pdf','xls','txt','wps','rtf','ppt','pptx'])">文档</a-menu-item>
    <a-menu-item key="4" @click="getByType(['mp4','rm','avi'])">视频</a-menu-item>
    <a-menu-item key="5" @click="getByType(['rar','zip'])">压缩包</a-menu-item>
    <a-menu-item key="6" @click="getByType(['torrent'])">种子</a-menu-item>
    <a-menu-item key="7" @click="getByType(['mp3','wma','wav'])">音乐</a-menu-item>
    <a-menu-item key="8" @click="getByType(['exe','dll','torrent','py','html','css','java'])">其他</a-menu-item>
    <a-menu-item key="9" @click="listMyShare()"><a-icon type="share-alt" />我的分享</a-menu-item>
  </a-menu>
</div>
</template>
<script>
export default {
  data () {
    return {
      rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
      openKeys: ['sub1'],
    }
  },
  methods: {
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    getByType(type){
      this.$emit('event',type)
    },
    listMyShare(){
      this.$emit('listMyShare');
    }
  },
}

</script>