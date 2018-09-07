<template>
  <div class="wrapper">
    <div class="head-area">
      <text class="head-text" @click="back">&lt;</text>
      <text class="text-center">添加好友</text>
    </div>
    <list class="list">
      <cell class="cell" v-for="(todo,index) in friend" :key="index">
        <image class="cell-image" :src="todo.headimg"/>
        <text class="cell-name">{{ todo.username }}</text>
        <text class="cell-sex">{{ todo.sex == 0 ? "女": "男" }}</text>
        <text class="btn" @click="addFriend(todo.userid, todo.username)">添加</text>
      </cell>
    </list>
  </div>
</template>

<script>

const stream = weex.requireModule('stream');
const modal = weex.requireModule('modal');

export default {
  data () {
    return {
      key: '',
      userid: '',
      friend: []
    }
  },
  mounted () {
    this.userid = this.$route.params.userid;


    modal.toast({
      message: this.userid,
      duration: 1
    });

    this.get_list();    
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
    jump (src) {
      this.$router.push({ path: src})
    },
    back () {
      this.$router.back()
    },
    get_list () {
      var _this = this;
      stream.fetch({
        method: 'GET',
        url: 'https://hakin56.com/topic.php?name=BSfriend&op=stranger_list&userid=' + _this.userid,
        type: 'json'
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: 'Request faild!',
            duration: 0.3
          });
        } else {
          if (ret.data.code == 0) {
            _this.friend = ret.data.data;
          } else {
            modal.toast({
            message: '失败',
            duration: 0.3
          });
          }
        }
      })
    },
    addFriend (otherid, othername) {
      var _this = this;
      stream.fetch({
        method: 'POST',
        url: 'https://hakin56.com/topic.php?name=BSfriend&op=add_friend',
        type: 'json',
        body: _this.toParams({
          ownerid: _this.userid,
          friendid: otherid
        })
      }, function(ret) {
        if(!ret.ok) {
          modal.toast({
            message: 'Request faild!',
            duration: 0.3
          });
        } else {
          if(ret.data.code == 0) {
            modal.toast({
              message: "添加好友( " + othername + " )成功！",
              duration: 0.3
            });
          } else {
            modal.toast({
              message: "添加失败",
              duration: 0.3
            });
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
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #fafafa;
}
.head-area {
  width: 750px;
  height: 100px;
  background-color: #585858;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row
}
.head-text {
  font-size: 40px;
  color: #fcfcfc;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 50px;
  margin-left: 30px;
}
.text-center {
  font-size: 30px;
  color: #fff;
  width: 530px;
  text-align: center
}

.list {
  width: 750px;
  height: 900px;
  flex: 1;
}
.cell {
  width: 750px;
  height: 120px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #dadada;
}
.cell-image {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  margin-right: 20px;
}
.cell-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.cell-sex {
  width: 190px;
  text-align: center;
}
.btn {
  width: 80px;
  height: 45px;
  border-radius: 10px;
  background-color: #46ff55;
  font-size: 27px;
  color: #fff;
  text-align: center;
  line-height: 45px;
}
</style>
