<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>商品品牌</h3>
        <el-form :model="entityObject" :rules="rules" ref="entityObject" label-width="120px" class="demo-ruleForm">
          <el-input type="hidden" v-model="entityObject.id"></el-input>
          <el-form-item label="品牌名称" prop="name">
            <el-col :span="14">
              <el-col :span="10">
                <el-form-item prop="name">
                  <el-input v-model="entityObject.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line line-require" :span="4">英文名称</el-col>
              <el-col :span="10">
                <el-form-item prop="enName">
                  <el-input v-model="entityObject.enName"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="首字母">
            <el-col :span="14">
              <el-col :span="10">
                <el-form-item prop="firstLetter">
                  <el-input v-model="entityObject.firstLetter"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line line-require" :span="4">排序</el-col>
              <el-col :span="10">
                <el-form-item prop="sort">
                  <el-input-number v-model="entityObject.sort" controls-position="right" style="width: 100%" :min="1" :max="1000"></el-input-number>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="品牌logo" prop="logo">
              <Upload :imageUrl="entityObject.logo" v-on:imageUploadEvent="imageUploadHandler" />
          </el-form-item>
          <el-form-item label="品牌描述" prop="description">
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

  </div>
</template>

<script>
  import {getDetail, modifyBrand} from '@/api/product/brand'
  import waves from '@/directive/waves' // waves directive
  import Upload from '@/components/Upload/CosImageUpload'

  export default {
    name: 'BrandModify',
    directives: {waves},
    components: { Upload },
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
        entityObject: {sort:100},
        rules: {
          name: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ],
          enName: [
            { required: true, message: '请输入英文品牌名称', trigger: 'blur' },
            { max: 64, message: '英文名字小于64 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if(this.id && this.id > 0){
        this.getBrandDetail();
      }
    },
    methods: {
      getBrandDetail(){
        getDetail(this.id).then(response => {
          this.entityObject = response.result;
        });
      },
      cancleBack(){
        this.$router.back();
      },
      imageUploadHandler(images){
        if (images && images.length > 0){
          this.entityObject.logo = images[0];
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyBrand(this.entityObject).then(response => {
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
