<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>会员信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">昵称</el-col>
            <el-col class="form-border font-small" :span="5">{{member.nickname | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">头像</el-col>
            <el-col class="form-border font-small" :span="5">
              <span><img style="height: 35px;vertical-align:middle;" :src="member.icon"></span>
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">性别</el-col>
            <el-col class="form-border font-small" :span="5">{{member.gender | formatGender}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">积分</el-col>
            <el-col class="form-border font-small" :span="5">{{member.integration | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">成长值</el-col>
            <el-col class="form-border font-small" :span="5">{{member.growth | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">等级</el-col>
            <el-col class="form-border font-small" :span="5">{{member.memberLevelName | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">工作</el-col>
            <el-col class="form-border font-small" :span="5">{{member.job | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">生日</el-col>
            <el-col class="form-border font-small" :span="5">{{member.birthday | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">城市</el-col>
            <el-col class="form-border font-small" :span="5">{{member.city | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">来源</el-col>
            <el-col class="form-border font-small" :span="5">{{member.sourceType | formatSourceType}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">邀请人姓名</el-col>
            <el-col class="form-border font-small" :span="5">{{member.inviterName | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">邀请人头像</el-col>
            <el-col class="form-border font-small" :span="5">
              <span><img style="height: 35px;vertical-align:middle;" :src="member.inviterIcon"></span>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>统计信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="4" class="table-cell table-cell-title">订单数量</el-col>
            <el-col :span="4" class="table-cell table-cell-title">优惠券数量</el-col>
            <el-col :span="4" class="table-cell table-cell-title">评价数</el-col>
            <el-col :span="4" class="table-cell table-cell-title">退货数量</el-col>
            <el-col :span="8" class="table-cell table-cell-title">累计消费金额</el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="table-cell">{{account.orderCount | formatNull}}</el-col>
            <el-col :span="4" class="table-cell">{{account.couponCount | formatNull}}</el-col>
            <el-col :span="4" class="table-cell">{{account.commentCount | formatNull}}</el-col>
            <el-col :span="4" class="table-cell">{{account.returnOrderCount | formatNull}}</el-col>
            <el-col :span="8" class="table-cell">{{account.consumeAmount | formatNull}}(元)</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- tab标签 -->
    <div class="filter-container">
      <el-card class="box-card" style="min-height: 480px;">
        <h3>会员操作记录</h3>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="订单记录" name="orderHistory">
              <el-table
                v-loading="listLoading"
                :data="orderList"
                stripe
                style="font-size: 12px;"
                fit
                highlight-current-row
                :default-expand-all="false"
                @sort-change="sortChange">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 嵌套table展示商品信息 -->
                    <el-table
                      :key="subTableKey"
                      :data="scope.row.productItems"
                      style="font-size: 10px;"
                      :show-header="true"
                    >
                      <el-table-column label="商品图片" width="100px" align="center">
                        <template slot-scope="item">
                          <span><img style="height: 50px" :src="item.row.productPic"></span>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品名称">
                        <template slot-scope="item">
                          {{ item.row.productName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="品牌/分类" width="180px">
                        <template slot-scope="item">
                          {{ item.row.productBrandName }}/{{ item.row.productCategoryName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="优惠信息" width="180px">
                        <template slot-scope="item" v-if="item.row.couponId">>
                          {{ item.row.couponName }}/¥{{ item.row.couponAmount }}
                        </template>
                      </el-table-column>
                      <el-table-column label="活动信息" width="180px">
                        <template slot-scope="item" v-if="item.row.promotionId">
                          {{ item.row.promotionName }}/¥{{ item.row.promotionAmount }}
                        </template>
                      </el-table-column>
                      <el-table-column label="价格" width="80px">
                        <template slot-scope="item">
                          ¥:{{ item.row.productPrice }}
                        </template>
                      </el-table-column>
                      <el-table-column label="数量" align="center" width="60px;">
                        <template slot-scope="item">
                          {{ item.row.productQuantity }}
                        </template>
                      </el-table-column>
                      <el-table-column label="金额" width="80px;" align="center">
                        <template slot-scope="item">
                          ¥:{{ item.row.realAmount }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="订单详情" min-width="350" align="left">
                  <template slot-scope="scope">
                    <p>订单号:{{ scope.row.orderSn }}&nbsp;&nbsp;
                      下单时间:{{scope.row.createTime | formatCreateTime}}
                    </p>
                    <p v-if="scope.row.isFenxiaoOrder == 1">分销商:{{ scope.row.distributorName }}&nbsp;&nbsp;分销比例:{{ scope.row.selfSalesRatio }} </p>
                  </template>
                </el-table-column>
                <el-table-column label="订单金额" width="120" align="left">
                  <template slot-scope="scope">
                    <p>应付:{{ scope.row.totalAmount }}</p>
                    <p>实付:{{ scope.row.payAmount }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="收货信息" min-width="150" align="left">
                  <template slot-scope="scope">
                    <p>收货人:{{ scope.row.receiverName }}({{ scope.row.receiverPhone }})</p>
                    <p>地址:{{ scope.row.receiverProvince }},{{ scope.row.receiverCity }},{{ scope.row.receiverRegion }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="买家信息" width="100" align="center">
                  <template slot-scope="scope">
                    <span><img style="height: 25px;vertical-align:middle;" :src="scope.row.memberIcon">{{scope.row.memberName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="订单状态" width="80" align="center">
                  <template slot-scope="scope">{{scope.row.orderStatus | formatStatus}}</template>
                </el-table-column>
                <el-table-column label="支付信息" width="80" align="center">
                  <template slot-scope="scope">
                    {{scope.row.payType | formatPayType}}
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
                  @pagination="getMemberOrderList"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="积分记录" name="second">
              <!-- 积分详情 -->
              <el-table
                v-loading="integraLoading"
                :data="integraList"
                stripe
                style="font-size: 12px;"
                fit
                highlight-current-row
                :default-expand-all="false"
                @sort-change="sortChange">

                <el-table-column label="会员" width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.memberNickname }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="类型" width="100" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.changeType | formatHistoryChangeType}}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.changeCount }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="积分来源" width="100" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.sourceType | formatHistorySourceType}}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="操作人" min-width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.operateManName }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.operateNote }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="时间" align="center" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | formatUseTime }}&nbsp;
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                  background
                  layout="total, sizes,prev, pager, next,jumper"
                  :page-size="integraQuery.pageSize"
                  :page-sizes="[10,15,25]"
                  :current-page.sync="integraQuery.pageNum"
                  :total="integraTotal"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  @pagination="getIntegraHistoryList"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="成长值记录" name="third">
              <el-table
                v-loading="growthLoading"
                :data="growthList"
                stripe
                style="font-size: 12px;"
                fit
                highlight-current-row
                :default-expand-all="false"
                @sort-change="sortChange">

                <el-table-column label="会员" width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.memberNickname }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="类型" width="100" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.changeType | formatHistoryChangeType}}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="积分" width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.changeCount }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="积分来源" width="100" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.sourceType | formatHistorySourceType}}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="操作人" width="180" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.operateManName }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.operateNote }}&nbsp;
                  </template>
                </el-table-column>
                <el-table-column label="时间" align="center" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | formatUseTime }}&nbsp;
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                  background
                  layout="total, sizes,prev, pager, next,jumper"
                  :page-size="growthQuery.pageSize"
                  :page-sizes="[10,15,25]"
                  :current-page.sync="growthQuery.pageNum"
                  :total="growthTotal"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  @pagination="getGrowthHistoryList"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-card>
    </div>

  </div>
</template>

<script>
import {getDetail, fetchIntegrationList, fetchGrowthList} from '@/api/member/member'
import {fetchList as fetchMemberOrderList} from '@/api/oms/order'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

const defaultListQuery = {
  memberId: null,
  orderSn: null,
  pageNum: 1,
  pageSize: 10
}
// 默认查询参数
export default {
  name: 'MemberDetail',
  directives: {waves},
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
    formatHistorySourceType(value){
      if (value === 0){
        return '购物'
      } else if (value === 1){
        return '管理员赠送'
      }
      return ''
    },
    formatHistoryChangeType(value){
      if (value === 0){
        return '增加'
      } else if (value === 1){
        return '减少'
      }
      return ''
    },
    formatGender(value){
      if (value === 1){
        return '男'
      } else if (value === 2){
        return '女'
      }
      return '未知'
    },
    formatStatus(value) {
      if (value === 1){
        return '未启用'
      } else if (value === 0){
        return '启用'
      }
      return '未启用'
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
    formatSourceType(value){
      if (value === 1){
        return '支付宝'
      }
      return '微信'
    }
  },
  data() {
    return {
      id: null,
      activeName: "orderHistory",
      listLoading: true,
      total: 0,
      orderList: null,
      listQuery: Object.assign({}, defaultListQuery),
      growthLoading: true,
      growthTotal: 0,
      growthList: null,
      growthQuery: {pageNum: 1, pageSize: 10},
      integraLoading: true,
      integraTotal: 0,
      integraList: null,
      integraQuery: {pageNum: 1, pageSize: 10},
      account: {},
      member: {},
      applyForm: {
        receiveType: 0
      },
      proofPics: []
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getMemberDetail();
    this.getMemberOrderList();
    this.getGrowthHistoryList();
    this.getIntegraHistoryList();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    sortChange(data) {

    },
    handleClick(tab, event) {

    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getMemberOrderList()
    },
    getMemberDetail(){
      getDetail(this.id).then(response => {
        this.member = response.result;
        if (response.result.account){
          this.account = response.result.account;
        }
      });
    },
    getMemberOrderList(){
      this.listLoading = true
      this.listQuery.memberId = this.id;

      fetchMemberOrderList(this.listQuery).then(response => {
        this.orderList = response.result.list
        this.total = parseInt(response.result.total)
        this.listLoading = false
      });
    },
    getIntegraHistoryList(){
      this.integraLoading = true
      this.integraQuery.memberId = this.id;

      fetchIntegrationList(this.integraQuery).then(response => {
        this.integraList = response.result.list
        this.integraTotal = parseInt(response.result.total)
        this.integraLoading = false
      });
    },
    getGrowthHistoryList(){
      this.growthLoading = true
      this.growthQuery.memberId = this.id;

      fetchGrowthList(this.growthQuery).then(response => {
        this.growthList = response.result.list
        this.growthTotal = parseInt(response.result.total)
        this.growthLoading = false
      });
    }
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

  .table-cell {
    line-height: 45px;
    padding-left: 15px;
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
    line-height: 45px;
    background: #F2F6FC;
    color: #303133;
  }
</style>
