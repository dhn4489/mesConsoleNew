<template>
  <div class="oai-management">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>出入库信息管理</span>
            <el-button
              @click="handleCreate"
              type="primary"
              style="float: right"
              icon="el-icon-plus"
            >新建出入库记录</el-button>
          </div>
          <el-table
            :data="oaiList"
            border
            style="width: 100%; margin-top: 20px"
            :loading="loading"
          >
            <el-table-column label="ID" prop="oai_id"></el-table-column>
            <el-table-column label="类型" prop="oai_type">
              <template slot-scope="scope">
                {{ scope.row.oai_type === 1 ? '入库' : '出库' }}
              </template>
            </el-table-column>
            <el-table-column label="物品ID" prop="oai_itemid"></el-table-column>
            <el-table-column label="数量" prop="oai_itemnum"></el-table-column>
            <el-table-column label="单位" prop="oai_itemunit"></el-table-column>
            <el-table-column label="状态" prop="oai_status">
              <template slot-scope="scope">
                {{ scope.row.oai_status }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  type="primary"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  @click="handleDelete(scope.row.oai_id)"
                  type="danger"
                  style="margin-left: 10px"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 创建/编辑 出入库信息弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="创建/编辑出入库信息"
      width="50%"
    >
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.oai_type" placeholder="请选择类型">
            <el-option label="入库" :value="1"></el-option>
            <el-option label="出库" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库位置ID" :label-width="formLabelWidth">
          <el-input v-model="form.oai_locationid" placeholder="请输入位置ID"></el-input>
        </el-form-item>
        <el-form-item label="入库类型" :label-width="formLabelWidth">
          <el-select v-model="form.oai_lotype" placeholder="请选择入库类型">
            <el-option label="类型 1" :value="1"></el-option>
            <el-option label="类型 2" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品ID" :label-width="formLabelWidth">
          <el-input v-model="form.oai_itemid" placeholder="请输入物品ID"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input
            v-model="form.oai_itemnum"
            type="number"
            placeholder="请输入数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" :label-width="formLabelWidth">
          <el-input v-model="form.oai_itemunit" placeholder="请输入物品单位"></el-input>
        </el-form-item>
        <el-form-item label="运输单ID" :label-width="formLabelWidth">
          <el-input
            v-model="form.oai_transportid"
            placeholder="请输入运输单ID"
          ></el-input>
        </el-form-item>
        <!-- 状态选择 -->
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.oai_status" placeholder="请选择状态">
            <el-option label="未完成" :value="'未完成'"></el-option>
            <el-option label="已完成" :value="'已完成'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOAIByStoreGroup,
  createOAI,
  updateOAI,
  deleteOAI
} from '@/api/warehouse';
import { ElMessage } from 'element-ui';
import store from '@/store'
const foreignid = store.getters.foreignid
export default {
  data() {
    return {
      oaiList: [], // 出入库信息列表
      loading: false, // 加载状态
      dialogVisible: false, // 弹窗是否显示
      form: {
        oai_type: 1,           // 类型，1：入库，2：出库
        oai_locationid: '',    // 位置ID
        oai_lotype: 1,         // 入库类型ID
        oai_itemid: '',        // 物品ID
        oai_itemnum: '',       // 物品数量
        oai_itemunit: '',      // 物品单位
        oai_transportid: '',   // 运输单ID
        oai_status: '未完成'   // 状态，默认为未完成
      },
      formLabelWidth: '120px', // 表单字段宽度
      currentOaiId: null      // 当前编辑的出入库记录ID
    };
  },
  methods: {
    // 获取出入库信息
    async fetchOAI() {
      this.loading = true;
      try {
        const response = await getOAIByStoreGroup(foreignid); // 假设当前仓库组ID为1
        if (response.code === 0) {
          this.oaiList = response.data;
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('获取出入库信息失败');
      } finally {
        this.loading = false;
      }
    },

    // 新建出入库信息
    handleCreate() {
      this.dialogVisible = true;
      this.form = {
        oai_type: 1,
        oai_locationid: '',
        oai_lotype: 1,
        oai_itemid: '',
        oai_itemnum: '',
        oai_itemunit: '',
        oai_transportid: '',
        oai_status: '未完成' // 默认状态为未完成
      };
      this.currentOaiId = null;
    },

    // 编辑出入库信息
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = { ...row }; // 将数据填充到表单
      this.currentOaiId = row.oai_id;
    },

    // 提交表单（创建或修改）
    async handleSubmit() {
      try {
        const data = { ...this.form };
        let response;
        if (this.currentOaiId) {
          // 修改出入库信息
          response = await updateOAI(1, { oai_id: this.currentOaiId, oai_status: data.oai_status });
        } else {
          // 创建出入库信息
          response = await createOAI(1, data);
        }

        if (response.code === 0) {
          this.dialogVisible = false;
          ElMessage.success('操作成功');
          this.fetchOAI(); // 刷新列表
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('操作失败');
      }
    },

    // 删除出入库信息
    async handleDelete(oaiId) {
      try {
        const response = await deleteOAI(1, oaiId);
        if (response.code === 0) {
          ElMessage.success('删除成功');
          this.fetchOAI(); // 刷新列表
        } else {
          ElMessage.error(response.message);
        }
      } catch (error) {
        ElMessage.error('删除失败');
      }
    }
  },
  mounted() {
    this.fetchOAI();
  }
};
</script>

<style scoped>
.oai-management {
  padding: 20px;
}
</style>
