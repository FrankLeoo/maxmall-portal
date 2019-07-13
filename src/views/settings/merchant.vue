<template>
  <div class="app-container">
    <template>
      <el-card class="box-card">
        <h3>{{merchant.name}}配置</h3>
        <el-form :model="merchantConfig" :rules="rules" ref="merchantConfig" v-loading="settingLoading" label-width="120px" label-position="left" label-suffix=" : ">
          <el-form-item label="是否开启积分">
            <el-switch
              v-model="merchantConfig.isPoint"
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="禁用"
              @change="handleConfigChange('point')">
            </el-switch>
          </el-form-item>
          <el-form-item label="积分兑换" v-if="merchantConfig.isPoint">
            <el-col :span="9">
              <el-input placeholder="积分兑换" v-model="merchantConfig.pointCharge" style="width: 100%;">
                <template slot="append">兑换一元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="积分使用限制" v-if="merchantConfig.isPoint">
            <el-col :span="9">
              <el-input placeholder="最低使用积分" v-model="merchantConfig.usePointLimit" style="width: 100%;"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否开启会员">
            <el-switch
              v-model="merchantConfig.isGrowth"
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="禁用"
              @change="handleConfigChange('growth')">
            </el-switch>
          </el-form-item>
          <el-form-item label="成长值兑换" v-if="merchantConfig.isGrowth">
            <el-col :span="9">
              <el-input placeholder="成长值兑换" v-model="merchantConfig.growthCharge" style="width: 100%;">
                <template slot="append">消费一元</template>
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('merchantConfig')">立即提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
  </div>
</template>

<script>
import {getDetail, modifyConfig} from '@/api/distribution/setting'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'SettingTable',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      subTableKey: 0,
      merchant:{},
      settingLoading: true,
      merchantConfig: {},
      rules: {
        isPoint: [
          { required: true, message: '请选择是否开启积分', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDetail();
  },
  filters: {
    formatCreateTime(time) {
      const dateTime = new Date(time);
      return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  methods: {
    getDetail() {
      this.settingLoading = true;
      getDetail({}).then(response => {
        this.merchant = response.result;
        this.merchantConfig = response.result.merchantConfig;
        if (!response.result.merchantConfig){
          this.merchantConfig = {};
        }
        this.settingLoading = false;
      })
    },
    handleConfigChange(type){
      let data = {};
      if ('point' === type) {
        data.isPoint = this.merchantConfig.isPoint;
      }
      if ('growth' === type){
        data.isGrowth = this.merchantConfig.isGrowth;
      }
      modifyConfig(data).then(response=>{
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyConfig(this.merchantConfig).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration:1000
            });
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>
