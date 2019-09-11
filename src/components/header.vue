<template>
  <div>
    <img src="/static/sharedcloud.png">
    <a-menu class="mymenu"
      v-model="current"
      mode="horizontal"
    > 
      <a-menu-item key="mail"  @click="mainPage">
        <a-icon type="mail" />网盘
      </a-menu-item>
      <a-menu-item key="app" @click="sharePage">
        <a-icon type="appstore" />分享
      </a-menu-item>
      <a-menu-item key="more">
        <a-icon type="appstore" />更多
      </a-menu-item>
    </a-menu>
    <span style="position:relative;left:10%">
      <span style="margin-right:50px"><font color="#FF0000">合肥学院课程设计作品</font></span>
      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/> 
      <span>{{userName}}</span>
      <span style="float:right">网盘交流群:660594491</span>
    </span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      current: ['mail'],
      userName:'',
      imgUrl:''
    }
  },
  methods:{
    getUserInfo(){
      // console.log(sessionStorage.getItem("ACCESS_TOKEN"));
      var that = this;
      this.$axios.post('/user/getUserInfo',1,{headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}})
      .then((res) =>{
        // console.log(sessionStorage.getItem("ACCESS_TOKEN"));sessionStorage.getItem("account")
        this.userName = res.data.username;
        this.imgUrl = res.data.imgurl;
          sessionStorage.setItem("userPath",res.data.userpath);
          sessionStorage.setItem("account",res.data.account);
      }).catch(function(error){
          if(error.message=="Network Error"){
              that.$router.push("/login");
          }
          console.log(error);
      })
    },
    mainPage(){
      this.$emit("mainPage")
    },
    sharePage(){
      this.$emit('sharePage');
    }
  },
  created: function(){
    this.getUserInfo();
  }
}
</script>
<style>

    img{
      float: left;
    }
    
    .mymenu{
      float: left;
    }

    .myheader /deep/ .ant-menu{
      /* width: 80%; */
      width:500px;
      height: 89px;
      font-size: 17px;
      display:inline-block;
    }

    .myheader /deep/ .ant-menu-horizontal{
      line-height: 89px;
    }

</style>


