<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.name" class="form-item" placeholder="等级名称" />
          </el-form-item>
          <el-form-item label="等级数值: ">
            <el-input v-model="listQuery.index" class="form-item" placeholder="等级" />
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
        <el-table-column label="编号" width="80" align="left">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="等级名称" width="180"  align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="等级" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.level}}
          </template>
        </el-table-column>
        <el-table-column label="需要积分" width="80" align="left">
          <template slot-scope="scope">
            {{ scope.row.growthPoint}}
          </template>
        </el-table-column>
        <el-table-column label="赠送优惠" width="120" align="left">
          <template slot-scope="scope">
            {{ scope.row.growthCouponName}}
          </template>
        </el-table-column>
        <el-table-column label="积分" width="80" align="left">
          <template slot-scope="scope">
            {{ scope.row.growthCouponName}}
          </template>
        </el-table-column>
        <el-table-column label="描述" align="left">
          <template slot-scope="scope">
            {{ scope.row.description}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" align="center">
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
  import {fetchList, getDetail, deleteLevel} from '@/api/member/level'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

  // 默认查询参数
  const defaultListQuery = {
    name: null,
    level: null,
    pageNum: 1,
    pageSize: 10
  }

  export default {
    name: 'LevelTable',
    directives: { waves },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        entityId: null,
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
      },
      formatUseType(value){
        if (value === 1){
          return '指定分类'
        } else if(value === 2){
          return '指定商品'
        }else{
          return '全场通用'
        }
      },
      formatType(value) {
        if (value === 1){
          return '满赠'
        } else if(value === 2){
          return '限时优惠'
        }else if(value === 3){
          return '赠品'
        }else {
          return '满减'
        }
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
        this.$router.push({path: '/member/member/create/0'})
      },
      handleUpdate(index, row){
        this.entityId = row.id;
        this.$router.push({path: '/member/member/create/'+row.id})
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          deleteLevel(row.id).then(response=>{
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
