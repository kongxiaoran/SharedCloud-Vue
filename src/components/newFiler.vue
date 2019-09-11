<template>
  <div>
    <a-button style="width:100px;" @click="mkdir">新建文件夹</a-button>
    <a-modal
      title="Basic Modal"
      v-model="visible"
      @ok="handleOk"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e);
      this.visible = false
    },
     mkdir:function(){
        var p = {
            path:this.path+'/'+'新闻',
        }
        this.$axios({
            method: 'post',
            url: '/file/mkdir',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params:p
        }).then((res) => {
            this.listX(this.path)
        }).catch(function(error){
            console.log(error);  
        })
    }
  }
}
</script>