<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>订单信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">订单编号</el-col>
            <el-col :span="6" class="table-cell table-cell-title">下单店铺</el-col>
            <el-col :span="6" class="table-cell table-cell-title">买家信息</el-col>
            <el-col :span="6" class="table-cell table-cell-title">下单时间</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.orderSn}}</el-col>
            <el-col :span="6" class="table-cell">{{order.shopName | formatNull}}</el-col>
            <el-col :span="6" class="table-cell"><span><img style="height: 25px;vertical-align:middle;" :src="order.memberIcon">&nbsp;&nbsp;{{order.memberName}}</span></el-col>
            <el-col :span="6" class="table-cell">{{order.createTime | formatCreateTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">订单类型</el-col>
            <el-col :span="6" class="table-cell table-cell-title">订单来源</el-col>
            <el-col :span="6" class="table-cell table-cell-title">订单状态</el-col>
            <el-col :span="6" class="table-cell table-cell-title">订单总金额</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
            <el-col :span="6" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
            <el-col :span="6" class="table-cell">{{order.orderStatus | formatStatus}}天</el-col>
            <el-col :span="6" class="table-cell">{{order.totalAmount}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="table-cell table-cell-title">备注</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="table-cell">{{order.note | formatNull}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>支付信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">是否支付</el-col>
            <el-col :span="6" class="table-cell table-cell-title">支付类型</el-col>
            <el-col :span="6" class="table-cell table-cell-title">支付时间</el-col>
            <el-col :span="6" class="table-cell table-cell-title">支付金额</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.isPayed | formatPayed}}</el-col>
            <el-col :span="6" class="table-cell">{{order.payType | formatPayType}}</el-col>
            <el-col :span="6" class="table-cell">{{order.paymentTime | formatCreateTime}}</el-col>
            <el-col :span="6" class="table-cell">{{order.payAmount}}</el-col>
          </el-row>
          <el-row v-if="order.useIntegration">
            <el-col :span="6" class="table-cell table-cell-title">使用积分</el-col>
            <el-col :span="6" class="table-cell table-cell-title">积分抵扣金额</el-col>
            <el-col :span="6" class="table-cell table-cell-title">获得的积分</el-col>
            <el-col :span="6" class="table-cell table-cell-title"></el-col>
          </el-row>
          <el-row v-if="order.useIntegration">
            <el-col :span="6" class="table-cell">{{order.useIntegration | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.integrationAmount | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.integration | formatNull}}</el-col>
            <el-col :span="6" class="table-cell"></el-col>
          </el-row>
          <el-row v-if="order.couponId">
            <el-col :span="6" class="table-cell table-cell-title">优惠券</el-col>
            <el-col :span="6" class="table-cell table-cell-title">优惠券类型</el-col>
            <el-col :span="6" class="table-cell table-cell-title">优惠金额</el-col>
            <el-col :span="6" class="table-cell table-cell-title">优惠描述</el-col>
          </el-row>
          <el-row v-if="order.couponId">
            <el-col :span="6" class="table-cell">{{order.couponName | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.couponType | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.couponAmount | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">无</el-col>
          </el-row>
          <el-row v-if="order.promotionId">
            <el-col :span="6" class="table-cell table-cell-title">活动</el-col>
            <el-col :span="6" class="table-cell table-cell-title">活动类型</el-col>
            <el-col :span="6" class="table-cell table-cell-title">活动金额</el-col>
            <el-col :span="6" class="table-cell table-cell-title">活动描述</el-col>
          </el-row>
          <el-row v-if="order.promotionId">
            <el-col :span="6" class="table-cell">{{order.promotionName | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.promotionType | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.promotionAmount | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">无</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container" v-if="order.isFenxiaoOrder">
      <el-card class="box-card">
        <h3>分销信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">分销商</el-col>
            <el-col :span="6" class="table-cell table-cell-title">本级分销</el-col>
            <el-col :span="6" class="table-cell table-cell-title">父级分销</el-col>
            <el-col :span="6" class="table-cell table-cell-title">祖父级分销</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.distributorName | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.selfSalesRatio}}(%)</el-col>
            <el-col :span="6" class="table-cell">{{order.parentSalesRatio | formatNull}}(%)</el-col>
            <el-col :span="6" class="table-cell">{{order.grandSalesRatio  | formatNull}}(%)</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>商品信息</h3>
        <el-table
          :key="itemTableKey"
          :data="order.productItems"
          style="font-size: 10px;"
          :show-header="true">
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
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>物流信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">物流类型</el-col>
            <el-col :span="6" class="table-cell table-cell-title">物流公司</el-col>
            <el-col :span="6" class="table-cell table-cell-title">物流单号</el-col>
            <el-col :span="6" class="table-cell table-cell-title">发货时间</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.expressType | formatExpressType }}</el-col>
            <el-col :span="6" class="table-cell">{{order.expressCompany | formatNull }}</el-col>
            <el-col :span="6" class="table-cell">{{order.expressSn | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.expressTime | formatCreateTime }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell table-cell-title">是否收货</el-col>
            <el-col :span="6" class="table-cell table-cell-title">收货人姓名</el-col>
            <el-col :span="6" class="table-cell table-cell-title">收货人电话</el-col>
            <el-col :span="6" class="table-cell table-cell-title">收货人地址</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="table-cell">{{order.isReceive | formatReceive}}</el-col>
            <el-col :span="6" class="table-cell">{{order.receiverName | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.receiverPhone  | formatNull}}</el-col>
            <el-col :span="6" class="table-cell">{{order.receiverProvince}},{{order.receiverCity}},{{order.receiverRegion}},{{order.receiverDetailAddress}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDetail} from '@/api/oms/order'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

// 默认查询参数
const defaultReceiverInfo = {
  orderId:null,
  receiverName:null,
  receiverPhone:null,
  receiverPostCode:null,
  receiverDetailAddress:null,
  receiverProvince:null,
  receiverCity:null,
  receiverRegion:null,
  status:null
}

export default {
  name: 'OrderDetail',
  directives: {waves},
  filters: {
    formatCreateTime(time) {
      if (time == null || time === '') {
        return '无'
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
    formatPayed(value) {
      if (value === 1) {
        return '已支付'
      } else {
        return '未支付'
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
    formatSourceType(value) {
      if (value === 1) {
        return 'APP订单'
      } else {
        return 'PC订单'
      }
    },
    formatOrderType(value) {
      if (value === 1) {
        return '秒杀订单'
      } else {
        return '正常订单'
      }
    },
    formatReceive(value) {
      if (value === 1) {
        return '已收货'
      } else {
        return '未收货'
      }
    },
    formatAddress(order) {
      let str = order.receiverProvince;
      if (order.receiverCity != null) {
        str += "  " + order.receiverCity
      }
      str += "  " + order.receiverRegion
      str += "  " + order.receiverDetailAddress
      return str
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
    formatSettle(value) {
      if (value === 1) {
        return '已结算'
      } else {
        return '未结算'
      }
    },
    formatPayStatus(value) {
      if (value === 0) {
        return '未支付'
      } else if (value === 1) {
        return '已支付'
      } else {
        return '未支付'
      }
    },
    formatExpressType(value) {
      if (value === 0 ) {
        return '手动发货'
      } else if (value === 1 ) {
        return '系统自动发货'
      } else {
        return '未发货'
      }
    },
    formatDeliverStatus(value) {
      if (value === 0 || value === 1) {
        return '未发货'
      } else {
        return '已发货'
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return '';
      } else {
        const attr = JSON.parse(value);
        let result = ''
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key;
          result += ":"
          result += attr[i].value;
          result += ";"
        }
        return result;
      }
    }
  },
  data() {
    return {
      id: null,
      order: {},
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyInfo: {orderId: null, freightAmount: 0, status: null},
      message: {title: null, content: null},
      markOrderDialogVisible: false,
      markInfo: {note: null},
      orderTableKey: null,
      itemTableKey: null
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    getDetail(this.id).then(response => {
      this.order = response.result
    });
  },
  methods: {

  }
}
</script>
<style scoped>

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
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
