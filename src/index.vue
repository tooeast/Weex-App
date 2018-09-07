<template>
  <div class="wrapper" @androidback="back">
    <router-view/>
  </div>
</template>

<script>
const globalEvent = weex.requireModule("globalEvent");

export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    var _this = this;
    globalEvent.addEventListener("androidback", function(e) {
      _this.$router.back();
    });
  },
  methods: {
    jump (src) {
      this.$router.push({path: src})
    },
    back () {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
  .wrapper {
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 424px;
    height: 200px;
  }
  .greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }
  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  }
</style>
