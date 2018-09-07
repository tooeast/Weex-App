<template>
  <div class="wrapper">
    <router-view class="main-show"/>
    <div class="btn-area">
      <div class="btn-left" @click="jump('/haha')">
        <text class="bar-text">聊天</text>
      </div>
      <div class="btn-center" @click="jump('/hello')">
        <text class="bar-text">好友</text>
      </div>
      <div class="btn-right" @click="jump('/main/home')">
        <text class="bar-text">我的</text>
      </div>
    </div>
  </div>
</template>

<script>
const modal = weex.requireModule("modal")

export default {
  data () {
    return {
    }
  },
  methods: {
    jump(src) {
      this.$router.push({ path: src})

      modal.toast({
        message: "跳转到" + src,
        duration: 0.3
      })
    }
  }
}
</script>

<style scoped>
.bar-text {
  text-align: center;
  line-height: 60px;
}
.main-show {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 500px;
}
.btn-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  flex-direction: row;
  background-color: #f8f8f8;
  border-top-width: 1px;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color: #e7e7e7;
  font-size: 30px;
}
.btn-left,
.btn-center,
.btn-right {
  flex: 1;
}
</style>
