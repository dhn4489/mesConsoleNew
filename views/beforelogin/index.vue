<template>
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <!-- 类型列 -->
      <el-table-column label="类型" prop="type" width="180" :formatter="formatType" />


      <!-- 描述列 -->
      <el-table-column label="描述" prop="desc" width="250" />

      <!-- 项目名称列 -->
      <el-table-column label="项目名称" prop="name" width="200" />

      <!-- 进入项目列 -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <!-- 每行的进入项目按钮 -->
          <el-button type="primary" @click="handleNavigate(scope.row)">
            进入项目
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 假设 getProjects 是你正确的 API 请求
import { getProjects } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  data() {
    return {
      tableData: [] // 表格数据
    }
  },
  created() {
    this.fetchData() // 组件创建时调用接口获取数据
  },
  methods: {
    // 调用后台API获取数据
    fetchData() {
      const identity = this.$store.state.user.username; // 假设你使用 `username` 作为身份
      this.$store.dispatch('user/getProjects', identity).then(response => {
        // 处理返回的数据，假设返回的是项目数组
        this.tableData = Array.isArray(response) ? response : [response];
      }).catch(error => {
       // console.error('获取项目数据失败:', error)
         //this.$router.push({ path: '/login' });
         if (error.response && error.response.status === 401) {
          // 如果返回 401，说明 Token 失效，清除 Token 并跳转到登录页面
          console.log('执行跳转')
          removeToken()
          localStorage.removeItem('token'); // 清除本地存储中的 Token
          setTimeout(() => {
            this.$router.push({ path: '/login' });
              }, 100); // 延迟 500 毫秒
        } else {
          // 其他错误处理
          console.error('获取项目数据失败:', error);
        }
      })
    },

    // 处理点击事件，提交身份信息并跳转
    handleNavigate(row) {
       // 将行数据作为参数传入
    this.$store.dispatch('user/getInfo', row)
      .then(response => {
       // console.log('获取到的详细信息:', response);
        // 根据需求处理返回的数据，比如跳转详情页
        this.$router.push({ 
          path: `/dashboard`, // 项目路径 
         // query: response // 传递获取到的详细信息
        });
      })
      .catch(error => {
        console.error('获取详细信息失败:', error);
        if (error.response && error.response.status === 401) {
          // 如果返回 401，处理 Token 失效
          console.log('Token 失效，跳转登录页面');
          this.$store.dispatch('user/resetToken'); // 调用 Vuex 的 resetToken
          this.$router.push({ path: '/login' });
        }
      });
    },
       // 格式化类型列显示的内容
    formatType(row, column, cellValue) {
      const typeMap = {
        1: '项目组',
        2: '工艺组',
        3: '物流组',
        7:'财务组',
        8:'商务组'
      };
      return typeMap[cellValue] || '未知类型'; // 如果没有匹配项，显示'未知类型'
    }
  }
}
</script>

<style scoped>
/* 样式可以根据需求自行调整 */
.el-table {
  margin-top: 20px;
}

.el-button {
  width: 100%;
}

</style>
