<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>优惠券信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">优惠码</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.code | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">名称</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.name | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">优惠券类型</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.type | formatType}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">使用类型</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.useType | formatUseType}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">描述</el-col>
            <el-col class="form-border font-small" :span="13">
              {{coupon.description | formatNull}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">计时方式</el-col>
            <el-col class="form-border font-small" :span="5">
              <span v-if="coupon.startType === 1">领取后 {{coupon.afterDay}}(天)</span>
              <span v-else>开始:{{coupon.startTime | formatCreateTime}}~结束:{{coupon.endTime | formatCreateTime}}</span>
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">金额</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.amount}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">使用门槛</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.minPoint}}(元)</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">发行数量</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.publishCount | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">领取数量</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.receiveCount | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">使用数量</el-col>
            <el-col class="form-border font-small" :span="5">{{coupon.useCount | formatNull}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container" v-show="coupon.useType === 1 || coupon.useType === 2">
      <el-card class="box-card">
        <h3>关联信息</h3>
        <el-table
          :data="relationList"
          style="font-size: 10px;"
          :show-header="true">
          <el-table-column label="编号" width="80">
            <template slot-scope="item">
              {{ item.row.relationId }}
            </template>
          </el-table-column>
          <el-table-column label="图片" width="100px" align="center">
            <template slot-scope="item">
              <span><img style="height: 45px" :src="item.row.relationPic"></span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="180" align="center">
            <template slot-scope="item">
              {{ item.row.type | formatRelationType}}
            </template>
          </el-table-column>
          <el-table-column label="编码" width="180">
            <template slot-scope="item">
              {{ item.row.relationSn }}
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="item">
              {{ item.row.relationName }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>领取记录</h3>
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.memberName" class="form-item" placeholder="用户名" />
          </el-form-item>
          <el-form-item label="订单编号: ">
            <el-input v-model="listQuery.usedSource" class="form-item" placeholder="订单编号" />
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
              {{ $t('table.search') }}
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="listLoading"
          :data="couponList"
          stripe
          style="font-size: 12px;"
          fit
          highlight-current-row
          :default-expand-all="false"
          @sort-change="sortChange">
          <el-table-column label="会员" width="120" align="left">
            <template slot-scope="scope">
              {{ scope.row.memberName }}
            </template>
          </el-table-column>
          <el-table-column label="头像" align="left" width="60px">
            <template slot-scope="scope">
              <span><img style="height: 45px" :src="scope.row.memberIcon"></span>
            </template>
          </el-table-column>
          <el-table-column label="优惠券有效时间" align="left">
            <template slot-scope="scope">
              开始:{{ scope.row.startTime | formatUseTime}}~结束:{{ scope.row.endTime | formatUseTime}}
            </template>
          </el-table-column>
          <el-table-column label="使用" align="center" width="80px">
            <template slot-scope="scope">
              {{scope.row.isUsed | formatUsed}}
            </template>
          </el-table-column>
          <el-table-column label="使用时间" align="left" width="180px">
            <template slot-scope="scope">
              {{scope.row.usedTime | formatUseTime}}
            </template>
          </el-table-column>
          <el-table-column label="使用场景" align="center" width="80px">
            <template slot-scope="scope">
              {{scope.row.usedSourceType | formatSourceType}}
            </template>
          </el-table-column>
          <el-table-column label="场景编码" align="left" width="180px">
            <template slot-scope="scope">
              {{scope.row.usedSource}}
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
            @pagination="getMemberCouponList"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDetail} from '@/api/marketing/coupon'
import {fetchList as fetchMemberCouponList} from '@/api/marketing/memberCoupon'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

const defaultListQuery = {
  couponId: null,
  memberName: null,
  usedSource: null,
  pageNum: 1,
  pageSize: 10
}
// 默认查询参数
export default {
  name: 'CouponDetail',
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
    formatSourceType(value){
      if (value === 1){
        return '购物'
      } else if (value === 2){
        return '赠送'
      }
      return ''
    },
    formatUsed(value){
      if (value === 1){
        return '已使用'
      }
      return '未使用'
    },
    formatRelationType(value){
      if (value === 1){
        return '指定分类'
      } else {
        return '指定商品'
      }
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
        return '会员赠券'
      } else if(value === 2){
        return '购物赠券'
      }else if(value === 3){
        return '注册赠券'
      }else {
        return '全场赠券'
      }
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      id: null,
      listLoading: true,
      total: 0,
      couponList: null,
      coupon: {},
      relationList: null,
      applyForm: {
        receiveType: 0
      },
      proofPics: []
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getCouponDetail();
    this.getMemberCouponList();
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
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getMemberCouponList()
    },
    getCouponDetail(){
      getDetail(this.id).then(response => {
        this.coupon = response.result;
        this.relationList = response.result.relationList;
      });
    },
    getMemberCouponList(){
      this.listLoading = true
      this.listQuery.couponId = this.id;

      fetchMemberCouponList(this.listQuery).then(response => {
        this.couponList = response.result.list
        this.total = parseInt(response.result.total)
        this.listLoading = false
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
</style>
