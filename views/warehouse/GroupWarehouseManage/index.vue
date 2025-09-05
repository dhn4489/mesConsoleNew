<template>
  <div class="warehouse-manage">
    <el-table :data="storehouses" border style="width: 100%" @row-click="handleRowClick">
      <!-- 添加仓库ID列 -->
      <el-table-column prop="storehouse_id" label="仓库ID" width="100" />
      <!-- 原有的仓库名称列 -->
      <el-table-column prop="storehouse_name" label="仓库名称" width="180" />
      <el-table-column prop="storehouse_address" label="仓库地址" width="220" />
      <el-table-column prop="storehouse_type" label="仓库类型" width="120" />
      <el-table-column prop="storehouse_capacity" label="仓库容量" width="140" />
      <el-table-column label="仓库状态" width="120">
        <template #default="scope">
          <span>{{ getStorehouseStatusText(scope.row.storehouse_status) }}</span>
        </template>
      </el-table-column>
      <!-- 添加小组ID列 -->
      <el-table-column prop="storehouse_groupid" label="小组ID" width="120" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="mini" type="primary" @click="viewInventory(scope.row)">查看库存</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 库存详情弹窗 -->
    <el-dialog title="仓库库存" :visible.sync="inventoryDialogVisible" width="60%" @close="resetInventory">
      <el-table :data="inventoryItems" border style="width: 100%">
        <!-- 添加物品 ID 列 -->
        <el-table-column prop="item_id" label="物品ID" width="100" />
        <el-table-column prop="item_name" label="物品名称" width="180" />
        <el-table-column prop="item_type" label="物品类型" width="120">
          <template #default="scope">
            <span>{{ getItemTypeText(scope.row.item_type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_unit" label="单位" width="100" />
        <el-table-column prop="item_num" label="数量" width="100" />
        <el-table-column prop="item_price" label="单价" width="100" />
        <el-table-column prop="item_priceunit" label="价格单位" width="120" />
        <el-table-column prop="item_desc" label="物品描述" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inventoryDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStorehouseByGroup, getItemByStoreGroupId } from '@/api/warehouse';

export default {
  data() {
    return {
      storehouses: [], // 存储仓库列表
      inventoryItems: [], // 存储选中仓库的库存物品
      inventoryDialogVisible: false, // 控制库存详情弹窗的显示
      currentStorehouseId: null, // 当前查看的仓库ID
    };
  },
  methods: {
    // 获取仓库列表
    async fetchStorehouses() {
      try {
        const res = await getStorehouseByGroup();
        console.log("返回的仓库列表：", res); // 打印返回结果
        if (res.code === 0) {
          this.storehouses = res.data;
        } else {
          this.$message.error('获取仓库列表失败1');
        }
      } catch (error) {
        console.error('获取仓库列表失败2', error);
        this.$message.error('获取仓库列表失败3');
      }
    },

    // 获取仓库状态文本
    getStorehouseStatusText(status) {
      const statusMap = {
        1: '正常',
        2: '维护中',
        3: '弃用',
        4: '问题',
      };
      return statusMap[status] || '未知';
    },

    // 获取物品类型文本
    getItemTypeText(type) {
      const typeMap = {
        1: '设备',
        2: '其他',
      };
      return typeMap[type] || '未知';
    },

    // 查看库存
    async viewInventory(storehouse) {
      this.currentStorehouseId = storehouse.storehouse_id; // 设置当前查看的仓库ID
      try {
        const res = await getItemByStoreGroupId(storehouse.storehouse_groupid);
        if (res.code === 0) {
          this.inventoryItems = res.data.filter(item => item.item_storehouseid === this.currentStorehouseId);
          this.inventoryDialogVisible = true; // 显示库存弹窗
        } else {
          this.$message.error('获取库存失败');
        }
      } catch (error) {
        console.error('获取库存失败', error);
        this.$message.error('获取库存失败');
      }
    },

    // 重置库存详情
    resetInventory() {
      this.inventoryItems = [];
      this.currentStorehouseId = null;
    },
  },
  mounted() {
    this.fetchStorehouses(); // 加载仓库列表
  },
};
</script>

<style scoped>
.warehouse-manage {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
