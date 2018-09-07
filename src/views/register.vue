<template>
  <div class="wrapper">
    <div class="top-bar">
      <text class="top-back" @click="back">&lt;</text>
      <text class="top-text">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</text>
    </div>
    <div class="center-bar">
      <div class="head-box box">
        <text class="head-text left-text">头像</text>
        <div class="img-area input" @click="headPicker">
          <image :src="imgUrl" class="head-img"/>
        </div>
      </div>
      <div class="name-box box">
        <text class="name-text left-text">称呼</text>
        <input type="text" class="name-input input" @input="nameInput" placeholder="请输入您的称呼">
      </div>
      <div class="sex-box box">
        <text class="sex-text left-text">性别</text>
        <text class="sex-input input" @click="sexPicker">{{ sexText }}</text>
      </div>
      <div class="password-box box">
        <text class="password-text left-text">密码</text>
        <input type="password" class="password-input input" @input="passwordInput" placeholder="请输入您的密码">
      </div>
      <div class="password-box box">
        <text class="password-text left-text">确认密码</text>
        <input type="password" class="password-input input" @input="twiceInput" placeholder="请再次输入密码">
      </div>
    </div>
    <div class="bottom-bar" @click="register">
      <text class="bottom-text">立即注册</text>
    </div>
  </div>
</template>

<script>
const modal = weex.requireModule("modal")
const stream = weex.requireModule("stream")
const picker = weex.requireModule('picker')
const storage = weex.requireModule("storage")

var sexItems = ['女', '男'];

var headItems = [
  'https://hakin56.com/images/head1.png',
  'https://hakin56.com/images/head2.png',
  'https://hakin56.com/images/head3.png',
  'https://hakin56.com/images/head4.png',
  'https://hakin56.com/images/head5.png',
  'https://hakin56.com/images/head6.png'
]

var headShow = [
  '默认头像-1',
  '默认头像-2',
  '默认头像-3',
  '默认头像-4',
  '默认头像-5',
  '默认头像-6',
];

export default {
  data () {
    return {
      headimg: '',
      name: '',
      sex: '',
      password: '',
      twice: '',
      sexIndex: 0,
      headIndex: 0
    }
  },
  computed: {
    sexText () {
      if(this.sexIndex < sexItems.length) {
        return sexItems[this.sexIndex];
      }
      return '请选择';
    },
    imgUrl () {
      if(this.headIndex < headItems.length) {
        return headItems[this.headIndex];
      }
      return '';
    }
  },
  methods: {
    compileStr (code) { //对字符串进行加密         
      var c = String.fromCharCode(code.charCodeAt(0) + code.length);  
      for (var i = 1; i < code.length; i++)  
      {        
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));  
      }     
      return escape(c);   
    },
    toParams(obj) {
      var param = "";
      for(const name in obj) {
        if(typeof obj[name] != 'function') {
          param += '&' + name + '=' + encodeURIComponent(obj[name])
        }
      }
      return param.substring(1);
    },
    back () {
      this.$router.back();
    },
    nameInput (event) {
      this.name = event.value
    },
    passwordInput (event) {
      this.password = event.value
    },
    twiceInput (event) {
      this.twice = event.value
    },
    sexPicker () {
      picker.pick({
        index: this.sexIndex,
        items: sexItems
      }, event => {
        if(event.result == 'success') {
          this.sexText = sexItems[event.data]
          this.sexIndex = event.data
        }
      })
    },
    headPicker () {
      picker.pick({
        index: this.headIndex,
        items: headShow
      }, event => {
        if(event.result == 'success') {
          this.imgUrl = headItems[event.data]
          this.headIndex = event.data
        }
      })
    },
    register () {
      // console.log()
      if (!this.name || !this.password || !this.twice) {
        modal.toast({
          message: '称呼或者密码不能为空',
          duration: 1
        });
        return;
      }

      if (this.password !== this.twice) {
        modal.toast({
          message: '两次输入的密码不一致',
          duration: 1
        });
        return;
      }

      var _this = this;
      stream.fetch({
        method: 'POST',
        url: 'https://hakin56.com/topic.php?name=BSlogin&op=register',
        body: _this.toParams({
          username: _this.name,
          sex: _this.sexIndex,
          password: _this.password,
          headimg: _this.imgUrl
        }),
        type: 'json'
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

            storage.setItem('userinfo', _this.compileStr(JSON.stringify({
              userid: ret.data.data,
              username: _this.name,
              sex: _this.sexIndex,
              headimg:  _this.imgUrl
            })), event => {
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
  background-color: #00b606;
  /* justify-content: center; */
  flex-direction: row
}
.top-back {
  color: #fff;
  width: 100px;
  line-height: 110px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 45px;
}
.top-text {
  text-align: center;
  font-size: 35px;
  color: #fff;
  flex: 1;
  margin-right: 100px;
  line-height: 110px;
}
.center-bar {
  flex: 1;
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 40px;
  padding-bottom: 40px;
}
.bottom-bar {
  width: 750px;
  height: 110px;
  background-color: #2ade30;
  justify-content: center;
}
.bottom-text {
  text-align: center;
  color: #fff;
  font-size: 40px;
}
.box {
  /* height: 110px; */
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
  flex-direction: row;
}
.head-box {
  height: 150px;
}
.name-box {
  height: 110px;
}
.sex-box {
  height: 110px;
}
.password-box {
  height: 110px;
}
.head-text {
  line-height: 150px;
}
.name-text {
  line-height: 110px;
}
.sex-text {
  line-height: 110px;
}
.password-text {
  line-height: 110px;
}
.left-text {
  margin-right: 30px;
  font-size: 30px;
}
.input {
  flex: 1;
  text-align: right;
}
.sex-input {
  line-height: 110px;
  font-size: 30px;
}
.img-area {
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
}
.head-img {
  width: 120px;
  height: 120px;
  border-radius: 10px;
}
</style>
