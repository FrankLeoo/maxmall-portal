<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.nickname" class="form-item" placeholder="会员名称" />
          </el-form-item>
          <el-form-item label="会员类型: ">
            <el-select v-model="listQuery.sourceType" class="form-item" placeholder="全部" :clearable="true">
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
        <el-table-column label="头像" width="80" align="center">
          <template slot-scope="scope">
            <span><img style="height: 35px;vertical-align:middle;" :src="scope.row.icon"></span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="left">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="性别" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.gender | formatGender}}
          </template>
        </el-table-column>
        <el-table-column label="生日" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.birthday}}
          </template>
        </el-table-column>
        <el-table-column label="等级" width="120" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="180"
              trigger="hover">
              <span style="font-size: 12px;">成长值: {{ scope.row.growth}}</span>
              <el-button slot="reference" type="text" style="font-size: 12px;" >{{ scope.row.memberLevelName}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="积分" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.integration}}
          </template>
        </el-table-column>
        <el-table-column label="邀请人" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.inviterName }}
          </template>
        </el-table-column>
        <el-table-column label="邀请头像" width="100" align="center">
          <template slot-scope="scope">
            <span><img style="height: 35px" :src="scope.row.inviterIcon"></span>
          </template>
        </el-table-column>
        <el-table-column label="账户" width="80" align="left">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="380"
              :ref="'couponPover'+scope.$index"
              @show="getAccountData(scope.$index, scope.row)"
              trigger="hover">
              <div class="form-container-border" v-show="account" v-loading="accountLoading">
                <el-row>
                  <el-col :span="8" class="table-cell table-cell-title">订单数量</el-col>
                  <el-col :span="8" class="table-cell table-cell-title">优惠券数量</el-col>
                  <el-col :span="8" class="table-cell table-cell-title">评价数</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" class="table-cell">{{account.orderCount | formatNull}}</el-col>
                  <el-col :span="8" class="table-cell">{{account.couponCount | formatNull}}</el-col>
                  <el-col :span="8" class="table-cell">{{account.commentCount | formatNull}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" class="table-cell table-cell-title">退货数量</el-col>
                  <el-col :span="16" class="table-cell table-cell-title">累计消费金额</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" class="table-cell">{{account.returnOrderCount | formatNull}}</el-col>
                  <el-col :span="16" class="table-cell">{{account.consumeAmount | formatNull}}(元)</el-col>
                </el-row>
              </div>
            </el-popover>
            <el-button v-popover="'couponPover' + scope.$index" type="text" style="font-size: 12px;" >账户</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
  import {fetchList, getDetail, deleteMember} from '@/api/member/member'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

  // 默认查询参数
  const defaultListQuery = {
    nickname: null,
    sourceType: null,
    pageNum: 1,
    pageSize: 10
  }

  export default {
    name: 'MemberTable',
    directives: { waves },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableKey: 0,
        account: {},
        list: null,
        total: 0,
        listLoading: true,
        accountLoading: true,
        typeOptions: [{
          value: 0,
          label: '微信'
        },{
          value: 1,
          label: '支付宝'
        }],
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
      formatNull(value) {
        if (value === undefined || value === null || value === '') {
          return '暂无'
        } else {
          return value
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝'
        } else if (value === 2) {
          return '微信'
        } else {
          return '未支付'
        }
      },
      formatStatus(value) {
        if (value === 1){
          return '未启用'
        } else if (value === 0){
          return '启用'
        }
        return '未启用'
      },
      formatGender(value){
        if (value === 1){
          return '男'
        } else if (value === 2){
          return '女'
        }
        return '未知'
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
      getAccountData(index,row){
        this.accountLoading = true;
        this.account = {}
        getDetail(row.id).then(response => {
          if (response.result.account){
            this.account = response.result.account
            this.accountLoading = false;
          }
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
      accountShow(){
        this.accountLoading = false;
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleAdd() {
        this.entityId = null
      },
      handleDetail(index, row){
        this.entityId = row.id;
        this.$router.push({path: '/member/member/detail/'+row.id})
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          deleteMember(row.id).then(response=>{
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
  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    line-height: 25px;
    padding-left: 10px;
    vertical-align: center;
    font-size: 12px;
    color: #606266;
    text-align: left;
    overflow: hidden;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .table-cell-title {
    font-size: 12px;
    line-height: 25px;
    background: #F2F6FC;
    color: #303133;
  }
</style>
