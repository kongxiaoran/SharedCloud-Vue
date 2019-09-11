<template>

    <div>
        <div class="buttons">
          <myupload style="display:inline-block;height:40px;" v-bind:path="path"></myupload>
          <a-button style="width:70px;" @click="downloadFiles(filelist,choiceFileName)">下载</a-button>
          <a-button style="width:100px;" @click="mkdirModal">新建文件夹</a-button>
          <a-button style="width:70px;" @click="deleteModal">删除</a-button>
          
          <a-modal
            title="新建文件夹"
            v-model="visible1"
            @ok="handleOk1"
            @cancel="handleCancel1"
            >
            <a-input v-model="newFilerName" placeholder="new filer name"/>
            </a-modal> 

          <a-modal
            title=""
            v-model="visible2"
            @ok="handleOk2"
            @cancel="handleCancel2"
            >
            确定删除吗？
          </a-modal> 

          <a-button style="width:50px;float:right"><a-icon type="bars"/></a-button>
          <a-input-search
            placeholder="搜索您的文件"
            style="width: 240px;float:right;background:#f1f2f4;"
            @search="onSearch"
          />
        </div>
        <div style="position:relative;top:10px;float:left;width: 100%" id="container">
            <div>
                <label @click="changeBack" style="margin-right:15px;">返回上一级    </label>
                <label v-for="(item,i) in paths" :key="i" :value="item" @click="changeOne(i)" style="margin-right:10px;"> {{item}}</label>
            </div>
            <mymenu v-bind:path="path" v-bind:filelist="filelist" :v-bind:filedom="filedom"></mymenu>
            <a-row :gutter="16">
                <a-col :span="3" v-for="(item,i) in files" :key='i' >
                    <div class="fileitem" @mouseenter="enter" @mouseleave="leave">
                        <!-- /sharedcloud -->
                        <img class="smallicon" src="/static/icon/对勾.png" style="display: none;">
                        <div class="imgarea">
                            <img class="icon" :src="'/static/icon/'+item.type+'.png'" @click.stop="choice($event,item.path,item.name)" @dblclick.stop="list($event,item.type,item.path,item.name)">
                        </div>
                        <div class="filename"> 
                            <p class="p">{{item.name}}</p>
                            <!-- <p style="display:none">{{item.name}}</p> -->
                            <!-- <p style="display: none;">{{item.path}}</p> -->
                        </div>
                    </div>
                </a-col>
            </a-row>
            <br/><br/><br/><br/>
            <a-row :gutter="16">
                <a-col :span="3" v-for="(item,i) in otherFiles" :key='i' >
                    <div class="fileitem" @mouseenter="enter" @mouseleave="leave">
                        <!-- /sharedcloud -->
                        <img class="smallicon" src="/sharedcloud/static/icon/对勾.png" style="display: none;">
                        <div class="imgarea">
                            <img class="icon" :src="'/sharedcloud/static/icon/'+item.type+'.png'" @click.stop="choice($event,item.path,item.name)" @dblclick.stop="list($event,item.type,item.path,item.name)">
                        </div>
                        <div class="filename"> 
                            <p class="p">{{item.name}}</p>
                            <!-- <p style="display:none">{{item.name}}</p> -->
                            <!-- <p style="display: none;">{{item.path}}</p> -->
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    // import iconUrl from "@/static/icon/"
    import myupload from './uploadFile.vue'
    import mymenu from './contextMenu.vue'
    export default {
        data(){
            return {
                active:'',
                filelist:[],
                filedom:[],            //单击选中的鼠标事件组
                files:[],
                realpath:'D:\\小猪猪',
                path:'D:\\小猪猪',
                paths:[],
                i:0,
                visible1:false,
                visible2:false,
                newFilerName:'',        
                num:0,                  //给filelist数组计数
                choiceFileName:'',       //点击选中的文件名
                otherFiles:[],              //他人分享给你的文件
                flag:false
            }
        },
        components: {
            myupload,
            mymenu,
            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            }
        },
        methods:{
            enter:function(e){
                // console.log(e)
                e.target.style = 'background-color: #F0FFFF';
            },
            leave:function(e){
                e.target.style = '';
            },
            // pMove:function(e){
            //     alert("yi入")
            //     e.target.style = 'display:inline';
            // },
            // pLeave:function(e){
            //     e.target.style = 'display:none';
            // },
            choice:function(e,path,name){
                if(e.target.parentNode.parentNode.childNodes[0].style.display=='none'){
                    e.target.parentNode.parentNode.childNodes[0].style.display='block'
                    this.filelist.push(path)
                    this.filedom.push(e)
                    this.num = this.num + 1;
                    this.choiceFileName = name;
                    // console.log(this.filelist+"c:c"+this.filedom);
                }else{
                    e.target.parentNode.parentNode.childNodes[0].style.display='none';
                    this.filelist.splice(this.filelist.indexOf(path),1)
                    this.filedom.splice(this.filedom.indexOf(e),1);
                    this.num = this.num - 1;
                    this.choiceFileName = '';
                    // console.log(this.filelist+"p:p"+this.filedom);\
                }
               
            },
            onSearch:function(value){
                var that = this;
                var path = this.path;
                this.$axios.post('/file/listByName',{path:path,fileName:value},
                    {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}})
                .then((res) =>{
                    this.files=res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
            listX:function(path){
                if(path == '*'){
                    path = this.path;
                }
                var that = this;
                var p = {
                    path:path
                }
                this.$axios({
                    method: 'post',
                    url: '/file/list',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','ACCESS_TOKEN':sessionStorage.getItem("ACCESS_TOKEN")},
                    params:p
                }).then((res) => {
                    this.files=res.data;
                    this.path = path;
                    var paths = path.split("/");
                    
                    this.i=paths.length;
                    this.paths=[];
                    console.log("i:"+this.i+"-- paths"+paths);
                    for(var i=3;i<this.i;i++){
                        this.paths.push(paths[i])
                        console.log(i+":"+path);
                    }
                    
                    console.log("newPathsd:"+this.paths+" - "+this.path)
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);  
                })
                // console.log(this.files)
                
            },
            downloadShow(data,name) {
                if (!data) {
                    return
                }
                var url = window.URL.createObjectURL(new Blob([data],{"type":"application/octet-stream"}))
                var link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', name)
                document.body.appendChild(link)
                link.click()
            },
            //下载文件
            downloadFiles(paths,name){
                if(name == '' || paths ==[]){
                    return ;
                }
                this.$axios.post('/file/downloadFiles',paths,{headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},responseType: 'blob'})
                .then((res) =>{
                    // console.log(res.data);
                    if(paths.length>1){
                        this.downloadShow(res.data,"temp.zip")
                    }else{
                        this.downloadShow(res.data,name)
                    }
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
            //双击文件图标
            list:function(e,type,path,name){
                var p = {
                    path:path
                }
                if(type != '文件夹'){
                    var paths = []
                    // console.log("filelist:"+this.filelist+"num:"+this.num);
                    if(this.num > 1){
                        paths = this.filelist;
                        console.log("多选下载"+paths);
                    }else{
                        paths.push(path);
                    }
                    // console.log("uuc"+paths);
                    this.downloadFiles(paths,name);
                    return ;
                }
                this.$axios({
                    method: 'post',
                    url: '/file/list',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded',
                            'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
                    params:p
                }).then((res) => {
                    this.files=res.data;
                    this.path = path;
                    var paths = path.split("/");
                    this.i=paths.length;
                    this.paths=[];
                    for(var i=3;i<paths.length;i++){
                        this.paths.push(paths[i])
                    }
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);  
                })
                
            },
            changeOne:function(i){
                console.log(i+this.paths);
                var path=this.realpath;
                for(var c = 3;c <=i;c++){
                     path= path +'/'+this.paths[c]
                }
                this.listX(path);
            },
            changeBack:function(){
                this.i= this.i - 1;
                console.log(this.i);
                this.changeOne(this.i-2);
            },

            mkdirModal:function(){
                this.visible1 = true;
            },
            deleteModal:function(){
                this.visible2 = true;
            },
            handleOk1:function(){
                this.mkdir();
                this.visible1=false;
                this.newFilerName='';
            },
            handleCancel1:function(){
                this.visible1=false;
                this.newFilerName='';
            },
            handleOk2:function(){
                this.deleteFiles();
                this.visible2=false;
                this.filelist=[]
            },
            handleCancel2:function(){
                this.visible2=false;
                this.filelist=[]
            },
            mkdir:function(){
                var that = this;
                var p = {
                    path:this.path+'/'+this.newFilerName,
                }
                var newFilerName = this.newFilerName;
                this.$axios({
                    method: 'post',
                    url: '/file/mkdir',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded',
                            'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
                    params:p
                }).then((res) => {
                    
                    this.$message.success('文件夹:  '+newFilerName +"  创建成功");
                    this.listX(this.path)
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    this.$message.error('文件夹: '+that.newFilerName+"创建失败");
                    console.log(error);  
                })
            },
            enableDelete:function(){
                var that = this;
                this.$axios.post('/share/enableDelete',{path:this.filelist,account:sessionStorage.getItem("account")},
                    {headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}})
                .then((res) =>{
                    that.flag = res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(serror);
                })
            },
            deleteFiles:function(){
                this.enableDelete();
                if(!this.flag){
                    this.$message.error("没有删除该文件的权限")
                    return;
                }
                this.flag = false;
                var that = this;
                console.log(this.filelist)
                this.$axios.post('/file/delete',this.filelist,{headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) =>{
                    this.$message.success('删除文件成功');
                    this.listX(this.path)
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    this.$message.error('删除文件失败');
                    console.log(error);
                })
                
                for(var i=0;i<this.filedom.length;i++){
                    var e =this.filedom[i];
                    e.target.parentNode.parentNode.childNodes[0].style.display='none';
                }
                this.filedom=[];
                this.filelist=[];
            },
            clean:function(){
                for(var i=0;i<this.filedom.length;i++){
                    var e =this.filedom[i];
                    e.target.parentNode.parentNode.childNodes[0].style.display='none';
                }
                this.filedom=[];
                this.filelist=[];
            },
            getByType:function(type){
                var that = this;
                var path = this.path
                this.$axios({
                    method:'post',
                    url:'/file/listByType',
                    data:{path,type},
                    headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
                }).then((res) =>{
                    this.files=res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
            listMyShare:function(){
                var that = this;
                // console.log("x:"+sessionStorage.getItem("account"));
                this.$axios({
                    method:'post',
                    url:'/share/my/list',
                    params:{account:sessionStorage.getItem("account")},
                    headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
                }).then((res) =>{
                    this.files=res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
            login(){
                this.$axios({
                    method: 'post',
                    url: '/user/login',
                    data:{account:'root',password:'111'}
                }).then((res) => {
                    sessionStorage.setItem("ACCESS_TOKEN", res.data);
                    console.log(res.data);
                }).catch(function(error){
                    console.log(error);  
                })
            },
            getUserPath(){
                this.realpath = sessionStorage.getItem("userPath");
                this.path = sessionStorage.getItem("userPath");
            },
            get(){
                alert(sessionStorage.getItem("ACCESS_TOKEN"));
            },
            sharePage(){
                var that = this;
                 this.$axios({
                    method:'post',
                    url:'/share/other/list',
                    params:{account:sessionStorage.getItem("account")},
                    headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
                }).then((res) =>{
                    this.files = res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
           
        },
        created: function(){
            // console.log("index.vue");
            // this.login();
            // this.get();
            // alert(this.$route.path);
            // this.listX(this.path);
            // this.login();
            // this.test();
           
        },
        mounted:function(){
            setTimeout(() =>{
                this.getUserPath();
                this.listX(this.path);
            },1000);
            // this.listX(this.path);
        }
    }


</script>

<style>
.filename .p{
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 6px 5px 5px;
}

.buttons{
    /* float: left; */
    /* position: relative;
    left: 0%;
    width: 90%; */
    /* padding: 10px; */
    position: relative; top: 0px; float: left; width: 90%;
}

.imgarea{
    position: relative;
    margin: 9px auto 0;
    width: 84px;
    height: 84px;
}

.fileitem{
    
    width: 120px;
    height: 127px;
    float: left;
    margin: 4px 0 0 6px;
    text-align: center;
    border: 1px solid #fff;
    position: relative;
}

.icon{
    width: 100%;
    height: 100%;
}
</style>

