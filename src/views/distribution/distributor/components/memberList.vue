<template>
  <div class="app-container">
    <el-form :inline="true" :model="memberQuery" class="demo-form-inline">
      <el-form-item label="输入搜索: ">
        <el-input v-model="memberQuery.nickname" class="form-item" placeholder="会员名称" />
      </el-form-item>
      <el-form-item label="会员类型: ">
        <el-select v-model="memberQuery.sourceType" class="form-item" placeholder="全部" :clearable="true">
          <el-option
            v-for="item in memberTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleMemberSearchList">
          {{ $t('table.search') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="memberLoading"
      :data="memberList"
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
          <el-button type="text" style="font-size: 12px;" @click="handleMemberDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="memberQuery.pageSize"
        :page-sizes="[10,15,25]"
        :current-page.sync="memberQuery.pageNum"
        :total="memberTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @pagination="getMemberList"
      />
    </div>
  </div>
</template>
<script>
  import {fetchList as fetchMemberList,getDetail as getMemberDetail, deleteMember} from '@/api/member/member'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

  const defaultListQuery = {
    type: null,
    pageNum: 1,
    pageSize: 10
  }
  // 默认查询参数
  export default {
    name: 'MemberList',
    directives: {waves},
    props: {
      parentId: {
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
      formatGender(value){
        if (value === 1){
          return '男'
        } else if (value === 2){
          return '女'
        }
        return '未知'
      },
    },
    data() {
      return {
        memberQuery: Object.assign({}, defaultListQuery),
        memberLoading: true,
        memberTotal: 0,
        accountLoading: true,
        account: {},
        memberList: null,
        memberTypeOptions: [{
          value: 0,
          label: '微信'
        },{
          value: 1,
          label: '支付宝'
        }]
      }
    },
    created() {
      this.getMemberList();
    },
    methods: {
      handleSizeChange(val) {
        this.memberQuery.pageNum = 1
        this.memberQuery.pageSize = val
        this.getMemberList()
      },
      handleCurrentChange(val) {
        this.memberQuery.pageNum = val
        this.getMemberList()
      },
      sortChange(data) {

      },
      getAccountData(index,row){
        this.accountLoading = true;
        this.account = {}
        getMemberDetail(row.id).then(response => {
          if (response.result.account){
            this.account = response.result.account
            this.accountLoading = false;
          }
        })
      },
      handleMemberSearchList(){
        this.memberQuery.pageNum = 1
        this.getMemberList()
      },
      getMemberList(){
        this.memberLoading = true
        this.memberQuery.distributorId = this.id;

        fetchMemberList(this.memberQuery).then(response => {
          this.memberList = response.result.list
          this.memberTotal = parseInt(response.result.total)
          this.memberLoading = false
        });
      },
    }
  }
</script>
<style scoped>

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    line-height: 40px;
    padding-left: 10px;

  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .font-small {
    font-size: 12px;
    color: #606266;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
  .el-switch__label * {
    line-height: 1;
    font-size: 10px;
    display: inline-block;
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
