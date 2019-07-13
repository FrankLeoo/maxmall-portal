<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>退货信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">订单编号</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.orderSn}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">申请时间</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.createTime | formatCreateTime}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">会员</el-col>
            <el-col class="form-border font-small" :span="5"><img style="height:25px;vertical-align:middle;" :src="orderReturnApply.memberIcon">&nbsp;&nbsp;{{orderReturnApply.memberName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">退货原因</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.reason}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">备注</el-col>
            <el-col class="form-border font-small" :span="13">
              {{orderReturnApply.note}}
            </el-col>
          </el-row>
          <el-row v-if="orderReturnApply.proofPics">
            <el-col :span="3" class="form-border form-left-bg font-small" style="height:60px">凭证</el-col>
            <el-col class="form-border font-small" :span="21" style="height:60px">
              <img v-for="item in proofPics" style="width:45px;height:45px" :src="item">
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">退货人姓名</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.returnName}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">退货人手机号</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.returnPhone}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">收货方式</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receiveType | formartReceiveType}}</el-col>
          </el-row>
          <el-row v-if="orderReturnApply.receiveMan">
            <el-col :span="3" class="form-border form-left-bg font-small">收货人姓名</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receiveMan}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">收货人手机号</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receivePhone}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">收货地址</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receiveAddress}}</el-col>
          </el-row>
          <el-row v-if="orderReturnApply.expressSn">
            <el-col :span="3" class="form-border form-left-bg font-small">物流单号</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.expressSn}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">物流公司</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.expressCompany}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">物流时间</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.expressTime | formatCreateTime}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>商品信息</h3>
        <el-table
          :key="productTableKey"
          :data="productList"
          style="font-size: 10px;"
          :show-header="true">
          <el-table-column label="商品图片" width="100px" align="center">
            <template slot-scope="item">
              <span><img style="height: 50px" :src="item.row.productPic"></span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="120">
            <template slot-scope="item">
              {{ item.row.productName }}
            </template>
          </el-table-column>
          <el-table-column label="商品属性">
            <template slot-scope="item">
              {{ item.row.saleAttribute | formatProductAttr}}
            </template>
          </el-table-column>
          <el-table-column label="品牌/分类" width="180px">
            <template slot-scope="item">
              {{ item.row.productBrandName }}/{{ item.row.productCategoryName }}
            </template>
          </el-table-column>
          <el-table-column label="市场价格" width="80px">
            <template slot-scope="item">
              ¥:{{ item.row.productPrice }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="80px">
            <template slot-scope="item">
              ¥:{{ item.row.productRealPrice }}
            </template>
          </el-table-column>
          <el-table-column label="销售数量" align="center" width="80;">
            <template slot-scope="item">
              {{ item.row.productQuantity }}
            </template>
          </el-table-column>
          <el-table-column label="销售金额" align="center" width="80;">
            <template slot-scope="item">
              ¥:{{ item.row.realAmount }}
            </template>
          </el-table-column>
          <el-table-column label="退货数量" width="80;" align="center">
            <template slot-scope="item">
              {{ item.row.returnCount }}
            </template>
          </el-table-column>
          <el-table-column label="退货金额" width="80;" align="center">
            <template slot-scope="item">
              ¥:{{ item.row.returnAmount }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="filter-container" v-if="orderReturnApply.isReceived">
      <el-card class="box-card">
        <h3>确认收货</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">收货方式</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receiveType | formartReceiveType}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">收货时间</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receivedTime | formatCreateTime}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">确认收货人</el-col>
            <el-col class="form-border font-small" :span="5">{{orderReturnApply.receivedManName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">收货备注</el-col>
            <el-col class="form-border font-small" :span="21">{{orderReturnApply.receivedNote | fomartNull}}</el-col>
          </el-row>

        </div>
      </el-card>
    </div>

    <div class="filter-container">
      <el-card class="box-card">
        <h3>审核操作</h3>
        <!-- 审核操作 拒绝 或者 确认退货 -->
        <el-form ref="applyForm" :rules="applyRules" :model="applyForm" class="login-form" auto-complete="on">
          <el-input v-model="applyForm.id" name="id" ref="id" type="hidden">
          </el-input>
          <div class="form-container-border" v-show="orderReturnApply.applyStatus === 0">
            <el-row>
              <el-col :span="3" class="form-border form-left-bg font-small">收货方式</el-col>
              <el-col class="form-border font-small" :span="5">
                <el-select v-model="applyForm.receiveType" name="receiveType" ref="receiveType" placeholder="选择">
                  <el-option
                    v-for="item in receiveTypeOptions"
                    style="padding-right: 10px;"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <div v-if="applyForm.receiveType === 1">
                <el-col :span="3" class="form-border form-left-bg font-small">收货人姓名</el-col>
                <el-col class="form-border font-small" :span="5">
                  <el-input
                    placeholder="请输入收货人姓名"
                    style="padding-right: 10px;"
                    v-model="applyForm.receiveMan"
                    name="receiveMan"
                    ref="receiveMan"
                    clearable>
                  </el-input>
                </el-col>
                <el-col :span="3" class="form-border form-left-bg font-small">收货人手机号</el-col>
                <el-col class="form-border font-small" :span="5">
                  <el-input
                    style="padding-right: 10px;"
                    placeholder="请输入收货人电话"
                    v-model="applyForm.receivePhone"
                    name="receivePhone"
                    ref="receivePhone"
                    clearable>
                  </el-input>
                </el-col>
              </div>
              <div v-if="applyForm.receiveType != 1">
                <el-col :span="3" class="form-border form-left-bg font-small">收货人姓名</el-col>
                <el-col class="form-border font-small" :span="13">暂无</el-col>
              </div>
            </el-row>
            <el-row v-if="applyForm.receiveType === 1">
              <el-col :span="3" class="form-border form-left-bg font-small" style="height: 48px;">收货地址</el-col>
              <el-col class="form-border font-small" :span="21" style="height: 48px;">
                <el-input
                  type="textarea"
                  style="padding-right: 10px;"
                  :autosize="{ minRows: 1, maxRows: 1}"
                  placeholder="请输入收货地址"
                  name="receiveAddress"
                  ref="receiveAddress"
                  v-model="applyForm.receiveAddress">
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="form-border form-left-bg font-small" style="height: 80px;">审核备注</el-col>
              <el-col class="form-border font-small" :span="21" style="height: 80px;">
                <el-input
                  type="textarea"
                  style="padding-right: 10px; margin-top: 10px;"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注"
                  name="handleNote"
                  ref="handleNote"
                  v-model="applyForm.handleNote">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <!-- 审核通过 可以 确认收货 -->
          <div class="form-container-border" v-show="orderReturnApply.applyStatus === 1">
            <el-row>
              <el-col :span="3" class="form-border form-left-bg font-small" style="height: 80px;">收货备注</el-col>
              <el-col class="form-border font-small" :span="21" style="height: 80px;">
                <el-input
                  type="textarea"
                  style="padding-right: 10px;margin-top: 10px;"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注"
                  name="receivedNote"
                  ref="receivedNote"
                  v-model="applyForm.receivedNote">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <div v-show="orderReturnApply.applyStatus === 0" style="margin-top:15px;text-align: center">
            <el-button type="primary" size="small" plain @click.native.prevent="handleApplyOrder(1)">确认退货</el-button>
            <el-button type="danger" size="small" plain @click.native.prevent="handleApplyOrder(3)">拒绝退货</el-button>
          </div>
          <div v-show="orderReturnApply.applyStatus === 1" style="margin-top:15px;text-align: center">
            <el-button type="primary" size="small" plain @click.native.prevent="handleReceiveConfirm(2)">确认收货</el-button>
          </div>
          <div v-show="orderReturnApply.applyStatus === 2 || orderReturnApply.applyStatus === 3" class="form-container-border">
            <el-row>
              <el-col :span="3" class="form-border form-left-bg font-small">审核结果</el-col>
              <el-col class="form-border font-small" :span="5">{{ orderReturnApply.applyStatus | formartApplyStatus }}</el-col>
              <el-col :span="3" class="form-border form-left-bg font-small">审核备注</el-col>
              <el-col class="form-border font-small" :span="13">
                {{ orderReturnApply.handleNote | formatNull }}
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
    </div>

  </div>
</template>

<script>
import {getDetail, applyOrder, receiveConfirm} from '@/api/oms/return'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

// 默认查询参数
export default {
  name: 'ReturnDetail',
  directives: {waves},
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
    formatLongText(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无';
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...'
      } else {
        return value
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return '';
      } else {
        let result = ''
        const attr = JSON.parse(value);
        for (var prop in attr) {
          result+=prop;
          result+=":";
          result+=attr[prop];
          result+=";";
        }
        return result;
      }
    },
    formartReceiveType(value) {
      if (value === 1){
        return '客户回递'
      }
      return '无需收货'
    },
    formartApplyStatus(value) {
      if (value === 1){
        return '退货中'
      } else if (value === 2){
        return '已完成'
      } else if (value === 3){
        return '已拒绝'
      }
      return '待处理'
    }
  },
  data() {
    const validateReceiveType = (rule, value, callback) => {
      if (this.orderReturnApply.applyStatus===0) {
        if (!value){
          callback(new Error('Please select the receive type'))
        }
      } else {
        callback()
      }
    }
    const validateReceiveMan = (rule, value, callback) => {
      if (this.orderReturnApply.applyStatus===0 && this.applyForm.receiveType === 1) {
        if (!value){
          callback(new Error('Please enter the receive man'))
        }
      } else {
        callback()
      }
    }
    const validateReceivePhone = (rule, value, callback) => {
      if (this.orderReturnApply.applyStatus===0 && this.applyForm.receiveType === 1) {
        if (!value){
          callback(new Error('Please enter the receive phone'))
        }
      } else {
        callback()
      }
    }
    const validateReceiveAddress = (rule, value, callback) => {
      if (this.orderReturnApply.applyStatus===0 && this.applyForm.receiveType === 1) {
        if (!value){
          callback(new Error('Please enter the receive address'))
        }
      } else {
        callback()
      }
    }
    return {
      id: null,
      order: {},
      applyForm: {
        receiveType: 0
      },
      applyRules: {
        receiveType: [{validator: validateReceiveType, trigger: 'blur'}],
        receiveMan: [{ trigger: 'blur',validator: validateReceiveMan}],
        receivePhone: [{validator: validateReceivePhone, trigger: 'blur'}],
        receiveAddress: [{validator: validateReceiveAddress, trigger: 'blur'}]
      },
      productTableKey: null,
      productList: [],
      orderReturnApply: {},
      proofPics: [],
      receiveTypeOptions: [
        {
          label: '无需收货',
          value: 0
        },
        {
          label: '客户回递',
          value: 1
        }
      ]
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    getDetail(this.id).then(response => {
      this.orderReturnApply = response.result;
      this.productList = [];
      this.productList.push(this.orderReturnApply);
      if (this.orderReturnApply.proofPics) {
        this.proofPics = this.orderReturnApply.proofPics.split(",")
      }
      this.applyForm.id = this.id;
    });
  },
  methods: {
    handleApplyOrder(status){
      this.$confirm('是否要进行审核操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        //调用审核接口
        this.$refs.applyForm.validate(valid => {
          if (valid) {
            const applyJson = this.applyForm;
            applyJson.applyStatus = status;

            applyOrder(applyJson).then(response => {
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration:1000
              });
              this.$router.back();
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }).catch(() => {});
    },
    handleReceiveConfirm(status){
      this.$confirm('是否要进行收货操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        //调用审核接口
        this.$refs.applyForm.validate(valid => {
          if (valid) {
            const applyJson = this.applyForm;
            receiveConfirm(applyJson).then(response => {
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration:1000
              });
              this.$router.back();
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }).catch(() => {});
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
