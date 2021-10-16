<template>
  <div class="home-container">
    <button @click="logout">退出</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear('token')
      this.$router.replace('login')
    }
  }
}
</script>

<style lang="less" scope></style>
