<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>分销商信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销商编号</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.distributorSn}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">管理员名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.managerUserName}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">管理员头像</el-col>
            <el-col class="form-border font-small" :span="5"><img style="height: 35px;vertical-align:middle;" :src="entityObject.managerUserPic"></el-col>
          </el-row>
          <el-row v-if="entityObject.parent">
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商</el-col>
            <el-col class="form-border font-small" :span="5">
              {{entityObject.parent.distributorSn}}
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级管理员名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.parent.managerUserName}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级管理员头像</el-col>
            <el-col class="form-border font-small" :span="5">
              <span><img style="height: 35px;vertical-align:middle;" :src="entityObject.parent.managerUserPic"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销账户</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.splitPayAccount | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">会员数量</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.fansNum | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">推广分销商数量</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.distributorNum | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销等级</el-col>
            <el-col class="form-border font-small" :span="5">
              <!-- 配置hover -->
              {{entityObject.levelName | formatNull}}
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商</el-col>
            <el-col class="form-border font-small" :span="5">
              <span v-if="entityObject.parent">
                {{entityObject.parent.distributorSn | formatNull}}
              </span>
              <span v-else>无</span>
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商管理员</el-col>
            <el-col class="form-border font-small" :span="5">
              <span v-if="entityObject.parent">
                {{entityObject.parent.managerUserName | formatNull}}
              </span>
              <span v-else>无</span>
            </el-col>
          </el-row>
        </div>
        <h3>分销信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">本级分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.selfSalesRatio | formatNull}}%</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">父级分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.parentSalesRatio | formatNull}}%</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">祖父分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.grandSalesRatio | formatNull}}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.controbuteCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">代理分销佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.agentCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">利润返点佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.profitCommission | formatNull}}(元)</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">可提取佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.extractedCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">已提取佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.unextractedCommissio | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">总佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.totalCommission | formatNull}}(元)</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container" v-if="entityObject.shop">
      <el-card class="box-card">
        <h3>店铺信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.name | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺主图</el-col>
            <el-col class="form-border font-small" :span="5"><span><img style="height: 35px;vertical-align:middle;" :src="entityObject.shop.pic"></span></el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺标题</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.title | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">联系人姓名</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.contactUsername | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">联系人电话</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.contactPhone}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">备注</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.description | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">省</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverProvince | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">市</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverCity}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">区县</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverRegion | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">详细地址</el-col>
            <el-col class="form-border font-small" :span="21">{{entityObject.shop.receiverDetailAddress | formatNull}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 查询分销商账户记录 -->
    <div class="filter-container">
      <el-card class="box-card">
        <h3>分销商详情</h3>
        <el-tabs v-model="activeName">
          <el-tab-pane label="操作记录" name="moneyHistory">
            <money-history-list :distributor-id="this.id"></money-history-list>
          </el-tab-pane>
          <el-tab-pane label="下级分销商" name="childrenDistr">
            <distributorList :parent-id="this.id"></distributorList>
          </el-tab-pane>
          <el-tab-pane label="我的会员" name="memberList">
            <memberList :parent-id="this.id"></memberList>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDetail} from '@/api/distribution/distributor'
import {formatDate} from '@/utils/date'
import moneyHistoryList from './components/moneyHistoryList'
import memberList from './components/memberList'
import distributorList from './components/distributorList'
import waves from '@/directive/waves' // waves directive

const defaultListQuery = {
  type: null,
  pageNum: 1,
  pageSize: 10
}
// 默认查询参数
export default {
  name: 'DistributorDetail',
  components: { moneyHistoryList, memberList, distributorList},
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
    }
  },
  data() {
    return {
      id: null,
      activeName: 'moneyHistory',
      entityObject: {},
      applyForm: {
        receiveType: 0
      }
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getDetail();
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
    getDetail(){
      getDetail(this.id).then(response => {
        this.entityObject = response.result;
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
