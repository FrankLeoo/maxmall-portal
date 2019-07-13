<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.managerUserName" class="form-item" placeholder="分销名称" />
          </el-form-item>
          <el-form-item label="推广编号: ">
            <el-input v-model="listQuery.distributorSn" class="form-item" placeholder="推广编号" />
          </el-form-item>
          <el-form-item label="上级分销: ">
            <el-select v-model="listQuery.parentId" class="form-item" placeholder="请选择分销员" clearable>
              <el-option
                v-for="item in parentDistributorOptions"
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
            <span><img style="height: 35px" :src="scope.row.managerUserPic"></span>
          </template>
        </el-table-column>
        <el-table-column label="分销名称" align="left">
          <template slot-scope="scope">
            {{ scope.row.managerUserName }}
          </template>
        </el-table-column>
        <el-table-column label="店铺" width="100" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.shop">
              <el-popover
                placement="right"
                width="500"
                :ref="'shopPover'+scope.$index"
                trigger="hover">
                <div class="form-container-border">
                  <el-row>
                    <el-col :span="6" class="table-cell table-cell-title">店铺名称</el-col>
                    <el-col :span="6" class="table-cell table-cell-title">店铺主图</el-col>
                    <el-col :span="12" class="table-cell table-cell-title">店铺标题</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="table-cell">{{scope.row.shop.name | formatNull}}</el-col>
                    <el-col :span="6" class="table-cell"><span><img style="height: 20px;vertical-align:middle;" :src="scope.row.shop.pic"></span></el-col>
                    <el-col :span="12" class="table-cell">{{scope.row.shop.title | formatNull}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="table-cell table-cell-title">联系人姓名</el-col>
                    <el-col :span="6" class="table-cell table-cell-title">联系人电话</el-col>
                    <el-col :span="12" class="table-cell table-cell-title">备注</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" class="table-cell">{{scope.row.shop.contactUsername | formatNull}}</el-col>
                    <el-col :span="6" class="table-cell">{{scope.row.shop.contactPhone | formatNull}}</el-col>
                    <el-col :span="12" class="table-cell">{{scope.row.shop.description | formatNull}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" class="table-cell table-cell-title">省</el-col>
                    <el-col :span="8" class="table-cell table-cell-title">市</el-col>
                    <el-col :span="8" class="table-cell table-cell-title">区县</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" class="table-cell">{{scope.row.shop.receiverProvince | formatNull}}</el-col>
                    <el-col :span="8" class="table-cell">{{scope.row.shop.receiverCity | formatNull}}</el-col>
                    <el-col :span="8" class="table-cell">{{scope.row.shop.receiverRegion | formatNull}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="table-cell table-cell-title">详细地址</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="table-cell">{{scope.row.shop.receiverDetailAddress | formatNull}}</el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button v-popover="'shopPover' + scope.$index" type="text" style="font-size: 12px;" >{{ scope.row.shop.name }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="分销等级" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.levelName}}
          </template>
        </el-table-column>
        <el-table-column label="分销比例" width="80" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="380"
              :ref="'distriPover'+scope.$index"
              trigger="hover">
              <div class="form-container-border">
                <el-row>
                  <el-col :span="8" class="table-cell table-cell-title">本级分销</el-col>
                  <el-col :span="8" class="table-cell table-cell-title">父级分销</el-col>
                  <el-col :span="8" class="table-cell table-cell-title">祖父分销</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" class="table-cell">{{scope.row.selfSalesRatio | formatNull}}%</el-col>
                  <el-col :span="8" class="table-cell">{{scope.row.parentSalesRatio | formatNull}}%</el-col>
                  <el-col :span="8" class="table-cell">{{scope.row.grandSalesRatio | formatNull}}%</el-col>
                </el-row>
              </div>
            </el-popover>
            <el-button v-popover="'distriPover' + scope.$index" type="text" style="font-size: 12px;" >分销比例</el-button>
          </template>
        </el-table-column>
        <el-table-column label="需要会费" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isDues === 1">{{ scope.row.duesPoint }}</span>
            <span v-else>无会费</span>
          </template>
        </el-table-column>
        <el-table-column label="是否支付" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isPayed === 1">
              <el-popover
                placement="right"
                width="380"
                :ref="'paymentPover'+scope.$index"
                trigger="hover">
                <div class="form-container-border">
                  <el-row>
                    <el-col :span="8" class="table-cell table-cell-title">是否支付</el-col>
                    <el-col :span="8" class="table-cell table-cell-title">支付时间</el-col>
                    <el-col :span="8" class="table-cell table-cell-title">支付订单号</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" class="table-cell">{{scope.row.isPayed | formatNull }}</el-col>
                    <el-col :span="8" class="table-cell">{{scope.row.payTime | formatCreateTime }}</el-col>
                    <el-col :span="8" class="table-cell">{{scope.row.innerPaySn | formatNull }}</el-col>
                  </el-row>
                </div>
              </el-popover>
              <el-button v-popover="'paymentPover' + scope.$index" type="text" style="font-size: 12px;" >
                已经支付
              </el-button>
            </span>
            <span v-else>未支付</span>
          </template>
        </el-table-column>
        <el-table-column label="支付账户" width="80" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="280"
              :ref="'accountPover'+scope.$index"
              trigger="hover">
              <div class="form-container-border">
                <el-row>
                  <el-col :span="8" class="table-cell table-cell-title">分销类型</el-col>
                  <el-col :span="16" class="table-cell table-cell-title">分销账户</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" class="table-cell">{{scope.row.splitPayType | formatSplitPayType}}</el-col>
                  <el-col :span="16" class="table-cell">{{scope.row.splitPayAccount | formatNull}}</el-col>
                </el-row>
              </div>
            </el-popover>
            <el-button v-popover="'accountPover' + scope.$index" type="text" style="font-size: 12px;" >账户</el-button>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.status | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.createTime | formatCreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">

            <el-button v-if="scope.row.status === 0" type="text" style="font-size: 12px;" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
            <el-popover
              placement="right"
              width="500"
              :ref="'handlerPover'+scope.$index"
              trigger="hover">
              <div class="form-container-border">
                <el-row>
                  <el-col :span="6" class="table-cell table-cell-title">审核人</el-col>
                  <el-col :span="6" class="table-cell table-cell-title">审核昵称</el-col>
                  <el-col :span="12" class="table-cell table-cell-title">审核时间</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6" class="table-cell">{{scope.row.handleManId | formatNull}}</el-col>
                  <el-col :span="6" class="table-cell">{{scope.row.handleManName | formatNull}}</el-col>
                  <el-col :span="12" class="table-cell">{{scope.row.handleTime | formatCreateTime}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="table-cell table-cell-title">审核备注</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="table-cell">{{scope.row.handleNote | formatNull}}</el-col>
                </el-row>
              </div>
            </el-popover>
            <el-button v-if="scope.row.status === 1 || scope.row.status === -1" type="text" style="font-size: 12px;" v-popover="'handlerPover' + scope.$index">查看</el-button>
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
  import {listAll as fetchDistributorList} from '@/api/distribution/distributor'
  import {fetchList} from '@/api/distribution/apply'
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
        list: null,
        total: 0,
        listLoading: true,
        parentDistributorOptions: [],
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
      }
    },
    created() {
      this.getList();
      this.getParentDistributorList()
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
      formatGender(value){
        if (value === 1){
          return '男'
        } else if (value === 2){
          return '女'
        }
        return '未知'
      },
      formatSplitPayType(value){
        if (value === 0){
          return '个人'
        } else if (value === 1){
          return '商户'
        }
        return '未知'
      },
      formatStatus(value){
        if (value === 0){
          return '待审核'
        } else if (value === 1){
          return '通过'
        }else if (value === -1){
          return '拒绝'
        }
        return ''
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
      getParentDistributorList() {
        fetchDistributorList({}).then(response => {
          const list = response.result
          this.parentDistributorOptions = []
          for (let i = 0; i < list.length; i++) {
            this.parentDistributorOptions.push({ label: list[i].managerUserName, value: list[i].id})
          }
        })
      },
      handleAudit(index, row) {
        //审核

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

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    line-height: 40px;
    padding-left: 10px;

  }

  .font-small {
    font-size: 12px;
    color: #606266;
  }

  .form-left-bg {
    background: #F2F6FC;
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
