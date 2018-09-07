<template>
  <div class="wrapper">
    <img class="backimg" :src="backimg" alt="">
    <text class="login">马上登录</text>
    <input type="text" class="input" @input="useridInput" @return="checkLogin">
    <input type="password" class="input" @input="passwordInput" @return="checkLogin">
    <div class="btn" @click="checkLogin">
      <text class="btn-text">登&nbsp;&nbsp;&nbsp;&nbsp;录</text>
    </div>
    <div class="btn-re btn" @click="jump('/register')">
      <text class="btn-text">注&nbsp;&nbsp;&nbsp;&nbsp;册</text>
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
      userid: '',
      password: '',
      backimg: 'https://hakin56.com/images/bgbg.png'
    }
  },
  methods: {
    toParams(obj) {
      var param = "";
      for(const name in obj) {
        if(typeof obj[name] != 'function') {
          param += '&' + name + '=' + encodeURIComponent(obj[name])
        }
      }
      return param.substring(1);
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
    },
    useridInput (event) {
      this.userid = event.value
    },
    passwordInput (event) {
      this.password = event.value
    },
    checkLogin () {
      // console.log()
      if (!this.userid || !this.password) {
        modal.toast({
          message: '账号或者密码不能为空～',
          duration: 1
        });
        return;
      }

      var _this = this;
      stream.fetch({
        method: 'POST',
        url: 'https://hakin56.com/topic.php?name=BSlogin',
        type: 'json',
        body: _this.toParams({
          userid: _this.userid,
          password: _this.password
        })
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: 'Request faild!',
            duration: 0.3
          });
        } else {
          if (ret.data.code == 0) {
            modal.toast({
              message: ret.data.msg,
              duration: 0.5
            });

            storage.setItem('userinfo', _this.compileStr(JSON.stringify(ret.data.data)), event => {
              _this.$router.push({ path: '/left'});
            })
          } else {
            modal.toast({
              message: ret.data.msg,
              duration: 0.5
            })
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
  /* background-color: #94e16d; */
  /* background-image: url("https://hakin56.com/images/bgbg.png");
  background-size: cover;
  background-position: center center; */
  justify-content: center;
  align-items: center;
}
.backimg {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
.login {
  height: 100px;
  padding-top: 20px;
  text-align: center;
  font-size: 40px;
  line-height: 100px;
}
.btn {
  width: 500px;
  height: 80px;
  background-color: rgba(59, 230, 230, 0.705);
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  border-radius: 10px;
}
.btn-re {
  background-color: rgba(63, 243, 102, 0.692);
}
.btn-text {
  text-align: center;
  font-size: 30px;
  line-height: 80px;
  color: #fff;
}
.input {
  width: 500px;
  height: 80px;
  padding-top: 5px;
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 5px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  background-color: #fff;
  border-radius: 10px;
}
</style>
