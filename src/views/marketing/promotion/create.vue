<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>活动信息</h3>
        <el-form :model="entityObject" :rules="rules" ref="entityObject" label-width="120px" class="demo-ruleForm">
          <el-input type="hidden" v-model="entityObject.id"></el-input>
          <el-form-item label="活动名称" prop="name">
            <el-col :span="14">
              <el-input v-model="entityObject.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间区间">
            <el-col :span="6">
              <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="entityObject.startTime" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" style="text-align: center" :span="2">-</el-col>
            <el-col :span="6">
              <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss"  placeholder="选择时间" v-model="entityObject.endTime" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="活动类型">
            <el-col :span="6">
              <el-select v-model="entityObject.type" style="width: 100%;" placeholder="请选择类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="满" v-if="entityObject.type === 0">
            <el-col :span="6">
              <el-input v-model="entityObject.fullPrice"><template slot="append">元</template></el-input>
            </el-col>
            <el-col class="line" :span="2">减</el-col>
            <el-col :span="6">
              <el-input v-model="entityObject.reducePrice"><template slot="append">元</template></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="满" v-if="entityObject.type === 1">
            <el-col :span="4">
              <el-input v-model="entityObject.fullPrice"><template slot="append">元</template></el-input>
            </el-col>
            <el-col class="line" :span="3">
              <el-select v-model="entityObject.giftType" style="width: 100%;" @change="resetGiftInfo" placeholder="类型">
                <el-option
                  v-for="item in giftTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="7" class="line"  v-if="entityObject.giftType === 0">
              <el-select
                v-model="entityObject.giftName"
                style="width: 100%;"
                filterable
                remote
                reserve-keyword
                placeholder="商品名称或编码"
                @change="giftTypeChange"
                :remote-method="productFetchAllList"
                :loading="productSelectLoading"
                clearable>
                <el-option
                  v-for="item in productOptions"
                  :value-key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="7" class="line" v-else-if="entityObject.giftType === 1">
              <el-select v-model="entityObject.giftName" @change="giftTypeChange" style="width: 100%;" placeholder="请选择优惠券" clearable>
                <el-option
                  v-for="item in couponOptions"
                  :value-key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="使用类型">
            <el-col :span="6">
              <el-select v-model="entityObject.useType" style="width: 100%;" placeholder="请选择使用类型">
                <el-option
                  v-for="item in useTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="关联内容" v-if="entityObject.useType != 0">
            <el-col :span="20">
              <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleAddRelation">
                添加
              </el-button>
              <el-table
                :data="entityObject.relationList"
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
                <el-table-column label="关联名称">
                  <template slot-scope="item">
                    {{ item.row.relationName }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="item">
                    <el-button type="text" style="font-size: 12px;" @click="handleRealationDelete(item.$index, item.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
          <el-form-item label="活动描述" prop="description">
            <el-col :span="20">
              <el-input
                type="textarea"
                style="padding-right: 10px; margin-top: 10px;"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="entityObject.description"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('entityObject')">提交</el-button>
            <el-button @click="cancleBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog title="商品选择组件" top style="margin-top: 30px;" :visible.sync="dialogFormVisible" width="60%">
      <product-list :select-list="relationMap" v-on:productSelectEvent="productSelectHandler"></product-list>
    </el-dialog>
  </div>
</template>

<script>
  import {getDetail, modifyPromotion} from '@/api/marketing/promotion'
  import waves from '@/directive/waves' // waves directive
  import productList from '@/views/products/product/components/productList'
  import {getAllList as fetchCouponList} from '@/api/marketing/coupon'
  import {fetchAllList as fetchAllProductList} from '@/api/product/product'

  export default {
    name: 'LevelModify',
    directives: {waves},
    components: { productList },
    filters:{
      formatRelationType(value){
        if (value === 1){
          return '指定分类'
        } else {
          return '指定商品'
        }
      }
    },
    data() {
      return {
        id: null,
        productSelectLoading: true,
        couponOptions: [],
        productOptions: [],
        relationMap:new Map(),
        dialogFormVisible: false,
        typeOptions: [
          {value: 0,label: '满减'},
          {value: 1,label: '满赠'},
          {value: 2,label: '限时优惠'},
          {value: 3,label: '赠品'}
        ],
        useTypeOptions: [
          {value: 0,label: '全场通用'},
          {value: 1,label: '指定分类'},
          {value: 2,label: '指定商品'}
        ],
        giftTypeOptions:[
          {value: 0,label: '商品'},
          {value: 1,label: '优惠券'}
        ],
        entityObject: {},
        rules: {
          name: [
            { required: true, message: '请输入优惠券名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ],
          publishCount:[{ required: true, message: '请输入发行数量', trigger: 'blur' }],
          amount: [{ required: true, message: '请输入优惠券金额', trigger: 'blur' }],
          minPoint: [{ required: true, message: '请输入使用门槛', trigger: 'blur' }],
          enableTime: [{ required: true, message: '请选择优惠券失效时间', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if(this.id && this.id > 0){
        this.getPromotionDetail();
      }
      this.getCouponList()
    },
    methods: {
      getPromotionDetail(){
        getDetail(this.id).then(response => {
          this.entityObject = response.result;
          if (!this.entityObject.relationList){
            this.entityObject.relationList = [];
          }
          this.entityObject.relationList.forEach((row) => {
            this.relationMap.set(row.relationId,row);
          })
        });
      },
      getCouponList() {
        const param = {};
        fetchCouponList(param).then(response => {
          this.couponOptions = []
          const brandList = response.result
          for (let i = 0; i < brandList.length; i++) {
            this.couponOptions.push({ label: brandList[i].name, id: brandList[i].id, value: brandList[i] })
          }
        })
      },
      giftTypeChange(val){
        this.entityObject.giftId = val.id
        this.entityObject.giftName = val.name
        this.entityObject.giftPic = val.pic
      },
      resetGiftInfo(){
        this.entityObject.giftId = null
        this.entityObject.giftName = null
        this.entityObject.giftPic = null
      },
      cancleBack(){
        this.$router.back();
      },
      handleRealationDelete(index,row){
        this.entityObject.relationList.splice(index,1)
      },
      handleAddRelation(){
        //弹出添加dilog
        this.dialogFormVisible = true;
      },
      productFetchAllList(query){
        if (!query){
          return;
        }
        this.productSelectLoading = true;
        const param = {}
        param.keyWords = query;
        fetchAllProductList(param).then(response => {
          this.productOptions = []
          const brandList = response.result
          for (let i = 0; i < brandList.length; i++) {
            this.productOptions.push({ label: brandList[i].name,id: brandList[i].id, value: brandList[i] })
          }
          this.productSelectLoading = false;
        })

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyPromotion(this.entityObject).then(response => {
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration:1000
              });
              this.$router.back();
            })
          } else {
            return false;
          }
        });
      },
      productSelectHandler(type,row){
        if ('add' === type){
          if (!this.relationMap.has(row.id)){
            const product = {};
            product.relationId = row.id;
            product.relationPic = row.pic;
            product.relationSn = row.spuCode;
            product.type = 1;
            product.relationName = row.name;
            this.entityObject.relationList.push(product)

            this.relationMap.set(row.id,product)
          }
        } else if('due' === type){
          if (this.relationMap.has(row.id)){
            this.relationMap.delete(row.id)
            this.entityObject.relationList.forEach((item) => {
              if (item.relationId === row.id){
                this.entityObject.relationList.splice(item,true);
              }
            })
          }
        }
      }
    }
  }
</script>
<style scoped>
  .line{
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: 700;
    vertical-align: middle;
    float: left;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  .line-require:before {
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
</style>
