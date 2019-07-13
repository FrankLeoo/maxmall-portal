<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>会员等级规则</h3>
        <el-form :model="entityObject" :rules="rules" ref="entityObject" label-width="120px" class="demo-ruleForm">
          <el-input type="hidden" v-model="entityObject.id"></el-input>
          <el-form-item label="等级名称" prop="name">
            <el-col :span="14">
              <el-input v-model="entityObject.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="等级规则">
            <el-col :span="6">
              <el-input placeholder="等级" v-model="entityObject.level" style="width: 100%;">
              </el-input>
            </el-col>
            <el-col class="line line-require" :span="2"><label class="el-form-item__label">等级成长值</label></el-col>
            <el-col :span="6">
              <el-input placeholder="父级分销" v-model="entityObject.growthPoint" style="width: 100%;">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="等级赠送优惠券">
            <el-col :span="14">
              <el-select v-model="entityObject.growthCouponId" style="width: 100%;" placeholder="请选择优惠券" clearable>
                <el-option
                  v-for="item in couponOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="等级描述" prop="description">
            <el-input
              type="textarea"
              style="padding-right: 10px; margin-top: 10px;"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="entityObject.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('entityObject')">提交</el-button>
            <el-button @click="cancleBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {getDetail, modifyLevel} from '@/api/member/level'
  import {getAllList as fetchCouponList} from '@/api/marketing/coupon'
  import waves from '@/directive/waves' // waves directive

  export default {
    name: 'LevelModify',
    directives: {waves},
    data() {
      return {
        id: null,
        couponOptions: [],
        entityObject: {},
        rules: {
          name: [
            { required: true, message: '请输入会员等级名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请输入会员等级', trigger: 'blur' }
          ],
          growthPoint: [
            { required: true, message: '请输入会员等级需要的成长值', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if(this.id && this.id > 0){
        this.getConfigDetail();
      }
      this.getCouponList()
    },
    methods: {
      getConfigDetail(){
        getDetail(this.id).then(response => {
          this.entityObject = response.result;
        });
      },
      getCouponList() {
        const param = {};

        fetchCouponList(param).then(response => {
          this.couponOptions = []
          const brandList = response.result
          for (let i = 0; i < brandList.length; i++) {
            this.couponOptions.push({ label: brandList[i].name, value: brandList[i].id })
          }
        })
      },
      cancleBack(){
        this.$router.back();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyLevel(this.entityObject).then(response => {
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
