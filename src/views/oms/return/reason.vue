<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.name" class="form-item" placeholder="退货原因" />
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
              {{ $t('table.search') }}
            </el-button>
            <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleAdd">
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="box-card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        stripe
        style="font-size: 12px;"
        fit
        highlight-current-row
        :default-expand-all="false"
        @sort-change="sortChange">
        <el-table-column label="编号" min-width="10px" align="left">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="退货原因" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用"
              @change="changeStatus($event,scope.row,scope.$index)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="left">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatCreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" style="font-size: 12px;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,15,25]"
          :current-page.sync="listQuery.pageNum"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @pagination="getList"
        />
      </div>
    </el-card>
    <el-dialog title="编辑退款原因" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="returnReason" label-position="left"  :model="returnReason" label-width="90px">
        <el-form-item label="退款原因:">
          <el-input v-model="returnReason.name"></el-input>
        </el-form-item>

        <el-form-item label="是否启用:">
          <el-col :span="8">
            <el-switch
              v-model="returnReason.status"
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用">
            </el-switch>
          </el-col>
          <el-col :span="3">
            <el-form-item label="排序:"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-input v-model="returnReason.sort"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="returnReason.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, updateStatus, getDetail, createReason, updateReason, deleteReason} from '@/api/oms/returnReason'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

// 默认查询参数
const defaultListQuery = {
  name: null,
  pageNum: 1,
  pageSize: 10
}
const defaultReturnReason = {
  name:null,
  sort:100,
  status:0,
  createTime:null
}

export default {
  name: 'ReasonTable',
  directives: { waves },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      reasonId: null,
      dialogFormVisible: false,
      returnReason:Object.assign({},defaultReturnReason),
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const dateTime = new Date(time);
      return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
    },
    formatStatus(value) {
      if (value === 1){
        return '未启用'
      } else if (value === 0){
        return '启用'
      }
      return '未启用'
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = parseInt(response.result.total)
        this.listLoading = false
      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'sort') {
        if (order === 'ascending') {
          this.listQuery.sort = '+sort'
        } else {
          this.listQuery.sort = '-sort'
        }
        this.handleSearchList()
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    changeStatus(data,row,index) {
      //调用接口
      const dataJson = {};
      dataJson.id = row.id
      dataJson.status = data
      updateStatus(dataJson).then(response => {
      })
    },
    handleAdd() {
      this.reasonId = null
      this.dialogFormVisible = true;
      this.returnReason=Object.assign({},defaultReturnReason);
    },
    handleUpdate(index, row){
      this.reasonId = row.id;
      getDetail(row.id).then(response=>{
        this.returnReason=response.result;
        this.dialogFormVisible = true;
      });
    },
    handlerConfirm(){
      if(this.reasonId==null){
        //添加操作
        createReason(this.returnReason).then(response=>{
          this.dialogFormVisible=false;
          this.reasonId=null;
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.getList();
        });
      }else{
        //编辑操作
        updateReason(this.reasonId,this.returnReason).then(response=>{
          this.dialogFormVisible=false;
          this.reasonId=null;
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.getList();
        });
      }
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteReason(row.id).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getList();
        });
      }).catch(() => {});
    }
  }
}
</script>

<style>
  .el-switch__label * {
    line-height: 1;
    font-size: 10px;
    display: inline-block;
  }
</style>
