<template>
  <div class="wrapper">
    <div class="top-bar">
      <text class="top-text" @click="jump('/update')">修改信息</text>
    </div>

    <div class="list">
      <div class="head-area">
        <text class="head-left">头像</text>
        <image class="head-right" :src="user.headimg"/>
      </div>
      <div class="each-line">
        <text class="text-left">账号</text>
        <text class="text-right">{{ user.userid }}</text>
      </div>
      <div class="each-line">
        <text class="text-left">昵称</text>
        <text class="text-right">{{ user.username }}</text>
      </div>
      <div class="each-line">
        <text class="text-left">性别</text>
        <text class="text-right">{{ user.sex == 0 ? "女" : (user.sex == 1 ? "男" : "loading" ) }}</text>
      </div>
      <div class="exit-btn" @click="exitLogin">
        <text class="exit-text">退出登陆</text>
      </div>
    </div>

    <div class="btn-area">
      <div class="btn-left" @click="jump('/left')">
        <text class="bar-text">聊天</text>
      </div>
      <div class="btn-center" @click="jump('/center')">
        <text class="bar-text">好友</text>
      </div>
      <div class="btn-right">
        <text class="bar-text current">我的</text>
      </div>
    </div>
  </div>
</template>

<script>
const modal = weex.requireModule("modal")
const stream = weex.requireModule("stream")
const storage = weex.requireModule("storage")

export default {
  data () {
    return {
      userid: 10024,
      user: {
        userid: 'loading...',
        headimg: 'https://hakin56.com/images/maiya.png',
        userid: 'loading...',
        username: 'loading...',
        sex: 3
      }
    }
  },
  mounted() {
    var _this = this;
    storage.getItem("userinfo", event => {
      if(event.data) {
        this.user = JSON.parse(_this.uncompileStr(event.data));
        this.userid = this.user.userid;
      } else {
        this.getUserInfo(this.userid);
      }
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
    compileStr (code) { //对字符串进行加密         
      var c = String.fromCharCode(code.charCodeAt(0) + code.length);  
      for (var i = 1; i < code.length; i++)  
      {        
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));  
      }     
      return escape(c);   
    },
    jump(src) {
      this.$router.push({ path: src})

      modal.toast({
        message: "跳转到" + src,
        duration: 0.3
      })
    },
    getUserInfo (userid) {
      var _this = this;
      stream.fetch({
        method: 'GET',
        url: 'https://hakin56.com/topic.php?name=BSlogin&op=get_info&userid=' + userid,
        type: 'json'
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: '请求失败!',
            duration: 0.3
          });
        } else {
          if (ret.data.code == 0) {

            _this.user = ret.data.data;

            storage.setItem('userinfo', _this.compileStr(JSON.stringify(ret.data.data)), event => {
              _this.$router.push({ path: '/right'});
            })
          } else {
            modal.toast({
              message: ret.data.msg,
              duration: 0.5
            })
          }
        }
      })
    },
    exitLogin () {
      modal.confirm({
        message: '你确定要退出登陆吗？',
        okTitle: '确定',
        cancelTitle: '取消'
      }, result => {
        if(result == '确定') {
          storage.removeItem('userinfo', event => {
            if(event.result == 'success') {
              this.$router.push({ path: '/login' })
            } else {
              modal.toast({
                message: '退出登陆失败',
                duration: 0.5
              })
            }
          })
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
.top-bar {
  width: 750px;
  height: 110px;
  background-color: #585858;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.top-text {
  /* width: 10px; */
  padding-top: 20px;
  padding-bottom: 20px;
  margin-right: 30px;
  font-size: 30px;
  text-align: right;
  color: #fff;
}
.list {
  width: 750px;
  height: 1244px;
  flex: 1;
}

.each-line {
  position: relative;
  height: 110px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
}
.text-left {
  line-height: 110px;
  padding-left: 40px;
  font-size: 30px;
}
.text-right {
  position: absolute;
  top: 0;
  right: 30px;
  height: 110px;
  line-height: 110px;
  font-size: 30px;
}
.head-area {
  position: relative;
  height: 160px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
}
.head-left {
  line-height: 160px;
  padding-left: 40px;
  font-size: 30px;  
}
.head-right {
  position: absolute;
  top: 10px;
  right: 30px;
  width: 140px;
  height: 140px;
  border-radius: 10px;
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

.exit-btn {
  width: 600px;
  height: 100px;
  margin-left: 75px;
  margin-right: 75px;
  margin-top: 30px;
  border-radius: 18px;
  background-color: #e64b4b;
  justify-content: center;
  align-items: center;
}
.exit-text {
  font-size: 40px;
  text-align: center;
  color: #fff;
}
</style>
