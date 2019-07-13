<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.orderSn" class="form-item" placeholder="订单编号" />
          </el-form-item>
          <el-form-item label="处理状态: ">
            <el-select v-model="listQuery.applyStatus" class="form-item" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间: ">
            <el-date-picker
              class="form-item"
              v-model="listQuery.createTimeStart"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="开始时间">
            </el-date-picker>
            &nbsp;至&nbsp;
            <el-date-picker
              class="form-item"
              v-model="listQuery.createTimeEnd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请人: ">
            &nbsp;&nbsp;
            <el-input v-model="listQuery.receiverKeyword" class="form-item" placeholder="申请人姓名/手机号码" />
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
              {{ $t('table.search') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="box-card">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="待处理" name="waitaudit"></el-tab-pane>
          <el-tab-pane label="退货中" name="returngoods"></el-tab-pane>
          <el-tab-pane label="已完成" name="returnfinish"></el-tab-pane>
          <el-tab-pane label="已拒绝" name="abordreturn"></el-tab-pane>
        </el-tabs>
      </template>
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
        <el-table-column label="订单详情" min-width="160" align="left">
          <template slot-scope="scope">
            订单号:{{ scope.row.orderSn }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="100px" align="center">
          <template slot-scope="scope">
            <span><img style="height: 50px" :src="scope.row.productPic"></span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column label="退货原因" width="120" align="left">
          <template slot-scope="scope">
            {{ scope.row.reason }}
          </template>
        </el-table-column>
        <el-table-column label="退货数量/金额" width="120" >
          <template slot-scope="scope">
            <p>数量:{{ scope.row.returnCount }}</p>
            <p>金额:{{ scope.row.returnAmount }}</p>
          </template>
        </el-table-column>
        <el-table-column label="退货信息" min-width="120" align="left">
          <template slot-scope="scope">
            <p>退货人:{{ scope.row.returnName }}</p>
            <p>手机号:{{ scope.row.returnPhone }}</p>
          </template>
        </el-table-column>
        <el-table-column label="收货信息" min-width="120" align="left">
          <template slot-scope="scope" v-if="scope.row.receiveMan">
            <p>联系人:{{ scope.row.receiveMan }}</p>
            <p>手机号:{{ scope.row.receivePhone }}</p>
          </template>
        </el-table-column>
        <el-table-column label="是否收货" width="80" align="center">
          <template slot-scope="scope">{{scope.row.isReceived | formatReceived}}</template>
        </el-table-column>
        <el-table-column label="审核信息" width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.applyStatus | formatApplyStatus}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleDetail(scope.$index, scope.row)">
              <span v-if="scope.row.applyStatus != 0">
                详情
              </span>
              <span v-else>
                处理
              </span>
            </el-button>
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
  import {fetchList} from '@/api/oms/return'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

// 默认查询参数
const defaultListQuery = {
  orderSn: null,
  receiverKeyword: null,
  createTimeStart: null,
  applyStatus: null,
  pageNum: 1,
  pageSize: 10
}

export default {
  name: 'OrderTable',
  directives: { waves },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      activeName: 'all',
      statusOptions: [
        {
          label: '待处理',
          value: 0
        },
        {
          label: '退货中',
          value: 1
        },
        {
          label: '已完成',
          value: 2
        },
        {
          label: '已拒绝',
          value: 3
        }
      ],
      tableKey: 0,
      subTableKey: 0,
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
    formatReceived(value) {
      if (value === 1){
        return '收货'
      } else {
        return '未收货'
      }
    },
    formatApplyStatus(value) {
      if (value === 0){
        return '待处理'
      } else if (value === 1){
        return '退货中'
      } else if (value === 2){
        return '已完成'
      } else if (value === 3){
        return '已拒绝'
      }
      return '待处理'
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
    handleTabClick(tab, event) {
      var name = tab.name;
      if ('all' === name){
        this.listQuery.applyStatus = null;
      }else if('waitaudit' === name){
        this.listQuery.applyStatus = 0;
      }else if('returngoods' === name){
        this.listQuery.applyStatus = 1;
      }else if('returnfinish' === name){
        this.listQuery.applyStatus = 2;
      }else if('abordreturn' === name){
        this.listQuery.applyStatus = 3;
      }
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.getList();
    },
    //查询订单详情
    handleDetail(index, row){
      this.$router.push({path:'/oms/return/detail/'+row.id})
    }
  }
}
</script>
