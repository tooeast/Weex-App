<template>
  <div class="wrapper">
    <div class="head-area">
      <text class="head-text head-left" @click="back">&lt;</text>
      <text class="head-text head-right">{{ friend.username }}</text>
    </div>
    <scroller class="list">
      <div class="cell" v-for="(todo,index) in message" :key="index" :ref="'item'+index">
        <div class="turn-left" v-if="todo.myid == friend.youid">
          <div class="left-friend-head">
            <image :src="friend.headimg" class="left-friend-img"/>
          </div>
          <div class="left-info-content">
            <text class="left-info-text">{{ todo.content }}</text>
          </div>
        </div>
        <div class="turn-right" v-else>
          <div class="right-info-content">
            <text class="right-info-text">{{ todo.content }}</text>
          </div>
          <div class="right-friend-head">
            <image :src="user.headimg" class="right-friend-img"/>
          </div>
        </div>
      </div>
    </scroller>
    <div class="input-area">
      <input class="input" type="text" :value="textmsg" @input="msgInput" placeholder="输入消息吧...">
      <div class="fasong" :class="[ notNull ? 'unable' : 'disable' ]" @click="fasong">
        <text class="fasong-text">发送</text>
      </div>
    </div>
  </div>
</template>

<script>

const stream = weex.requireModule('stream');
const modal = weex.requireModule('modal');
const dom = weex.requireModule('dom');

export default {
  data () {
    return {
      key: '',
      user: {},
      friend: {},
      message: [],
      textmsg: '',
      notNull: false,
      preTime: '',
      timer: null
    }
  },
  mounted () {
    this.user = this.$route.params.myinfo;
    this.friend = this.$route.params.youinfo;

    setTimeout( () => {
      this.getOldInfo();
    }, 0);
  },
  beforeDestroy () {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    jump (src) {
      this.$router.push({ path: src})
    },
    back () {
      this.$router.back()
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
    startLoop () {

      var _this = this;
      this.timer = setInterval(function() {
        stream.fetch({
          method: 'POST',
          url: 'https://hakin56.com/topic.php?name=BSmeet&op=get_loop_msg',
          body: _this.toParams({
            userid: _this.user.userid,
            otherid: _this.friend.youid,
            pretime: _this.preTime
          }),
          type: 'json'
        }, function(ret) {
          if(!ret.ok) {
            modal.toast({
              message: '请求失败!',
              duration: 0.3
            });
          } else {

            if (ret.data.code == 0) {
              ret.data.data[0].forEach(element => {
                _this.message.push(element);
              });
              // _this.message.push = ret.data.data[0];
            }

            _this.preTime = ret.data.data[1];
          }
        })      
      }, 5000);
    },
    fasong () {
      if(this.textmsg.length <= 0) {
        modal.toast({
          message: '发送消息不能为空!',
          duration: 0.3
        });
        return;
      }

      var _this = this;
      var toNode;
      stream.fetch({
        method: 'POST',
        url: 'https://hakin56.com/topic.php?name=BSmeet&op=post_message',
        body: _this.toParams({
          myid: _this.user.userid,
          youid: _this.friend.youid,
          content: _this.textmsg
        }),
        type: 'json'
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: '您的网络有问题！',
            duration: 0.3
          });
        } else {
          if(ret.data.code == 0) {
            //发送成功消息框置空

            _this.message.push({
              myid: _this.user.userid,
              content: _this.textmsg
            });

            _this.textmsg = '';
            _this.notNull = false;

            // toNode = _this.$refs['item' + (_this.message.length - 1)];
            // dom.scrollToElement(toNode, {});
          } else {
            modal.toast({
              message: '发送失败',
              duration: 0.3
            });
          }
        }
      })
    },
    getOldInfo () {
      var _this = this;
      stream.fetch({
        method: 'GET',
        url: 'https://hakin56.com/topic.php?name=BSmeet&op=get_info_msg&userid=' + _this.user.userid + '&otherid=' + _this.friend.youid,
        type: 'json'
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: '请求失败!',
            duration: 0.3
          });
        } else {
          if (ret.data.code == 0) {

            _this.message = ret.data.data[0];
            _this.preTime = ret.data.data[1];


            _this.startLoop();
            // var toNode = _this.$refs['item13'];
            // dom.scrollToElement(toNode, {});

          } else {
            modal.toast({
              message: ret.data.msg,
              duration: 0.5
            })
          }
        }
      })
    },
    msgInput (event) {
      this.textmsg = event.value;
      this.textmsg.length > 0 ? (this.notNull = true) : (this.notNull = false);
    }
  }
}
</script>

<style scoped>
.wrapper {
  /* width: 750px;
  height: 1334px; */
  justify-content: center;
  align-items: center;
  flex: 1;
}
.head-area {
  position: relative;
  width: 750px;
  height: 100px;
  background-color: #585858;
}
.head-text {
  line-height: 100px;
  font-size: 30px;
  color: #fcfcfc;
}
.head-left {
  padding-left: 30px;
  font-size: 50px;
}
.head-right {
  position: absolute;
  right: 30px;
  top: 0;
  height: 100px;
  line-height: 100px;
}
.list {
  width: 750px;
  height: 900px;
  flex: 1;
  /* background-color: aqua; */
}
.input-area {
  background-color: #f5f5f5;
  height: 100px;
  width: 750px;
  flex-direction: row;
  border-width: 0;
  border-top-width: 1px;
  border-style: solid;
  border-color: #e2e2e2;
}
.input {
  flex: 1;
  height: 84px;
  margin-left: 10px;
  margin-top: 8px;
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: #bababa;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.fasong {
  display: flex;
  width: 100px;
  height: 84px;
  border-radius: 10px;
  margin-left: 20px;
  margin-top: 8px;
  margin-right: 10px;
}
.disable {
  background-color: #c0c0c0;
}
.unable {
  background-color: #15ff21;
}
.fasong-text {
  line-height: 84px;
  text-align: center;
  font-size: 30px;
  color: #ffffff;
}
.cell {
  padding-top: 9px;
  padding-bottom: 9px;
}
.turn-left {
  justify-content: flex-start;
  flex-direction: row;
}
.turn-right {
  justify-content: flex-end;
  flex-direction: row;
}
.left-friend-head {
  width: 100px;
  height: 100px;
  margin-left: 15px;
  justify-content: center;
  align-items: center;
}
.left-friend-img {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.left-info-content {
  margin-left: 10px;
  max-width: 450px;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: #b3b3b3;
  margin-top: 20px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}
.left-info-text {
  line-height: 1.4;
  max-width: 430px;
  font-size: 28px;
  -ms-word-break: break-all;
}

.right-friend-head {
  width: 100px;
  height: 100px;
  margin-right: 15px;
  justify-content: center;
  align-items: center;
}
.right-friend-img {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.right-info-content {
  margin-right: 10px;
  max-width: 450px;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: #b3b3b3;
  margin-top: 20px;
  padding-left: 10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}
.right-info-text {
  line-height: 1.4;
  max-width: 430px;
  font-size: 28px;
  -ms-word-break: break-all;
}
</style>
