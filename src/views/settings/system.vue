<template>
  <div class="app-container">

    <template>
      <el-card class="box-card">
        <h3>{{merchant.name}}系统配置</h3>
        <el-form :model="merchantConfig" :rules="rules" ref="merchantConfig" v-loading="settingLoading" label-width="160px" label-position="left" label-suffix=" : ">
          <el-form-item label="自动完成交易时间">
            <el-col :span="9">
              <el-input placeholder="自动完成交易时间，默认30天" v-model="merchantConfig.finishOvertime" style="width: 100%;">
                <template slot="append">天</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="自动好评时间">
            <el-col :span="9">
              <el-input placeholder="自动好评时间，默认7天" v-model="merchantConfig.commentOvertime" style="width: 100%;">
                <template slot="append">天</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="秒杀订单超时关闭时间">
            <el-col :span="9">
              <el-input placeholder="秒杀订单超时关闭时间(分) 默认10分钟" v-model="merchantConfig.confirmOvertime" style="width: 100%;">
                <template slot="append">分</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="正常订单超时时间">
            <el-col :span="9">
              <el-input placeholder="正常订单超时时间(分) 默认15分钟" v-model="merchantConfig.normalOrderOvertime" style="width: 100%;">
                <template slot="append">分</template>
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
  import {getDetail, modifyTimeConfig} from '@/api/distribution/setting'
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
        modifyTimeConfig(data).then(response=>{
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyTimeConfig(this.merchantConfig).then(response => {
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
