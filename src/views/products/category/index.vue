<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.name" class="form-item" placeholder="品牌名称" />
          </el-form-item>
          <el-form-item label="英文名称: ">
            <el-input v-model="listQuery.enName" class="form-item" placeholder="英文名称" />
          </el-form-item>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
              {{ $t('table.search') }}
            </el-button>
            <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleAdd">
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="box-card">
      <TableTree :mate="treeConfig" v-loading="listLoading"></TableTree>
    </el-card>
  </div>
</template>
<script>
const defaultListQuery = {
  name: null,
  enName: null,
  pageNum: 1,
  pageSize: 10
}

import TableTree from './components/TableTree'
import {fetchTreeList,deleteCategory} from '@/api/product/category'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves'

export default {
  name: 'CategoryIndex',
  components: { TableTree },
  directives: { waves },
  data () {
    return {
      attrData: null,
      listQuery: Object.assign({}, defaultListQuery),
      total: 0,
      listLoading: true,
      treeConfig: {
        //等于 el-tree 的选项配置
        options: {
          'show-checkbox': false
        },
        title:'菜单编码',
        //自定义表格列 目前支持文本渲染
        columns: [
          {
            label: '图标',
            prop: function(createElement,node){
              return createElement('img', {
                attrs: {
                  style: "height:25px",
                  src: node.icon
                }
              });
            },
            span: 2  //列宽  小于24
          },
          {
            label: '排序',
            prop: 'sort',
            span: 2  //列宽  小于24
          },
          {
            label: '层级',
            prop: 'index.vue',
            span: 2  //列宽  小于24
          },
          {
            label: '显示',
            prop: function(createElement,node){
              if (node.showStatus === 1){
                return '显示'
              }
              return '未显示'
            },
            span: 2  //列宽  小于24
          },
          {
            label: '属性',
            prop: function(createElement,node){
              let prductAttr = node.attributeList;
              if (!prductAttr){
                prductAttr = [];
              }
              //对属性进行处理
              return createElement(
                "el-popover",
                {
                  props:{
                    placement: 'right',
                    width: '450',
                    trigger: 'hover'
                  }
                },[
                  createElement(
                    "el-table",
                    {
                      attrs:{
                        "data": prductAttr,
                        "default-expand-all": false,
                        "highlight-current-row":true,
                        "style":"font-size: 12px;",
                        "max-height":"200",
                        "stripe":true,
                        "fit":true
                      }
                    },
                    [
                      createElement('el-table-column',{attrs:{"label":"名称","align":"left","prop":"name","width":100}}),
                      createElement('el-table-column',{attrs:{"label":"属性项目","align":"left","prop":"attrValues","width":200}}),
                      createElement('el-table-column',{attrs:{"label":"排序","align":"center","prop":"sort","width":50}}),
                      createElement('el-table-column',{attrs:{"label":"图片属性","align":"center","prop":"attrType","width":80}})
                    ]
                  ),
                  createElement("el-button",{props:{type:'text'},attrs:{slot:'reference',style:'font-size:12px;'},slot:'reference',domProps:{innerHTML:'销售属性'}})
              ]);
            },
            span: 2  //列宽  小于24
          },
          {
            label: '关键字',
            prop: 'keywords',
            span: 4  //列宽  小于24
          },
          {
            label: '描述',
            prop: 'description',
            span: 5  //列宽  小于24
          },
          {
            label: '操作',
            prop: function(createElement,node){
              //创建两个按钮
              return (
                <div class="cell">
                  <button type="button" class="el-button el-button--text el-button--medium" style="font-size: 12px;" onClick={ function () { editHandler(node.id) } }>
                    <span>编辑</span>
                  </button>
                  <button type="button" class="el-button el-button--text el-button--medium" style="font-size: 12px;" onClick={ function () { deleteHandler(node.id) } }>
                    <span>删除</span>
                  </button>
                </div>
              ) ;
            },
            span: 5  //列宽  小于24
          }
        ],
        actions: [

        ],
        rows: []
      }
    }
  },
  created() {
    this.getTreeList();
  },
  mounted(){
    window.deleteHandler = (id) => {
      this.deleteHandler(id);
    };
    window.editHandler = (id) => {
      this.editHandler(id);
    }
  },
  methods: {
    getTreeList() {
      this.listLoading = true
      fetchTreeList(this.listQuery).then(response => {
        this.treeConfig.rows = response.result
        this.listLoading = false
      })
    },
    handleSearchList(obj) {
      this.listQuery.pageNum = 1
      this.getTreeList()
    },
    handleAdd() {
      this.$router.push({path: '/products/category/create/0'})
    },
    editHandler(id) {
      this.$router.push({path:'/products/category/create/'+id})
    },
    deleteHandler(id) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteCategory(id).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getTreeList()
        });
      }).catch(() => {});
    }
  }
}
</script>
<style>
</style>

