<template>
    
</template>
<script>
export default {
    data () {
        return {
            code:'',
            shareUrl:'',
            path:'',
            name:''
        }
    },
    methods:{
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
            downloadFiles(shareUrl,code){
                if(shareUrl == '' || code == ''){
                    return ;
                }
                this.$axios.post('/file/downloadShareFiles',{shareUrl:shareUrl,accessCode:code},{responseType: 'blob'})
                .then((res) =>{
                    // console.log(res.data);
                    this.downloadShow(res.data,this.name)
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            },
            getShareFileName:function(shareUrl,code){
                this.$axios.post('/share/getFileSharingInfo',{shareUrl:shareUrl,accessCode:code})
                .then((res) =>{
                    this.name = res.data;
                }).catch(function(error){
                    if(error.message=="Network Error"){
                        that.$router.push("/login");
                    }
                    console.log(error);
                })
            }
            // getByPath:function(){
            //     var p = {
            //         path:this.path
            //     }
            //     this.$axios({
            //         method:'post',
            //         url:'/file/getByPath',
            //         params:p,
            //         // headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
            //     }).then((res) =>{
            //         this.name=res.data.name;
            //     }).catch(function(error){
            //         if(error.message=="Network Error"){
            //             that.$router.push("/login");
            //         }
            //         console.log(error);
            //     })
            //     setTimeout(() =>{
            //         // console.log(this.path+"{}"+this.name);
            //         this.downloadFiles([this.path],this.name);
            //     },1000);
                
            // }
    },
    created:function(){
       
        var url  = this.$route.path;
        var strs = new Array();
        strs = url.split("/");
        
        var str = new Array();
        str = strs[2].split("&");

        var code  = str[str.length-1]
        url = str[str.length-2]
        this.shareUrl = url;
        this.code = code;
        this.getShareFileName(url,code)
    },
    mounted:function(){
       
        
        setTimeout(() =>{
             this.downloadFiles(this.shareUrl,this.code);
        },1000);
       
        
    }
}
</script>

<style>

</style>

