<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.name" class="form-item" placeholder="品牌名称" />
          </el-form-item>
          <el-form-item label="英文名称: ">
            <el-input v-model="listQuery.enName" class="form-item" placeholder="英文名称" />
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
        <el-table-column label="编号" min-width="20px" align="left">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="图标" align="left" width="100px">
          <template slot-scope="scope">
            <span><img style="height: 55px" :src="scope.row.logo"></span>
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" width="200" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="英文名称" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.enName }}
          </template>
        </el-table-column>
        <el-table-column label="首字母" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.firstLetter }}
          </template>
        </el-table-column>
        <el-table-column label="品牌故事" align="left">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort }}
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
  </div>
</template>

<script>
import {fetchList, getDetail, modifyBrand, deleteBrand} from '@/api/product/brand'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

// 默认查询参数
const defaultListQuery = {
  name: null,
  enName: null,
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
  name: 'BrandTable',
  directives: { waves },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
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
    handleAdd() {
      this.$router.push({path: '/products/brand/create/0'})
    },
    handleUpdate(index, row){
      this.$router.push({path: '/products/brand/create/'+row.id})
    },
    handleDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteBrand(row.id).then(response=>{
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
