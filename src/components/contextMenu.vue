
import func from './vue-temp/vue-editor-bridge';
<template> 
    <div>
      <context-menu class="right-menu" 
        :target="contextMenuTarget" 
        :show="contextMenuVisible" 
        @update:show="(show) => contextMenuVisible = show">
        <a href="javascript:;" @click="renameModal">重命名</a>
        <a href="javascript:;" @click="deletes">删除</a>
        <a href="javascript:;" @click="deleteMsg">强力删除</a>
        <a href="javascript:;" @click="newFiler">新建文件夹</a>
        <a href="javascript:;" @click="shareModal">设为共享</a>
        <!-- <a href="javascript:;" @click="unshare">取消共享</a> -->
      </context-menu>

      <a-modal
      title="新的文件名"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      >
      <a-input v-model="newName" placeholder="new file name"/>
      </a-modal>

      <a-modal
      title=""
      v-model="userSelectVisible"
      @ok="userSelectOk"
      @cancel="userSelectCancel"
      class="right"
      >
        <div class="sharedform" style="height:340px">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane key="1" >
              <span slot="tab"><a-icon type="link"/>链接分享</span>
          
              <div style="height:320px;font-size:14px;">
                  <div style="margin-left:40px;margin-top:30px;">
                    <span>分享形式</span>
                    <a-radio checked>有提取码</a-radio><br/><br/>
                  </div>
                  <div style="margin-left:40px;margin-top:10px;">
                    <span>有效期限</span>
                    <a-select defaultValue="永久有效" style="width: 120px">
                      <a-select-option value="ever">永久有效</a-select-option>                
                    </a-select>
                  </div>           
                  <br/><br/>
                  <a-button type="primary" style="font-size:18px;width:120px;margin-left:40px" @click="createUrl">创建链接</a-button>
                  <br/><br/><br/>
                  <div>
                      <a-input type="text" v-model="shareUrl" style="width:300px;margin-left:40px"></a-input>
                      <a-button type="primary" :data-clipboard-text="shareUrl" id="copy_text" @click="copy">复制链接地址</a-button>
                  </div>
              </div>      
              </a-tab-pane>
              <a-tab-pane  key="2">
                  <span slot="tab"><a-icon type="team"/>好友分享</span>
                  <uselect ref="uselect"></uselect>
              </a-tab-pane>
            </a-tabs>
        </div>
      </a-modal>
      
      
    </div>
</template>

