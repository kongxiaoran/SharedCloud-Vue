<template>
    <a-upload
    action=""
    :fileList="fileList"
    accept="*"
    :multiple="true"
    @change="handleChange"
    :beforeUpload="beforeUpload"
    >
        <a-button type="primary" style="width:90px;"><a-icon type="upload"/> 上传</a-button>
    </a-upload>
</template>
<script>
export default {
    props:["path"],
    data(){
        return{
            fileList:[]
        }
    },
    methods:{
        beforeUpload(file) {
            this.fileList = [...this.fileList, file]
            this.handleUpload();
            return false;
        },
        handleChange ({ fileList }) {
            this.fileList = fileList    
        },
        handleUpload(){
            const formData = new FormData();
            var list = this.fileList;
            var that = this;
            list.forEach((file) => {
                formData.append('files',file);
            });
            formData.append('path',this.path);
            this.$axios.post('/file/uploadFile',formData,{headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")}}).then((res) => {
                if(res.data!=null){
                    this.fileList= [];
                }
            }).catch(function(error){
                console.log(error);
                if(error.message=="Network Error"){
                    that.$router.push("/login");
                }
            })
            setTimeout(() =>{
                this.$parent.listX(this.path);
            },1000);
            
        }
    }
}
</script>
<style>

</style>


