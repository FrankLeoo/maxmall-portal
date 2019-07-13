<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>活动信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">活动名称</el-col>
            <el-col class="form-border font-small" :span="5">{{promotion.name | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">使用类型</el-col>
            <el-col class="form-border font-small" :span="5">{{promotion.useType | formatUseType}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">活动类型</el-col>
            <el-col class="form-border font-small" :span="5">{{promotion.type | formatType}}</el-col>
          </el-row>
          <el-row v-show="promotion.type === 1 | promotion.type === 3">
            <el-col :span="3" class="form-border form-left-bg font-small">赠品类型</el-col>
            <el-col class="form-border font-small" :span="5">
              {{promotion.giftType | formatGiftType}}
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">赠品名称</el-col>
            <el-col class="form-border font-small" :span="5">{{promotion.giftName}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">赠品图片</el-col>
            <el-col class="form-border font-small" :span="5">
              <span><img style="height: 30px;vertical-align:middle;" :src="promotion.giftPic"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">活动详情</el-col>
            <el-col class="form-border font-small" :span="21">{{promotion.publishCount | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">状态</el-col>
            <el-col class="form-border font-small" :span="5">{{promotion.status | formatUseType}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">描述</el-col>
            <el-col class="form-border font-small" :span="13">
              {{promotion.description | formatNull}}
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container"  v-show="promotion.useType === 1 || promotion.useType === 2">
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
              <span><img style="height: 45px;vertical-align:middle;" :src="item.row.relationPic"></span>
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

    <!-- 查询参加活动的订单 -->
    <div class="filter-container">
      <el-card class="box-card">
        <h3>活动记录</h3>
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.memberName" class="form-item" placeholder="用户名" />
          </el-form-item>
          <el-form-item label="订单编号: ">
            <el-input v-model="listQuery.orderSn" class="form-item" placeholder="订单编号" />
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
              {{ $t('table.search') }}
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="listLoading"
          :data="promotionList"
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
            @pagination="getPromotionOrderList"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDetail} from '@/api/marketing/promotion'
import {fetchList as fetchPromotionOrderList} from '@/api/oms/order'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

const defaultListQuery = {
  promotionId: null,
  memberName: null,
  orderSn: null,
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
    formatGiftType(value){
      if (value === 1) {
        return '优惠券'
      }
      return '商品'
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
    formatSourceType(value) {
      if (value === 1) {
        return 'APP订单'
      } else {
        return 'PC订单'
      }
    },
    formatStatus(value) {
      if (value === 1) {
        return '待发货'
      } else if (value === 2) {
        return '已发货'
      } else if (value === 3) {
        return '已完成'
      } else if (value === 4) {
        return '已关闭'
      } else if (value === 5) {
        return '无效订单'
      } else {
        return '待付款'
      }
    },
    formatIsPayed(value){
      if (value === 1) {
        return '已支付'
      }
      return '未支付'
    },
    formatPayType(value){
      if (value === 1) {
        return '支付宝';
      }else if(value === 2) {
        return '微信'
      }
      return '未支付'
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
      promotionList: null,
      promotion: {},
      relationList: null,
      applyForm: {
        receiveType: 0
      },
      proofPics: []
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getPromotionDetail();
    this.getPromotionOrderList();
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
      this.getPromotionOrderList()
    },
    getPromotionDetail(){
      getDetail(this.id).then(response => {
        this.promotion = response.result;
        this.relationList = response.result.relationList;
      });
    },
    getPromotionOrderList(){
      this.listLoading = true
      this.listQuery.promotionId = this.id;

      fetchPromotionOrderList(this.listQuery).then(response => {
        this.promotionList = response.result.list
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