<script>
import uselect from './userSelect.vue'
import Clipboard from 'clipboard'
export default {
    props:['path','filelist','filedom'],
    data(){
        return {
            contextMenuVisible: false,
            // contextMenuTarget:document.querySelector("#container"),
            contextMenuTarget:document.body,
            visible:false,
            userSelectVisible:false,
            newName:'',
            shareFile:{},
            shareUrl:''       //文件的分享链接
        }
    },
    components: {
      Clipboard,
      uselect,
      key() {
          return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
      }
    },
    methods:{
        handleOk:function(){
          this.visible = false;
          this.rename();
        },
        handleCancel:function(){
          this.visible = false;
        
        },
        renameModal:function(){
          if(this.filelist == ''){
            this.$message.warning('请选择文件');
            return ;
          }
          var strs = new Array();
          strs = this.filelist[0].split("/");
          this.newName = strs[strs.length-1]
          this.visible = true;
        },
        rename:function(){
          var that = this;
          var oldfilename = this.filelist[0]; 
          var newName = this.newName;
          this.$axios.post('/file/rename',{oldfilename:oldfilename,refilename:newName},
              {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}})
          .then((res) =>{
              this.$parent.listX(this.path);
          }).catch(function(error){
            if(error.message=="Network Error"){
                that.$router.push("/login");
              }
              console.log(error);
          })
          this.newName='';
          this.$parent.clean();
          this.contextMenuVisible=false;
        },
        deletes:function(){
          this.$parent.deleteModal();
          this.contextMenuVisible=false;
        },
        deleteMsg:function(){
          var that = this;
          var filelist = this.filelist;
          // console.log(filelist);
          // if(!this.$parent.flag){
          //   return;
          // }
          this.$axios.post('/file/deleteOver',filelist,{headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) =>{
              this.$parent.clean();
              this.$parent.listX(this.path);
          }).catch(function(error){
              if(error.message=="Network Error"){
                that.$router.push("/login");
              }
              console.log(error);
          })
          this.contextMenuVisible=false;
        },
        newFiler:function(){
          this.$parent.mkdirModal();
          this.contextMenuVisible=false;
        },
        shareModal:function(){
          // this.$axios.post('/share/setFileSharing',
          // {account:sessionStorage.getItem("account"),path:this.filelist,},
          // {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) =>{
          //     this.shareFile = res.data.shareUrl;
          // }).catch(function(error){
          //     if(error.message=="Network Error"){
          //       that.$router.push("/login");
          //     }
          //     console.log(error);
          // })
          this.userSelectVisible = true;
          

          // this.$axios({
          //     method:'post',
          //     url:'/user/getUserListByAccount',
          //     params:{account:"r"},
          //     headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
          // }).then((res) =>{
          //     console.log(JSON.stringify(res.data));
          // }).catch(function(error){
          //     if(error.message=="Network Error"){
          //       that.$router.push("/login");
          //     }
          //     console.log(error);
          // })
          
        },
        createUrl:function(){
          this.$axios.post('/share/setFileSharing',
          {account:sessionStorage.getItem("account"),path:this.filelist,},
          {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) =>{
              this.shareUrl = 'http://localhost:8080/sharedcloud/s/'+res.data.shareUrl+'&'+res.data.accessCode;
          }).catch(function(error){
              if(error.message=="Network Error"){
                that.$router.push("/login");
              }
              console.log(error);
          })
        },
        copy: function () {
          var that = this;
          var clipboard = new Clipboard('#copy_text');
          clipboard.on('success', e => {
          // 释放内存
            this.$message.success("已复制到剪切板");
            clipboard.destroy()
          })
            clipboard.on('error', e => {
            // 不支持复制
            Message({
            message: '该浏览器不支持自动复制',
            type: 'warning'
            });
          // 释放内存
            clipboard.destroy()
          })
      },
      userSelectCancel:function(){
        this.shareUrl = '' 
        this.$refs.uselect.value = [];
      },
      userSelectOk:function(){
        var value = this.$refs.uselect.value;
        var shareUser = []
        for(var i in value){
          shareUser.push(value[i].key)
        }
        // alert(this.$refs.uselect.permission);
        this.$axios.post('/share/setFileShared',
          {account:sessionStorage.getItem("account"),path:this.filelist,shareUser:shareUser,permission:this.$refs.uselect.permission},
          {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) =>{
              this.$message.success("设置共享成功");
          }).catch(function(error){
              if(error.message=="Network Error"){
                that.$router.push("/login");
              }
              console.log(error);
          })
        this.shareUrl = '' 
        this.$refs.uselect.value = [];
        this.$refs.uselect.permission='r'
        this.userSelectVisible = false;
      },
      unshare:function(){
        
      }
    }
}
</script>
<style lang="scss">

    .right /deep/ .ant-modal-header{
      padding: 0px 0px;
    }

   .right-menu {
      border: 1px solid #eee;
      box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
      border-radius: 1px;
      display: block;
      font-family: Microsoft Yahei,Avenir,Helvetica,Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      position: fixed;
      background: #fff;
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 3px;
      z-index: 999;
      display: none;
      a {
        padding: 2px 15px;
 
        // width: 120px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        display: block;
        color: #1a1a1a;
        
      }
      user agent stylesheet
      a:-webkit-any-link {
        color: -webkit-link;
        cursor: pointer;
        text-decoration: underline;
      }
      a:hover {
        background: #42b983;
        // background: $color-primary;
        color: #fff;
      }
  }
</style>