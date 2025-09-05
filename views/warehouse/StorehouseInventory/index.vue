<template>
  <div class="storehouse-inventory">
    <!-- 操作按钮 -->
    <el-row class="header">
      <el-col :span="24">
        <el-button type="primary" @click="showAddDialog">新建物品</el-button>
      </el-col>
    </el-row>

    <!-- 库存表格 -->
    <el-row v-for="storehouse in storehouses" :key="storehouse.id" class="storehouse-box">
      <el-col :span="24">
        <el-card :header="`仓库 ${storehouse.name}`" class="storehouse-card">
          <el-table :data="storehouse.items" border stripe>
            <el-table-column label="物品名称" prop="item_name" width="180"></el-table-column>
            <el-table-column label="物品类型" prop="item_type" width="150">
              <template slot-scope="scope">
                <span>{{ getItemTypeLabel(scope.row.item_type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="item_num" width="100"></el-table-column>
            <el-table-column label="单价" prop="item_price" width="100"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加物品对话框 -->
    <el-dialog title="新建物品" :visible.sync="addDialogVisible" @close="resetAddForm">
      <el-form :model="addForm" ref="addForm" label-width="120px">
        <el-form-item label="物品名称" prop="item_name" :rules="[{ required: true, message: '请输入物品名称', trigger: 'blur' }]">
          <el-input v-model="addForm.item_name"></el-input>
        </el-form-item>
        <el-form-item label="物品类型" prop="item_type" :rules="[{ required: true, message: '请选择物品类型', trigger: 'change' }]">
          <el-select v-model="addForm.item_type" placeholder="请选择物品类型">
            <el-option label="设备" :value="1"></el-option>
            <el-option label="其他" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="item_unit" :rules="[{ required: true, message: '请输入单位', trigger: 'blur' }]">
          <el-input v-model="addForm.item_unit"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="item_num" :rules="[{ required: true, message: '请输入数量', trigger: 'blur' }]">
          <el-input type="number" v-model="addForm.item_num"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="item_price" :rules="[{ required: true, message: '请输入单价', trigger: 'blur' }]">
          <el-input type="number" v-model="addForm.item_price"></el-input>
        </el-form-item>
        <el-form-item label="价格单位" prop="item_priceunit">
          <el-input v-model="addForm.item_priceunit"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="item_desc">
          <el-input type="textarea" v-model="addForm.item_desc" autosize></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="item_storehouseid" :rules="[{ required: true, message: '请选择仓库', trigger: 'change' }]">
          <el-select v-model="addForm.item_storehouseid" placeholder="请选择仓库">
            <el-option v-for="storehouse in storehouses" :key="storehouse.id" :label="storehouse.name" :value="storehouse.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑物品对话框 -->
    <el-dialog title="编辑物品" :visible.sync="editDialogVisible" @close="resetEditForm">
      <el-form :model="editForm" ref="editForm" label-width="120px">
        <el-form-item label="物品名称" prop="item_name" :rules="[{ required: true, message: '请输入物品名称', trigger: 'blur' }]">
          <el-input v-model="editForm.item_name"></el-input>
        </el-form-item>
        <el-form-item label="物品类型" prop="item_type">
          <el-input :value="getItemTypeLabel(editForm.item_type)" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="item_unit">
          <el-input v-model="editForm.item_unit"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="item_num">
          <el-input type="number" v-model="editForm.item_num"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="item_price">
          <el-input type="number" v-model="editForm.item_price"></el-input>
        </el-form-item>
        <el-form-item label="价格单位" prop="item_priceunit">
          <el-input v-model="editForm.item_priceunit"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="item_desc">
          <el-input type="textarea" v-model="editForm.item_desc" autosize></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="item_storehouseid">
          <el-select v-model="editForm.item_storehouseid" placeholder="请选择仓库">
            <el-option v-for="storehouse in storehouses" :key="storehouse.id" :label="storehouse.name" :value="storehouse.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllItem, insertItem, updateItem, deleteItem, getAllStorehouses } from '@/api/warehouse'

export default {
  data() {
    return {
      storehouses: [], // 仓库列表
      addDialogVisible: false, // 新建物品对话框显示状态
      editDialogVisible: false, // 编辑物品对话框显示状态
      addForm: {
        item_name: '',
        item_type: 1,
        item_unit: '',
        item_num: 0,
        item_price: 0,
        item_priceunit: '',
        item_desc: '',
        item_storehouseid: null
      },
      editForm: {
        item_id: null,
        item_name: '',
        item_type: 1,
        item_unit: '',
        item_num: 0,
        item_price: 0,
        item_priceunit: '',
        item_desc: '',
        item_storehouseid: null
      }
    }
  },
  methods: {
    // 获取所有仓库数据
    fetchStorehouses() {
      getAllStorehouses().then(response => {
        if (response.code === 0) {
          this.storehouses = response.data.map(storehouse => ({
            id: storehouse.storehouse_id,
            name: storehouse.storehouse_name,
            items: []
          }))
        } else {
          this.$message.error('获取仓库列表失败')
        }
      })
    },

    // 获取所有库存数据
    fetchInventory() {
      getAllItem().then(response => {
        if (response.code === 0) {
          const storehouseMap = {}
          response.data.forEach(item => {
            if (!storehouseMap[item.item_storehouseid]) {
              storehouseMap[item.item_storehouseid] = {
                id: item.item_storehouseid,
                name: `仓库 ${item.item_storehouseid}`, // 仓库名称可以根据实际情况修改
                items: []
              }
            }
            storehouseMap[item.item_storehouseid].items.push(item)
          })
          this.storehouses.forEach(storehouse => {
            if (storehouseMap[storehouse.id]) {
              storehouse.items = storehouseMap[storehouse.id].items
            }
          })
        } else {
          this.$message.error('获取库存数据失败')
        }
      })
    },

    // 获取物品类型的标签
    getItemTypeLabel(type) {
      return type === 1 ? '设备' : '其他'
    },

    // 新建物品对话框
    showAddDialog() {
      this.addDialogVisible = true
    },

    // 提交新建物品
    addItem() {
      insertItem(this.addForm).then(response => {
        if (response.code === 0) {
          this.$message.success('物品添加成功')
          this.fetchInventory()
          this.addDialogVisible = false
        } else {
          this.$message.error('物品添加失败')
        }
      })
    },

    // 编辑物品
    showEditDialog(item) {
      this.editForm = { ...item }
      this.editDialogVisible = true
    },

    // 更新物品
    updateItem() {
      updateItem(this.editForm).then(response => {
        if (response.code === 0) {
          this.$message.success('物品更新成功')
          this.fetchInventory()
          this.editDialogVisible = false
        } else {
          this.$message.error('物品更新失败')
        }
      })
    },

    // 删除物品
    deleteItem(item) {
      if (item.item_num !== 0) {
        this.$message.error('物品库存不为0，不能删除')
        return
      }
      this.$confirm('确定要删除这个物品吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(item.item_id).then(response => {
          if (response.code === 0) {
            this.$message.success('物品删除成功')
            this.fetchInventory()
          } else {
            this.$message.error('物品删除失败')
          }
        })
      }).catch(() => {})
    },

    // 重置添加表单
    resetAddForm() {
      this.addForm = {
        item_name: '',
        item_type: 1,
        item_unit: '',
        item_num: 0,
        item_price: 0,
        item_priceunit: '',
        item_desc: '',
        item_storehouseid: null
      }
    },

    // 重置编辑表单
    resetEditForm() {
      this.editForm = {
        item_id: null,
        item_name: '',
        item_type: 1,
        item_unit: '',
        item_num: 0,
        item_price: 0,
        item_priceunit: '',
        item_desc: '',
        item_storehouseid: null
      }
    }
  },

  created() {
    this.fetchStorehouses()  // 获取仓库数据
    this.fetchInventory()    // 获取库存数据
  }
}
</script>

<style scoped>
.storehouse-inventory {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.storehouse-box {
  margin-bottom: 20px;
}

.storehouse-card {
  margin-bottom: 20px;
}
</style>
