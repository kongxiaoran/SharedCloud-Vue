<template>

<div id="divformregister">
    <div id="formregister">
        <a-row style="padding-top:70px;">
            <a-col :span="5" >用户名</a-col>
            <a-col :span="12" :offset="3"><a-input type='text' class="registerinput" placeholder="请设置用户名"></a-input></a-col>
        </a-row><br/>
        <a-row>
            <a-col :span="5">密码</a-col>
            <a-col :span="12" :offset="3"><a-input type='text' class="registerinput" placeholder="请设置登录密码"></a-input></a-col>
        </a-row><br/>
        <a-row>
            <a-col :span="5">确认密码</a-col>
            <a-col :span="12" :offset="3" ><a-input type='text' class="registerinput" placeholder="请确认你设置登录密码"></a-input></a-col>
        </a-row><br/>
        <a-row>
            <a-col :span="5">验证码</a-col>
            <a-col :span="7" :offset="3" ><a-input type='text' class="registerinput" placeholder="请确认右侧的验证码" v-model="inputcode" @change="checkresult"></a-input></a-col>
            <a-col :span="4" :offset="1"><a-input type='text' class="registerinput" @click="created" v-model="checkcode"/></a-col>
        </a-row><br/>
        <a-row>
            <a-col :span="6" :offset="8" style="color:red;" v-model="checkresultdemo">{{checkresultdemo}}</a-col>
        </a-row>
        <a-row>
            <a-col :span="12" :offset="8" ><a-button block class="registerbutton" @click="checksame">注册</a-button></a-col>
        </a-row>
    </div>
</div>
    
</template>

<script>
export default {
    name:'Register',
    data(){
        return{
            inputcode:'',
            checkcode:'',
            checkresultdemo:''
        }
        
    },
    mounted(){
        this.createCode();
    },
    methods:{
        createCode(){
            this.checkcode = "";
            //验证码的长度  
            var codeLength = 4; 
            //随机数 
            var random = new Array(1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y');  
            for(var i = 0; i < codeLength; i++) {
                        //取得随机数的索引（0~35）
                    var index = Math.floor(Math.random()*33);   
                            //根据索引取得随机数加到code上
                    this.checkcode += random[index];   
                    }
      },
    created(){
        this.createCode();
    },
    checksame(){
        var inputcode3=this.inputcode;
        var checkcode3=this.checkcode;
        if(inputcode3==checkcode3){
            alert('success')
            return false
        }
    },
    checkresult(){
        var len=this.inputcode.length;
        var inputcode2=this.inputcode;
        var checkcode2=this.checkcode;
        if(len>=4&&inputcode2!=checkcode2){
            this.checkresultdemo="验证码错误";
        }else if(len<=3||inputcode2==checkcode2){
            this.checkresultdemo=""
        }
        
    }
    }
}
</script>
<style scoped>
#divformregister{
    background: url(/static/register.jpg);
    height: 960px;
    margin-top: 0%;
    position: relative;
}
#formregister{
    position: absolute;
    top: 150px;
    margin-left:58%;
    background-color: rgb(247, 246, 244);
    width: 530px;
    height: 550px;
    font-size: 20px;
    font-weight: 700px;
    text-align: right;
    
}
.registerinput{
    height: 40px;
    font-family: Arial, Helvetica, STHeiti, 宋体;
}
.registerbutton{
    height: 50px;
    background-color: #3f89ec;
    font-size: 28px;
    font-family: Arial, Helvetica, STHeiti, 宋体;
    color:white;
}
</style>