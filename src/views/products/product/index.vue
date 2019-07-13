<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.keyword" class="form-item" placeholder="商品名称" />
          </el-form-item>
          <el-form-item label="商品货号: ">
            <el-input v-model="listQuery.spuCode" class="form-item" placeholder="商品货号" />
          </el-form-item>
          <el-form-item label="商品分类: ">
            <el-cascader
              v-model="listQuery.categoryId"
              class="form-item"
              clearable
              :options="productCateOptions"
            />
          </el-form-item>
          <el-form-item label="商品品牌: ">
            <el-select v-model="listQuery.brandId" class="form-item" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态: ">
            <el-select v-model="listQuery.publishStatus" class="form-item" placeholder="全部">
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态: ">
            <el-select v-model="listQuery.verifyStatus" class="form-item" placeholder="全部">
              <el-option
                v-for="item in verifyStatusOptions"
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
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              plain
              icon="el-icon-edit"
              @click="handleAddProduct"
            >
              {{ $t('table.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="box-card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        style="font-size: 12px;width: 100%;"
        stripe
        fit
        highlight-current-row
        @sort-change="sortChange">
        <el-table-column label="商品图片" width="100px" align="center">
          <template slot-scope="scope">
            <span><img style="height: 55px" :src="scope.row.pic"></span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="120px">

          <template slot-scope="scope">
            <span class="link-type" @click="">{{ scope.row.name }}</span>
            <el-tag>{{ scope.row.brandName }}</el-tag>
          </template>

        </el-table-column>
        <el-table-column label="价格/货号" width="120px">
          <template slot-scope="scope">
            <p>价格:{{ scope.row.price }}</p>
            <p>货号:{{ scope.row.spuCode }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="100px" align="center">
          <template slot-scope="scope">
            <p>新品:
              <el-switch
                v-model="scope.row.newStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handleLabelChange('new',scope.$index, scope.row)"
              />
            </p>
            <p>推荐:
              <el-switch
                v-model="scope.row.recommandStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handleLabelChange('recommand',scope.$index, scope.row)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="热卖" width="100px" align="center">
          <template slot-scope="scope">
            <p>
              <el-switch
                v-model="scope.row.hotStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handleLabelChange('hot',scope.$index, scope.row)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="上架" width="90px" align="center">
          <template slot-scope="scope">
            {{scope.row.isPublish | formatPublishStatus}}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80px" prop="sort" sortable="custom" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="60px;">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="80px;" align="center">
          <template slot-scope="scope">
            {{ scope.row.sale }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" style="font-size: 12px;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    </el-card>
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
        selectProductCateValue: null,
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        editSkuInfo: {
          dialogVisible: false,
          productId: null,
          productSn: '',
          categoryId: null,
          stockList: [],
          productAttr: [],
          keyword: null
        }
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
          this.listLoading = false
        })
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
      handleShowSkuEditDialog(index, row) {
        this.editSkuInfo.dialogVisible = true
        this.editSkuInfo.productId = row.id
        this.editSkuInfo.productSn = row.productSn
        this.editSkuInfo.categoryId = row.ategoryId
        this.editSkuInfo.keyword = null
        fetchSkuStockList(row.id, { keyword: this.editSkuInfo.keyword }).then(response => {
          this.editSkuInfo.stockList = response.data
        })
        fetchProductAttrList(row.categoryId, { type: 0 }).then(response => {
          this.editSkuInfo.productAttr = response.data.list
        })
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          deleteProduct(row.id).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.getList();
          });
        }).catch(() => {});
      },
      handleLabelChange(type, index, row){
        let data = {};
        data.type = type;
        data.id = row.id;
        data.status = index;
        updateLabel(data).then(response=>{

        });
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
</style>
