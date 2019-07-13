<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="输入搜索: ">
        <el-input v-model="listQuery.keyword" class="form-item" style="width: 140px;" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="商品分类: ">
        <el-cascader
          v-model="listQuery.categoryId"
          class="form-item"
          clearable
          :options="productCateOptions"
          style="width: 140px;"
        />
      </el-form-item>
      <el-form-item label="商品品牌: ">
        <el-select v-model="listQuery.brandId" class="form-item" style="width: 140px;" placeholder="请选择品牌" clearable>
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
          {{ $t('table.search') }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="productList"
      :data="list"
      style="font-size: 12px;width: 100%;"
      height="350"
      @selection-change="handleSelectionChange"
      stripe
      fit
      highlight-current-row
      @sort-change="sortChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="商品图片" width="100px" align="center">
        <template slot-scope="scope">
          <span><img style="height: 25px" :src="scope.row.pic"></span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="120px">

        <template slot-scope="scope">
          <span class="link-type" @click="">{{ scope.row.name }}</span>
        </template>

      </el-table-column>
      <el-table-column label="品牌" width="100px" align="center">
        <template slot-scope="scope">
          {{ scope.row.brandName }}
        </template>
      </el-table-column>
      <el-table-column label="分类" width="100px" align="center">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80px" prop="sort" sortable="custom" align="center">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column label="销量" width="80px;" align="center">
        <template slot-scope="scope">
          {{ scope.row.sale }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,25]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
  import {
    fetchList,
    deleteProduct,
    updateLabel
  } from '@/api/product/product'
  import waves from '@/directive/waves' // waves directive
  import { fetchTreeList as fetchCategoryTreeList } from '@/api/product/category'
  import { listAll as fetchBrandList } from '@/api/product/brand'

  // 默认查询参数
  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 10,
    publishStatus: null,
    verifyStatus: null,
    spuCode: null,
    categoryId: null,
    brandId: null
  }

  export default {
    name: 'ProductTable',
    directives: { waves },
    props: {
      selectList: {
        type: Map,
        default: function () {
          return new Map()
        }
      }
    },
    filters: {
      formatPublishStatus(value){
        if (value === 1) {
          return '上架'
        } else {
          return '下架'
        }
      }
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        currentProductList: new Map(),
        productCateOptions: [],
        brandOptions: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
      }
    },
    created() {
      this.getList()
      this.getBrandList()
      this.getProductCateList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.result.list
          this.total = parseInt(response.result.total)
        }).then(() => {
          let map = this.selectList

          this.list.forEach(row => {
            if (map.has(row.id)){
              this.$refs.productList.toggleRowSelection(row,true);
              this.currentProductList.set(row.id,row);
            }
          });
          this.listLoading = false
        });
      },
      getProductCateList() {
        fetchCategoryTreeList({}).then(response => {
          const list = response.result
          this.productCateOptions = []
          for (let i = 0; i < list.length; i++) {
            const children = []
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
              }
            }
            this.productCateOptions.push({ label: list[i].name, value: list[i].id, children: children })
          }
        })
      },
      getBrandList() {
        fetchBrandList({}).then(response => {
          this.brandOptions = []
          const brandList = response.result
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({ label: brandList[i].name, value: brandList[i].id })
          }
        })
      },
      handleSearchList() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'sort') {
          if (order === 'ascending') {
            this.listQuery.sort = '+sort'
          } else {
            this.listQuery.sort = '-sort'
          }
          this.handleSearchList()
        }
      },
      handleAddProduct() {
        this.$router.push({ path: '/products/product/create' })
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      getROwIndex(row){
        let _index = this.list.lastIndexOf(row)
        return _index
      },
      handleSelectionChange(val){
        //加载完毕执行
        if (!this.listLoading){
          const newCurrentMap = new Map();
          //先找添加
          val.forEach((row) => {
            if (!this.currentProductList.has(row.id)){
              //总数据中添加一个
              this.$emit('productSelectEvent','add',row);
            }
            newCurrentMap.set(row.id,row);
          })
          //找删除
          this.currentProductList.forEach((val,key) => {
            if (!newCurrentMap.has(key)){
              this.$emit('productSelectEvent','due',val);
            }
          })
          this.currentProductList = newCurrentMap;
        }
      }
    }
  }
</script>

<style>
  .el-switch__label * {
    line-height: 1;
    font-size: 10px;
    display: inline-block;
  }
  .demo-form-inline{
    font-size: 12px !important;
  }
  .el-form-item__label{
    font-size: 12px !important;
  }
</style>
