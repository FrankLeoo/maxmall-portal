<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.orderSn" class="form-item" placeholder="订单编号" />
          </el-form-item>
          <el-form-item label="收货人: ">
            &nbsp;&nbsp;
            <el-input v-model="listQuery.receiverKeyword" class="form-item" placeholder="收货人姓名/手机号码" />
          </el-form-item>
          <el-form-item label="提交时间: ">
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
          <el-form-item label="订单状态: ">
            <el-select v-model="listQuery.orderStatus" class="form-item" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类: ">
            <el-select v-model="listQuery.orderType" class="form-item" placeholder="全部" clearable>
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源: ">
            <el-select v-model="listQuery.sourceType" class="form-item" placeholder="全部" clearable>
              <el-option
                v-for="item in sourceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="待付款" name="waitpay"></el-tab-pane>
          <el-tab-pane label="待发货" name="payfinish"></el-tab-pane>
          <el-tab-pane label="已发货" name="goodsend"></el-tab-pane>
          <el-tab-pane label="已完成" name="orderfinish"></el-tab-pane>
          <el-tab-pane label="已关闭" name="orderclose"></el-tab-pane>
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
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleOrderDetail(scope.$index, scope.row)">订单详情</el-button>
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
import {fetchList} from '@/api/oms/order'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

// 默认查询参数
const defaultListQuery = {
  orderSn: null,
  receiverKeyword: null,
  createTimeStart: null,
  orderType: null,
  sourceType: null,
  orderStatus: null,
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
          label: '待付款',
          value: 0
        },
        {
          label: '待发货',
          value: 1
        },
        {
          label: '已发货',
          value: 2
        },
        {
          label: '已完成',
          value: 3
        },
        {
          label: '已关闭',
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: '正常订单',
          value: 0
        },
        {
          label: '秒杀订单',
          value: 1
        }
      ],
      sourceTypeOptions: [
        {
          label: 'PC订单',
          value: 0
        },
        {
          label: 'APP订单',
          value: 1
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
      const dateTime = new Date(time);
      return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
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
        this.listQuery.orderStatus = null;
      }else if('waitpay' === name){
        this.listQuery.orderStatus = 0;
      }else if('payfinish' === name){
        this.listQuery.orderStatus = 1;
      }else if('goodsend' === name){
        this.listQuery.orderStatus = 2;
      }else if('orderfinish' === name){
        this.listQuery.orderStatus = 3;
      }else if('orderclose' === name){
        this.listQuery.orderStatus = 4;
      }
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.getList();
    },
    //查询订单详情
    handleOrderDetail(index, row){
      this.$router.push({path:'/oms/order/detail/'+row.id})
    }
  }
}
</script>
