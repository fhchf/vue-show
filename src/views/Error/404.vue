<template>
  <div class="err404-container">
    <p>Error 404<br />页面不见了诶</p>
    <img src="../../assets/img/404.svg" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scope>
.err404-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.err404-container p {
  position: absolute;
  top: 5%;
  left: 20%;
  color: #341f16;
  font-size: 2em;
}

.err404-container img {
  width: 100%;
  height: 100%;
}
</style>
