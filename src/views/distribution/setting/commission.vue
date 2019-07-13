<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>销售额返点规则</h3>
        <el-form :model="configEntity" :rules="rules" ref="configEntity" label-width="100px" class="demo-ruleForm">
          <el-input type="hidden" v-model="configEntity.id"></el-input>
          <el-form-item label="返点名称" prop="name">
            <el-col :span="14">
              <el-input v-model="configEntity.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="销售额区间">
            <el-col :span="5">
              <el-input placeholder="最大销售额" v-model="configEntity.maxSales" style="width: 100%;">
                <template slot="append">元</template>
              </el-input>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="5">
              <el-input placeholder="最小销售额" v-model="configEntity.minSales" style="width: 100%;">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="返点">
            <el-col :span="9">
              <el-input placeholder="销售额返点" v-model="configEntity.salesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              style="padding-right: 10px; margin-top: 10px;"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="configEntity.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('configEntity')">提交</el-button>
            <el-button @click="cancleBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {getDetail, modifyCommission} from '@/api/distribution/commissionConfig'
  import waves from '@/directive/waves' // waves directive

  export default {
    name: 'CommisModify',
    directives: {waves},
    data() {
      return {
        id: null,
        configEntity: {},
        rules: {
          name: [
            { required: true, message: '请输入销售额返点名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ],
          maxSales: [{ required: true, message: '请输入最大销售额', trigger: 'blur' }],
          minSales: [{ required: true, message: '请输入最小销售额', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if(this.id && this.id > 0){
        this.getConfigDetail();
      }
    },
    methods: {
      getConfigDetail(){
        getDetail(this.id).then(response => {
          this.configEntity = response.result;
        });
      },
      cancleBack(){
        this.$router.back();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyCommission(this.configEntity).then(response => {
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
    text-align: center;
  }
</style>
