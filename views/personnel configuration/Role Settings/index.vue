<template>
  <div class="dashboard-container">
    <div class="dashboard-text">中文名称: {{ folderName }}</div>
  </div>
</template>

<script>
export default {
  name: 'FolderPage',
  data() {
    return {
      folderName: '人员配置' // 在每个文件中修改为对应的中文名称
    };
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>