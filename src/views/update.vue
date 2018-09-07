<template>
  <div class="wrapper">
    <div class="top-bar">
      <text class="top-back" @click="back">取消</text>
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
        <input type="text" class="name-input input" @input="nameInput" :value="user.username" placeholder="请输入您的称呼">
      </div>
      <div class="sex-box box">
        <text class="sex-text left-text">性别</text>
        <text class="sex-input input" @click="sexPicker">{{ sexText }}</text>
      </div>
    </div>
    <div class="bottom-bar" @click="updateInfo">
      <text class="bottom-text">确认修改</text>
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
  'http:s//hakin56.com/images/head1.png',
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
      sexIndex: 0,
      headIndex: 0,
      user: {
        headimg: 'https://hakin56.com/images/maiya.png',
        username: 'loading...',
        sex: 0
      },
      imgUrl: '',
      sexText: ''
    }
  },
  computed: {
    // sexText () {
    //   if(this.sexIndex < sexItems.length) {
    //     return sexItems[this.sexIndex];
    //   }
    //   return 'loading...';
    // },
    // imgUrl () {
    //   if(this.headIndex < headItems.length) {
    //     return headItems[this.headIndex];
    //   }
    //   return '';
    // }
  },
  mounted () {
    var _this = this;
    storage.getItem("userinfo", event => {
      this.user = JSON.parse(_this.uncompileStr(event.data));
      this.imgUrl = this.user.headimg;
      this.sexIndex = this.user.sex;
      this.sexText = sexItems[this.sexIndex];
    })
  },
  methods: {
    back () {
      this.$router.back();
    },
    compileStr (code) { //对字符串进行加密         
      var c = String.fromCharCode(code.charCodeAt(0) + code.length);  
      for (var i = 1; i < code.length; i++)  
      {        
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));  
      }     
      return escape(c);   
    },
    uncompileStr (code){   //解密函数     
      code = unescape(code);        
      var c = String.fromCharCode(code.charCodeAt(0) - code.length);        
      for(var i = 1; i < code.length; i++)  
      {        
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));        
      }        
      return c;   
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
    nameInput (event) {
      this.user.username = event.value
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
    updateInfo () {
      // console.log()
      if (!this.user.username) {
        modal.toast({
          message: '称呼不能为空',
          duration: 1
        });
        return;
      }

      var _this = this;
      stream.fetch({
        method: 'POST',
        url: 'https://hakin56.com/topic.php?name=BSlogin&op=update_info',
        body: _this.toParams({
          userid: _this.user.userid,
          username: _this.user.username,
          sex: _this.sexIndex,
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
              userid: _this.user.userid,
              username: _this.user.username,
              sex: _this.sexIndex,
              headimg: _this.imgUrl
            })), event => {
              _this.$router.back();
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
  background-color: #585858;
  /* justify-content: center; */
  flex-direction: row
}
.top-back {
  color: #fff;
  width: 160px;
  line-height: 110px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 33px;
  text-align: left;
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
  background-color: #68eb56;
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
.head-text {
  line-height: 150px;
}
.name-text {
  line-height: 110px;
}
.sex-text {
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
