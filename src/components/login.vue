<template>
    <div>
        <div>
            <myslider style="position:absolute;width:100%;height:100%"></myslider>
        </div>
        <div class="form" style="position:absolute;top:20%;left:70%;width:350px;height:350px">
            
            <p class="pass-form-logo" style="margin:30px 0px 20px 0px;"><b>账号密码登录</b></p> 
            <a-input type="text"  v-model="username" placeholder="请输入账号"  class="forminput" style="width:250px;margin:10px 5px 15px 20px;"/>
            <br/>          
            <a-input type="password" v-model="password" placeholder="请输入密码" class="forminput" style="width:250px;margin:10px 5px 15px 20px;"/>
            <br/>
            <a-button type="primary" @click="submit()" block html-type="submit" class="forminput" style="width:250px;margin:20px 5px 15px 20px;">登录</a-button>	        		
            <br/>
            <a-checkbox @change="onChange" style="position:relative;left:-21%;">记住密码</a-checkbox><br/><br/>
            <div class="button"> 
                <a href="#" target="_blank">忘记密码</a>
                <a href="#" target="_blank"><router-link to="register">立即注册</router-link></a>
            </div>
            
        </div>
    </div>
</template>
<script>
import myslider from './background.vue'
import CryptoJS from "crypto-js";
export default {
     data(){
            return {
                username:'',
                password:'',
                checked:true
            }
        },
        components: {
            myslider,
            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            }
        },
        methods:{
            onChange (e) {
                this.checked = e.target.checked;
                if(this.checked==true){
                    this.setCookie(this.username,this.password,20)
                }else{
                    this.clearCookie();
                }
            },
            submit(){
                var key  = CryptoJS.enc.Utf8.parse('1254122559201909');
                var iv   = CryptoJS.enc.Utf8.parse('1472583691472583');
                  var password=CryptoJS.AES.encrypt(
                    this.password,//加密文件
                    // this.username
                    key,//加密密钥
                    {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding}
                ).toString();
                // console.log(password);
                if (!this.username||!this.password) {
                    this.$message.error('请完整输入信息');
                }else{
                    var that = this;
                    this.$axios({
                    method: 'post',
                    url: '/user/login',
                    data:{account:this.username,password:password}
                    }).then((res) => {
                        if(res.data != null){
                            sessionStorage.setItem("ACCESS_TOKEN", res.data);
                            that.$router.push("/index");
                        }
                    }).catch(function(error){
                        console.log(error);  
                    })
                }
                if(this.checked==true){
                    this.setCookie(this.username,this.password,20)
                }
            },
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
                this.getCookie()
            },
            //读取cookie
            getCookie: function() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'userName') {
                            this.username = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'userPwd') {
                            this.password = arr2[1];
                        }
                        
                    }
                }
            },
            //清除cookie
            clearCookie: function() {
                this.setCookie("userName", "", -1); //修改2值都为空，天数为负1天就好了
                this.setCookie("userPwd", "", -1); //修改2值都为空，天数为负1天就好了
            }
        },
        mounted(){
            this.getCookie()
        },
             
}
</script>
<style>
    .form{
        /* width: 40%; */
        /* position: relative; */
        text-align:center;
        background: rgb(248, 244, 244,0.7);

    }

    .button{
        position: relative;
        left: 30%;
        width: 40%;
    }

    .button a{
        margin: 5px 5px 5px 5px;
    }

</style>


