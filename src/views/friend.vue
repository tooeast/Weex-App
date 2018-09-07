<template>
  <div class="wrapper">
    <div class="top-bar">
      <text class="top-text" @click="chuancan('search', {userid: user.userid})">查找好友</text>
    </div>

    <list class="list">
      <cell class="list-loading" v-if="loadState < 2">
        <text class="loading-text">{{ loadState == 0 ? '正在为您加载...' : '您暂无好友，快去添加吧～'}}</text>
      </cell>
      <cell class="cell" v-for="(todo,index) in list" :key="index" @click="chuancan('meet', {myinfo: user, youinfo: todo})">
        <div class="box-left">
          <image :src="todo.headimg" class="head-img"/>
        </div>
        <div class="box-right">
          <text class="text-name">{{ todo.username }}</text>
        </div>
      </cell>
    </list>
    
    <div class="btn-area">
      <div class="btn-left" @click="jump('/left')">
        <text class="bar-text">聊天</text>
      </div>
      <div class="btn-center">
        <text class="bar-text current">好友</text>
      </div>
      <div class="btn-right" @click="jump('/right')">
        <text class="bar-text">我的</text>
      </div>
    </div>
  </div>
</template>

<script>
const modal = weex.requireModule("modal")
const storage = weex.requireModule("storage")
const stream = weex.requireModule("stream")

export default {
  data () {
    return {
      list: [],
      user: [],
      loadState: 0
    }
  },
  mounted() {
    var _this = this;
    storage.getItem("userinfo", event => {
      if(event.data) {
        this.user = JSON.parse(_this.uncompileStr(event.data));
      }
      this.getFriendList(this.user.userid);
    })
    
  },
  methods: {
    uncompileStr (code){   //解密函数     
      code = unescape(code);        
      var c = String.fromCharCode(code.charCodeAt(0) - code.length);        
      for(var i = 1; i < code.length; i++)  
      {        
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));        
      }        
      return c;   
    },
    chuancan (name, obj) {
      this.$router.push({name: name, params: obj});
    },
    jump(src) {
      this.$router.push({ path: src})

      modal.toast({
        message: "跳转到" + src,
        duration: 0.3
      })
    },
    getFriendList (userid) {
      var _this = this;
      stream.fetch({
        method: 'GET',
        url: 'https://hakin56.com/topic.php?name=BSfriend&op=get_list&userid=' + userid,
        type: 'json'
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: '请求失败!',
            duration: 0.3
          });
        } else {
          if (ret.data.code == 0) {

            _this.list = ret.data.data;

            _this.loadState = 2;
          } else {
            modal.toast({
              message: ret.data.msg,
              duration: 0.5
            })

            _this.loadState = 1;
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 750px;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.top-bar {
  width: 750px;
  height: 110px;
  background-color: #585858;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.top-text {
  padding-top: 30px;
  padding-bottom: 30px;
  color: #fff;
  font-size: 30px;
  margin-right: 30px;
  text-align: right;
}

.list-loading {
  height: 90px;
  justify-content: center;
  align-items: center;
}
.loading-text {
  font-size: 30px;
  color: #999999;
}

.list {
  width: 750px;
  height: 1244px;
  flex: 1;
}
.text-name {
  font-size: 17px;
  color: #3b3b3b;
}
.cell {
  height: 130px;
  /* background-color: azure; */
  display: flex;
  flex-direction: row;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
}
.each-box:last-of-type {
  border: none;
}
.box-left {
  width: 130px;
  height: 130px;
  text-align: center;
  padding-top: 10px;
}
.box-right {
  flex: 1;
  padding-top: 5px;
  padding-left: 10px;
}
.head-img {
  width: 110px;
  height: 110px;
  margin-left: 10px;
  border-radius: 10px;
}
.text-name {
  font-size: 30px;
  line-height: 130px;
}
.btn-area {
  width: 750px;
  height: 90px;
  display: flex;
  flex-direction: row;
  background-color: #f8f8f8;
  border-top-width: 1px;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color: #e7e7e7;
}
.btn-left,
.btn-center,
.btn-right {
  flex: 1;
}
.current {
  color: #fc5050
}
.bar-text {
  text-align: center;
  line-height: 90px;
  font-size: 26px;
}
</style>
