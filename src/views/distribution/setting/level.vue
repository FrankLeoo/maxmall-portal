<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>分销等级规则</h3>
        <el-form :model="configEntity" :rules="rules" ref="configEntity" label-width="100px" class="demo-ruleForm">
          <el-input type="hidden" v-model="configEntity.id"></el-input>
          <el-form-item label="等级名称" prop="name">
            <el-col :span="14">
              <el-input v-model="configEntity.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="分销比率">
            <el-col :span="4">
              <el-input placeholder="本级分销" v-model="configEntity.selfSalesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="4">
              <el-input placeholder="父级分销" v-model="configEntity.parentSalesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="4">
              <el-input placeholder="祖父级分销" v-model="configEntity.grandSalesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否需要会费" prop="isDues">
            <el-switch
              v-model="configEntity.isDues"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="会员费" v-if="configEntity.isDues">
            <el-col :span="9">
              <el-input placeholder="会员费" v-model="configEntity.duesPoint" style="width: 100%;">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="会员费提成" v-if="configEntity.isDues">
            <el-col :span="4">
              <el-input placeholder="邀请人提成" v-model="configEntity.selfDuesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="4">
              <el-input placeholder="父级邀请人提成" v-model="configEntity.parentDuesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="4">
              <el-input placeholder="祖父级邀请人提成" v-model="configEntity.grandDuesRatio" style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="等级描述" prop="description">
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
import {getDetail, modifyLevel} from '@/api/distribution/levelConfig'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'LevelModify',
  directives: {waves},
  data() {
    return {
      id: null,
      configEntity: {},
      rules: {
        name: [
          { required: true, message: '请输入分销等级名称', trigger: 'blur' },
          { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
        ]
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
          modifyLevel(this.configEntity).then(response => {
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
