<template>
    <div class="vendor-manage">
      <el-row>
        <el-col :span="24">
          <el-card>
            <el-button type="primary" @click="openAddSupplierDialog">新建供应商</el-button>
            <el-table :data="suppliers" stripe style="width: 100%" :loading="loading">
              <el-table-column prop="supplier_id" label="ID" width="80"></el-table-column>
              <el-table-column prop="supplier_name" label="供应商名称"></el-table-column>
              <el-table-column prop="supplier_address" label="供应商地址"></el-table-column>
              <el-table-column prop="supplier_phone" label="联系方式"></el-table-column>
              <el-table-column prop="supplier_email" label="电子邮件"></el-table-column>
              <el-table-column prop="supplier_desc" label="供应商描述"></el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" @click="editSupplier(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteSupplier(scope.row.supplier_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
  
      <!-- 新建供应商弹窗 -->
      <el-dialog title="新建供应商" :visible.sync="addDialogVisible" width="50%">
        <el-form :model="newSupplier" ref="newSupplierForm" label-width="100px">
          <el-form-item label="供应商名称" prop="supplier_name" :rules="[{ required: true, message: '请输入供应商名称', trigger: 'blur' }]">
            <el-input v-model="newSupplier.supplier_name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="供应商地址" prop="supplier_address">
            <el-input v-model="newSupplier.supplier_address" placeholder="请输入供应商地址"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="supplier_phone">
            <el-input v-model="newSupplier.supplier_phone" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件" prop="supplier_email">
            <el-input v-model="newSupplier.supplier_email" placeholder="请输入电子邮件"></el-input>
          </el-form-item>
          <el-form-item label="供应商描述" prop="supplier_desc">
            <el-input v-model="newSupplier.supplier_desc" placeholder="请输入供应商描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewSupplier">确定</el-button>
        </div>
      </el-dialog>
  
      <!-- 编辑供应商弹窗 -->
      <el-dialog title="编辑供应商" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editSupplierData" ref="editSupplierForm" label-width="100px">
          <el-form-item label="供应商名称" prop="supplier_name" :rules="[{ required: true, message: '请输入供应商名称', trigger: 'blur' }]">
            <el-input v-model="editSupplierData.supplier_name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="供应商地址" prop="supplier_address">
            <el-input v-model="editSupplierData.supplier_address" placeholder="请输入供应商地址"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="supplier_phone">
            <el-input v-model="editSupplierData.supplier_phone" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件" prop="supplier_email">
            <el-input v-model="editSupplierData.supplier_email" placeholder="请输入电子邮件"></el-input>
          </el-form-item>
          <el-form-item label="供应商描述" prop="supplier_desc">
            <el-input v-model="editSupplierData.supplier_desc" placeholder="请输入供应商描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditSupplier">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getAllSupplier, insertSupplier, updateSupplier, deleteSupplier } from '@/api/warehouse'
  import { Message } from 'element-ui'
  
  export default {
    data() {
      return {
        loading: false,
        suppliers: [],  // 所有供应商的数据
        addDialogVisible: false,  // 新建供应商弹窗的显示状态
        editDialogVisible: false,  // 编辑供应商弹窗的显示状态
        newSupplier: {  // 新建供应商的表单数据
          supplier_name: '',
          supplier_address: '',
          supplier_phone: '',
          supplier_email: '',
          supplier_desc: ''
        },
        editSupplierData: {  // 编辑供应商的表单数据
          supplier_id: '',
          supplier_name: '',
          supplier_address: '',
          supplier_phone: '',
          supplier_email: '',
          supplier_desc: ''
        }
      }
    },
    methods: {
      // 获取所有供应商
      fetchSuppliers() {
        this.loading = true
        getAllSupplier()
          .then(response => {
            if (response.code === 0) {
              this.suppliers = response.data
            } else {
              Message.error('获取供应商列表失败')
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      
      // 打开新建供应商弹窗
      openAddSupplierDialog() {
        this.addDialogVisible = true
      },
  
      // 提交新建供应商
      submitNewSupplier() {
        this.$refs.newSupplierForm.validate(valid => {
          if (valid) {
            insertSupplier(this.newSupplier)
              .then(response => {
                if (response.code === 0) {
                  this.$message.success('新建供应商成功')
                  this.addDialogVisible = false
                  this.fetchSuppliers()  // 刷新供应商列表
                } else {
                  this.$message.error('新建供应商失败')
                }
              })
          }
        })
      },
  
      // 打开编辑供应商弹窗
      editSupplier(row) {
        this.editSupplierData = { ...row }  // 复制当前行数据
        this.editDialogVisible = true
      },
  
      // 提交编辑供应商
      submitEditSupplier() {
        this.$refs.editSupplierForm.validate(valid => {
          if (valid) {
            updateSupplier(this.editSupplierData)
              .then(response => {
                if (response.code === 0) {
                  this.$message.success('修改供应商成功')
                  this.editDialogVisible = false
                  this.fetchSuppliers()  // 刷新供应商列表
                } else {
                  this.$message.error('修改供应商失败')
                }
              })
          }
        })
      },
  
      // 删除供应商
      deleteSupplier(supplierId) {
        this.$confirm('确定删除此供应商?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteSupplier(supplierId)
            .then(response => {
              if (response.code === 0) {
                this.$message.success('删除供应商成功')
                this.fetchSuppliers()  // 刷新供应商列表
              } else {
                this.$message.error('删除供应商失败')
              }
            })
        }).catch(() => {})
      }
    },
  
    mounted() {
      this.fetchSuppliers()  // 页面加载时获取所有供应商
    }
  }
  </script>
  
  <style scoped>
  .vendor-manage {
    margin: 20px;
  }
  .dialog-footer {
    text-align: right;
  }
  </style>
  