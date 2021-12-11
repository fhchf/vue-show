<template>
  <div class="err404-container">
    <h1>404</h1>
    <blockquote>How did we get here?</blockquote>
    <a href="javascript:;" @click="$router.back()">
      Take me home.
    </a>
  </div>
</template>

<script>
export default {
  name: 'Err404'
};
</script>

<style lang="less" scope>
.err404-container {
  min-width: 740px;
  margin: -30% auto 0;
  padding: 2rem 2.5rem;

  h1 {
    font-size: 2rem;
    color: #2c3e50;
  }

  blockquote {
    margin: 1rem 0;
    padding: 0.25rem 0 0.25rem 1rem;
    font-size: 1rem;
    color: #999;
    border-left: 0.2rem solid #dfe2e5;
  }

  a {
    color: #ffa260;
    font-weight: 500;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}
</style>
