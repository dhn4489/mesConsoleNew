<template>
  <div class="welcome-container">
    <h1>欢迎进入</h1>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

h1 {
  font-size: 48px;
  color: #333;
}
</style>
