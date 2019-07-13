<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>商品分类</h3>
        <el-form :model="entityObject" :rules="rules" ref="entityObject" label-width="120px" class="demo-ruleForm">
          <el-input type="hidden" v-model="entityObject.id"></el-input>
          <el-form-item label="父分类">
            <el-col :span="14">
              <el-col :span="10">
                <el-form-item prop="parentIdsList">
                  <el-cascader
                    style="width: 100%"
                    v-model="entityObject.parentIdsList"
                    class="form-item"
                    change-on-select
                    clearable
                    :options="parentCateOptions"
                  />
                </el-form-item>
              </el-col>
              <el-col class="line line-require" :span="4">分类名称</el-col>
              <el-col :span="10">
                <el-form-item prop="name">
                  <el-input v-model="entityObject.name"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-col :span="14">
              <el-input v-model="entityObject.keywords"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否展示">
            <el-col :span="14">
              <el-col :span="10">
                <el-form-item prop="showStatus">
                  <el-select v-model="entityObject.showStatus" style="width: 100%">
                    <el-option
                      v-for="item in showStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
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
          <el-form-item label="分类logo" prop="icon">
            <Upload :imageUrl="entityObject.icon" v-on:imageUploadEvent="imageUploadHandler" />
          </el-form-item>
          <el-form-item label="属性列表">
            <el-col :span="20">
              <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleAddAttr">
                添加
              </el-button>
              <el-table
                :data="entityObject.attributeList"
                style="font-size: 10px;"
                :show-header="true">
                <el-table-column label="编号" width="80">
                  <template slot-scope="item">
                    {{ item.row.id }}
                  </template>
                </el-table-column>
                <el-table-column label="类型" width="100">
                  <template slot-scope="item">
                    {{ item.row.attrType | formatAttrType }}
                  </template>
                </el-table-column>
                <el-table-column label="属性名称" width="220px" align="left">
                  <template slot-scope="item">
                    {{ item.row.name | formatNull}}
                  </template>
                </el-table-column>
                <el-table-column label="属性项目" align="left">
                  <template slot-scope="item">
                    {{ item.row.attrValues | formatNull}}
                  </template>
                </el-table-column>
                <el-table-column label="排序" width="80px;" align="center">
                  <template slot-scope="item">
                    {{ item.row.sort }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="item">
                    <el-button type="text" style="font-size: 12px;" @click="handleAttrDelete(item.$index, item.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
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
    <el-dialog title="类目属性" top style="margin-top: 30px;" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="productAttr" :rules="attrRules" label-position="left"  :model="productAttr" label-width="90px">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="productAttr.name"></el-input>
        </el-form-item>

        <el-form-item label="属性类型:">
          <el-col :span="8">
            <el-select v-model="productAttr.attrType" style="width: 100%">
              <el-option
                v-for="item in attrTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col class="line" :span="3">排序:</el-col>
          <el-col :span="8">
            <el-input-number v-model="productAttr.sort" controls-position="right" style="width: 100%" :min="1" :max="1000"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="属性项目:" prop="attrValues">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="productAttr.attrValues"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getDetail, modifyCategory, fetchTreeList} from '@/api/product/category'
  import waves from '@/directive/waves' // waves directive
  import Upload from '@/components/Upload/CosImageUpload'

  const defaultProductAttr = {
    attrType:0,
    sort:100
  }

  export default {
    name: 'CategoryModify',
    directives: {waves},
    components: { Upload },
    filters:{
      formatNull(value){
        if (value === ''){
          return '未知'
        } else {
          return value
        }
      },
      formatAttrType(value){
        if (value === 0){
          return '普通属性';
        } else if(value === 1){
          return '图片属性';
        }
        return '';
      }
    },
    data() {
      return {
        id: null,
        entityObject: {showStatus:1,sort:100,attributeList:[]},
        dialogFormVisible: false,
        parentCateOptions:[],
        productAttr:Object.assign({},defaultProductAttr),
        showStatusOptions: [{
          value: 1,
          label: '显示'
        }, {
          value: 0,
          label: '隐藏'
        }],
        attrTypeOptions: [{
          value: 1,
          label: '图片属性'
        }, {
          value: 0,
          label: '普通属性'
        }],
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ]
        },
        attrRules: {
          name: [
            { required: true, message: '请输入属性项名称', trigger: 'blur' },
            { max: 64, message: '名字小于64 个字符', trigger: 'blur' }
          ],
          attrValues: [
            { required: true, message: '请输入属性项', trigger: 'blur' },
            { max: 255, message: '属性项小于255 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if(this.id && this.id > 0){
        this.modifyCategory();
      }
      this.getParentCateList()
    },
    methods: {
      modifyCategory(){
        getDetail(this.id).then(response => {
          this.entityObject = response.result;
          if (!this.entityObject.attributeList){
            this.entityObject.attributeList = [];
          }
        });
      },
      cancleBack(){
        this.$router.back();
      },
      imageUploadHandler(images){
        if (images && images.length > 0){
          this.entityObject.icon = images[0];
        }
      },
      handleAttrDelete(index,row){
        this.entityObject.attributeList.splice(index,1)
      },
      handleAddAttr(){
        this.productAttr=Object.assign({},defaultProductAttr);
        this.dialogFormVisible = true;
      },
      getParentCateList(){
        fetchTreeList({}).then(response => {
          const list = response.result
          this.parentCateOptions = []
          for (let i = 0; i < list.length; i++) {
            const children = []
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
              }
            }
            this.parentCateOptions.push({ label: list[i].name, value: list[i].id, children: children })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyCategory(this.entityObject).then(response => {
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
      handlerConfirm(){
        this.$refs.productAttr.validate((valid) => {
          if (valid) {
            this.entityObject.attributeList.push(this.productAttr);
            this.dialogFormVisible = false
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
