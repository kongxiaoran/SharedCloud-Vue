<template>
  <div>
      <br/><br/>
      <a-select
        mode="multiple"
        labelInValue
        :value="value"
        placeholder="选择分享的用户"
        style="width: 100%"
        :filterOption="false"
        @search="fetchUser"
        @change="handleChange"
        :notFoundContent="fetching ? undefined : null"
    >
        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
        <a-select-option v-for="d in data" :key="d.value">{{d.text}}</a-select-option>
    </a-select>

    <a-select defaultValue="r" style="width: 170px;margin-top:50px;" v-model="permission">
      <a-select-option value="r">只读(可下载)</a-select-option>
      <a-select-option value="r/w">可读可删除</a-select-option>
    </a-select>
  </div>

  
</template>

<script>
// import jsonp from 'fetch-jsonp';
// import querystring from 'querystring';
// import debounce from 'lodash/debounce';

export default {
  data() {
    this.lastFetchId = 0;
    // this.fetchUser = debounce(this.fetchUser, 800);
    return {
      data: [],
      value: [],
      fetching: false,
      permission:'r'
    }
  },
  methods: {
    fetchUser (value) {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = []
        this.fetching = true
    
        this.$axios({
            method:'post',
            url:'/user/getUserListByAccount',
            params:{account:value},
            headers: {'ACCESS_TOKEN': sessionStorage.getItem("ACCESS_TOKEN")},
        }).then((res) =>{
            console.log(JSON.stringify(res.data));
            if (fetchId !== this.lastFetchId) { // for fetch callback order
                return;
            }
            const data = res.data.map(user => ({
            text: user.account,
            value: user.id+'',
            }));
            
            this.data = data
            this.fetching = false

        }).catch(function(error){
            if(error.message=="Network Error"){
            that.$router.push("/login");
            }
            console.log(error);
        })
            
    },
    handleChange (value) {
        // alert(JSON.stringify(this.value));
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      })
        // this.fetchUser(value);
        //  console.log("检索"+JSON.stringify(value));
    }
  },
  created:function(){
      
  }
}
</script>