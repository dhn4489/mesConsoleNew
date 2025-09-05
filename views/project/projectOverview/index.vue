<template>
  <div>
    <h1>Project Overview</h1>
    <!-- 使用 Element-UI 表格显示数据 -->
    <el-table :data="tableData" style="width: 100%" border>
      <!-- 字段列 -->
      <el-table-column label="Field" prop="key" width="180" />

      <!-- 值列 -->
      <el-table-column label="Value" prop="value" width="400" />

      
    </el-table>

    <p v-if="!tableData.length">Loading project data...</p>
  </div>
</template>

<script>
// 假设 `getprojectOverview` 是你定义的 API 函数
import { getprojectOverview } from "@/api/project";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    return {
      tableData: [], // 存储项目数据
    };
  },
  created() {
    this.fetchProjectData(); // 加载时获取数据
  },
  methods: {
    // 从后端获取数据
    async fetchProjectData() {
      try {
        const response = await getprojectOverview();
           console.log('rawdata',response)
        if (response.code === 0) {
          const rawData = response.data
       
          this.tableData = Object.keys(rawData).map((key) => ({
            key: this.translateField(key),
            value: this.formatValue(rawData[key]),
          }));
        } else {
          console.error("Failed to fetch project data:", response.data.message);
        }
      } catch (error) {
        console.error("API request failed:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired, redirecting to login...");
          removeToken();
          this.$router.push({ path: "/login" });
        }
      }
    },

    // 字段翻译
    translateField(field) {
      const translations = {
        project_id: "项目ID",
        project_name: "Project Name",
        project_description: "Project Description",
        project_manager: "Project Manager",
        project_status: "Project Status",
        budget: "Budget",
        project_file: "Project File",
        project_from_id: "From Project ID",
        project_to_id: "To Project ID",
        begin_date: "Begin Date",
        end_date: "End Date",
        main_project_group_id: "Main Project Group ID",
        tasks: "Tasks",
      };
      return translations[field] || field;
    },

    // 格式化值
    formatValue(value) {
      return value === null ? "N/A" : value;
    },

    // 查看项目详细信息
    handleNavigate(row) {
      console.log("Viewing details for:", row);
      // 根据需求跳转页面或其他操作
      this.$router.push({
        path: `/dashboard`,
        query: { field: row.key, value: row.value },
      });
    },
  },
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.el-button {
  width: 100%;
}
</style>

