<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="输入搜索: ">
            <el-input v-model="listQuery.name" class="form-item" placeholder="活动名称" />
          </el-form-item>
          <el-form-item label="活动类型: ">
            <el-select v-model="listQuery.type" class="form-item" placeholder="全部" :clearable="true">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用类型: ">
            <el-select v-model="listQuery.useType" class="form-item" placeholder="全部" :clearable="true">
              <el-option
                v-for="item in useTypeOptions"
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
            <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleAdd">
              添加
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
        stripe
        style="font-size: 12px;"
        fit
        highlight-current-row
        :default-expand-all="false"
        @sort-change="sortChange">
        <el-table-column label="活动名称" width="180" align="left">
          <template slot-scope="scope">
            <span class="link-type" @click="couponDetail(scope.$index, scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.type | formatType}}
          </template>
        </el-table-column>
        <el-table-column label="使用类型" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.useType === 1 || scope.row.useType === 2">
              <el-popover
                placement="right"
                width="500"
                :ref="'couponPover'+scope.$index"
                @show="getRelationData(scope.$index, scope.row)"
                trigger="hover">
                <el-table
                  :data="relationData"
                  v-loading="relationLoading"
                  stripe
                  style="font-size: 12px;"
                  max-height="250"
                  fit
                  highlight-current-row
                  :default-expand-all="false">
                  <el-table-column width="60" property="relationId" label="编号"></el-table-column>
                  <el-table-column property="relationName" label="名称"></el-table-column>
                  <el-table-column width="120" property="relationSn" label="编码"></el-table-column>
                  <el-table-column width="80" label="图片">
                    <template slot-scope="item">
                      <span><img style="height: 45px" :src="item.row.relationPic"></span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
              <el-button v-popover="'couponPover' + scope.$index" type="text" style="font-size: 12px;">{{ scope.row.useType | formatUseType}}</el-button>
            </span>
            <span v-else>
              {{ scope.row.useType | formatUseType}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.startTime | formatCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.endTime | formatCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="活动信息" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">满{{scope.row.fullPrice}}(元) 减 {{scope.row.reducePrice}}(元)</span>
            <span v-else-if="scope.row.type === 1">满{{scope.row.fullPrice}}(元) 赠 {{scope.row.giftName}}</span>
            <span v-else-if="scope.row.type === 2">限时优惠 折扣 {{scope.row.discount}}%</span>
            <span v-else-if="scope.row.type === 3">赠品 {{scope.row.giftName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="180" align="left">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
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
  import {fetchList, getDetail, modifyPromotion, deletePromotion} from '@/api/marketing/promotion'
  import {formatDate} from '@/utils/date'
  import waves from '@/directive/waves' // waves directive

  // 默认查询参数
  const defaultListQuery = {
    name: null,
    type: null,
    pageNum: 1,
    pageSize: 10
  }
  const defaultReturnReason = {
    name:null,
    sort:100,
    status:0,
    createTime:null
  }

  export default {
    name: 'PromotionTable',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableKey: 0,
        list: null,
        relationData: null,
        total: 0,
        listLoading: true,
        relationLoading: true,
        useTypeOptions: [{
          value: 0,
          label: '全场通用'
        },{
          value: 1,
          label: '指定分类'
        },{
          value: 2,
          label: '指定商品'
        }],
        typeOptions: [{
          value: 0,
          label: '满减'
        },{
          value: 1,
          label: '满赠'
        },{
          value: 2,
          label: '限时优惠'
        },{
          value: 3,
          label: '赠品'
        }],
        entityId: null,
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        if (time == null || time === '') {
          return ''
        }
        const dateTime = new Date(time);
        return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
      },
      formatStatus(value) {
        if (value === 1){
          return '未启用'
        } else if (value === 0){
          return '启用'
        }
        return '未启用'
      },
      formatUseType(value){
        if (value === 1){
          return '指定分类'
        } else if(value === 2){
          return '指定商品'
        }else{
          return '全场通用'
        }
      },
      formatType(value) {
        if (value === 1){
          return '满赠'
        } else if(value === 2){
          return '限时优惠'
        }else if(value === 3){
          return '赠品'
        }else {
          return '满减'
        }
      }
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
      getRelationData(index,row){
        this.relationLoading = true;
        getDetail(row.id).then(response => {
          this.relationData = response.result.relationList
          this.relationLoading = false
        })
      },
      couponDetail(index,row){
        this.$router.push({path: '/marketing/promotion/detail/'+row.id})
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
      handleSizeChange(val) {
        this.listQuery.pageNum = 1
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleAdd() {
        this.$router.push({path: '/marketing/promotion/create/0'})
      },
      handleUpdate(index, row){
        this.entityId = row.id;
        this.$router.push({path: '/marketing/promotion/create/'+row.id})
      },
      handleDelete(index, row) {
        console.log(this)
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          deletePromotion(row.id).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.getList();
          });
        }).catch(() => {});
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
