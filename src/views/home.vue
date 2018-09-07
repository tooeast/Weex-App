<template>
  <div class="wrapper">
    <list class="list">
      <cell class="list-loading" v-if="loadState < 2">
        <text class="loading-text">{{ loadState == 0 ? '正在为您加载...' : '您暂无好友，快去添加吧～'}}</text>
      </cell>
      <cell class="cell" v-for="(todo,index) in list" :key="index">
        <div class="cell-div" @click="chuancan('meet',{ myinfo: user, youinfo: todo })">
          <div class="box-left">
            <image :src="todo.headimg" class="head-img"/>
          </div>
          <div class="box-right">
            <div class="username">
              <text class="name-text">{{ todo.username }}</text>
              <div class="right-show">
                <text class="show-time">{{ todo.time }}</text>
              </div>
            </div>
            <div class="info-content">
                <text class="info-text">{{ todo.content }}</text>
            </div>
          </div>
        </div>
      </cell>
    </list>
    <div class="btn-area">
      <div class="btn-left">
        <text class="bar-text current">聊天</text>
      </div>
      <div class="btn-center" @click="jump('/center')">
        <text class="bar-text">好友</text>
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
const stream = weex.requireModule('stream')

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

      this.get_list()
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
    jump(src) {
      this.$router.push({ path: src})

      modal.toast({
        message: "跳转到" + src,
        duration: 0.3
      })
    },
    chuancan (name, obj) {
      this.$router.push({name: name, params: obj});
    },
    get_list() {
      var _this = this;
      stream.fetch({
        method: 'GET',
        url: 'https://hakin56.com/topic.php?name=BSmeet&op=get_meet_list&userid=' + _this.user.userid,
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
            });

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
  align-items: flex-start;
  flex-direction: column;
  flex: 1;
}
.list {
  width: 750px;
  height: 1044px;
  /* height:  */
  flex: 1;
}
.weex-text {
  font-size: 17px;
  color: #3b3b3b;
}
.cell {
  height: 130px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
}
.cell-div {
  display: flex;
  flex-direction: row;
}
.each-box:last-of-type {
  border: none;
}
.box-left,
.box-right {
  display: inline-block;
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
  /* display: inline-block; */
  width: 110px;
  height: 110px;
  margin-left: 10px;
  border-radius: 10px;
}
.username {
  position: relative;
  height: 65px;
}
.name-text {
  line-height: 65px;
  font-size: 28px;
}
.info-text {
  line-height: 65px;
  font-size: 28px;
  color: #8a8a8a;
}
.info-content {
  height: 65px;
}
.right-show {
  position: absolute;
  right: 15px;
  top: 0;
}
.show-time {
  line-height: 65px;
  font-size: 22px;
  color: #b0b0b0;
}

.main-show {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 500px;
}
.btn-area {
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
  width: 750px;
  height: 90px;
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

.list-loading {
  height: 90px;
  justify-content: center;
  align-items: center;
}
.loading-text {
  font-size: 30px;
  color: #999999;
}
</style>
