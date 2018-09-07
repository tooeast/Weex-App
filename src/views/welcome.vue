<template>
  <div class="wrapper">
    <image :src="logo" class="logo"/>
    <text class="greeting">欢迎来到麦芽～</text>
  </div>
</template>

<script>
const storage = weex.requireModule("storage")

export default {
  data () {
    return {
      logo: 'https://hakin56.com/images/maiya.png',
    }
  },
  mounted() {

    var _this = this;
    setTimeout(function() {

      // _this.$router.push({ path: '/left'});
      // return;

      storage.getItem("userinfo", event => {
        if(event.data == 'undefined') {
          _this.$router.push({ path: '/login'});
        } else {
          _this.$router.push({ path: '/left'});
        }
        // console.log(event.data);
      })
    }, 1400);
  }
}
</script>

<style scoped>
  .wrapper {
    /* height: 1440px; */
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 400px;
    height: 400px;
  }
  .greeting {
    font-size: 46px;
    color: #41B883;
  }
</style>
