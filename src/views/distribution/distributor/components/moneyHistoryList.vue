<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="记录类型: ">
        <el-select v-model="listQuery.type" class="form-item" placeholder="全部" :clearable="true">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
          {{ $t('table.search') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="historyList"
      stripe
      style="font-size: 12px;"
      fit
      highlight-current-row
      :default-expand-all="false"
      @sort-change="sortChange">
      <el-table-column label="编号" width="60" align="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="120" align="left">
        <template slot-scope="scope">
          {{ scope.row.money }}(元)
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.type | formatType}}
        </template>
      </el-table-column>
      <el-table-column label="记录" align="left">
        <template slot-scope="scope">
          {{scope.row.history}}
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="120" align="left">
        <template slot-scope="scope">
          {{ scope.row.handlerUserName }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80" align="center">
        <template slot-scope="scope">
          <span><img style="height: 35px;vertical-align:middle;" :src="scope.row.handlerUserPic"></span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="120" align="center">
        <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
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
        @pagination="getHistoryList"
      />
    </div>
  </div>
</template>
<script>
  import {fetchHistroyList} from '@/api/distribution/distributor'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

  const defaultListQuery = {
    type: null,
    pageNum: 1,
    pageSize: 10
  }
  // 默认查询参数
  export default {
    name: 'MoneyHistory',
    directives: {waves},
    props: {
      distributorId: {
        type: String,
        default: -1
      }
    },
    filters: {
      formatCreateTime(time) {
        if (time == null || time === '') {
          return ''
        }
        const dateTime = new Date(time);
        return formatDate(dateTime, 'yyyy-MM-dd');
      },
      formatUseTime(time) {
        if (time == null || time === '') {
          return ''
        }
        const dateTime = new Date(time);
        return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
      },
      formatNull(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无'
        } else {
          return value
        }
      },
      formatLongText(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无';
        } else if (value.length > 8) {
          return value.substr(0, 8) + '...'
        } else {
          return value
        }
      },
      formatType(value){
        if (value === 0) {
          return '分销';
        }else if (value === 1) {
          return '返点';
        }else if(value === 2) {
          return '提现'
        }
        return ''
      }
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        total: 0,
        historyList: null,
        typeOptions: [{
          value: 0,
          label: '分销'
        },{
          value: 1,
          label: '返点'
        },{
          value: 2,
          label: '提现'
        }]
      }
    },
    created() {
      this.getHistoryList();
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.pageNum = 1
        this.listQuery.pageSize = val
        this.getHistoryList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getHistoryList()
      },
      sortChange(data) {

      },
      handleSearchList() {
        this.listQuery.pageNum = 1
        this.getHistoryList()
      },
      getHistoryList(){
        this.listLoading = true
        this.listQuery.distributorId = this.distributorId;

        fetchHistroyList(this.listQuery).then(response => {
          this.historyList = response.result.list
          this.total = parseInt(response.result.total)
          this.listLoading = false
        });
      }
    }
  }
</script>
