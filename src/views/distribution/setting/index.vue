<template>
  <div class="app-container">

      <template>
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 分销配置 -->
            <el-tab-pane name="baseSetting">
              <span slot="label"><i class="el-icon-setting"></i> 基础配置</span>
              <el-form ref="form" v-loading="settingLoading" label-width="120px" label-position="left" label-suffix=" : ">
                <el-form-item label="商户名称">
                  {{merchant.name}}（{{merchant.merchantSn}}）
                </el-form-item>
                <el-form-item label="分销商是否审核">
                  <el-switch
                    v-model="merchantConfig.isApply"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="启用"
                    inactive-text="禁用">
                  </el-switch>
                </el-form-item>
                <el-form-item label="是否开启分销">
                  <el-switch
                    v-model="merchantConfig.isDistributor"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="启用"
                    inactive-text="禁用"
                    @change="handleConfigChange('distributor')">
                  </el-switch>
                </el-form-item>
                <el-form-item label="是否销售额返点">
                  <el-switch
                    v-model="merchantConfig.isCommission"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="启用"
                    inactive-text="禁用"
                    @change="handleConfigChange('commission')">
                  </el-switch>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!-- 分销等级配置 -->
            <el-tab-pane name="levelSetting">
              <span slot="label"><i class="el-icon-date"></i> 分销等级配置</span>
              <el-form :inline="true" :model="listQuery" class="demo-form-inline">
                <el-form-item label="输入搜索: ">
                  <el-input v-model="listQuery.name" class="form-item" placeholder="等级名称" />
                </el-form-item>
                <el-form-item label="等级数值: ">
                  <el-input v-model="listQuery.index" class="form-item" placeholder="等级" />
                </el-form-item>
                <el-form-item>
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchList">
                    {{ $t('table.search') }}
                  </el-button>
                  <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleModify(0)">
                    添加
                  </el-button>
                </el-form-item>
              </el-form>
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
                <el-table-column label="等级名称" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column label="本级分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.selfSalesRatio">
                    {{ scope.row.selfSalesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="父级分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.parentSalesRatio">
                    {{ scope.row.parentSalesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="祖父分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.grandSalesRatio">
                    {{ scope.row.grandSalesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="需要会费" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.duesPoint">
                    {{ scope.row.duesPoint}}(元)
                  </template>
                </el-table-column>
                <el-table-column label="本级会费分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.selfDuesRatio">
                    {{ scope.row.selfDuesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="父级会费分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.parentDuesRatio">
                    {{ scope.row.parentDuesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="祖父会费分销" width="100" align="left">
                  <template slot-scope="scope" v-if="scope.row.grandDuesRatio">
                    {{ scope.row.grandDuesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" style="font-size: 12px;" @click="handleModify(scope.row.id)">编辑</el-button>
                    <el-button type="text" style="font-size: 12px;" @click="deleteLevelConfig(scope.$index, scope.row)">删除</el-button>
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
                  @pagination="getLevelList"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane name="commissionSetting">
              <span slot="label"><i class="el-icon-share"></i> 销售返点配置</span>
              <el-form :inline="true" :model="commisQuery" class="demo-form-inline">
                <el-form-item label="输入搜索: ">
                  <el-input v-model="commisQuery.name" class="form-item" placeholder="返点名称" />
                </el-form-item>
                <el-form-item>
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleCommisSearchList">
                    {{ $t('table.search') }}
                  </el-button>
                  <el-button v-waves class="filter-item" type="primary" plain icon="el-icon-edit" @click="handleCommisModify(0)">
                    添加
                  </el-button>
                </el-form-item>
              </el-form>
              <el-table
                v-loading="commisLoading"
                :data="commisList"
                stripe
                style="font-size: 12px;"
                fit
                highlight-current-row
                :default-expand-all="false"
                @sort-change="sortChange">

                <el-table-column label="编号" width="80" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.id}}
                  </template>
                </el-table-column>
                <el-table-column label="名称" width="220"  align="left">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column label="最大销售额" width="120" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.maxSales}}(元)
                  </template>
                </el-table-column>
                <el-table-column label="最小销售额" width="120" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.minSales}}(元)
                  </template>
                </el-table-column>
                <el-table-column label="分销额返点比率" width="120" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.salesRatio}}%
                  </template>
                </el-table-column>
                <el-table-column label="描述" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.description}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" style="font-size: 12px;" @click="handleCommisModify(scope.row.id)">编辑</el-button>
                    <el-button type="text" style="font-size: 12px;" @click="deleteCommissionConfig(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pagination-container">
                <el-pagination
                  background
                  layout="total, sizes,prev, pager, next,jumper"
                  :page-size="commisQuery.pageSize"
                  :page-sizes="[10,15,25]"
                  :current-page.sync="commisQuery.pageNum"
                  :total="commisTotal"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  @pagination="getCommisList"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
  </div>
</template>

<script>
import {getDetail, modifyConfig} from '@/api/distribution/setting'
import {fetchList as fetchLevelList,deleteLevel as deleteLevelConfig} from '@/api/distribution/levelConfig'
import {fetchList as fetchCommisList,deleteCommis as deleteCommission} from '@/api/distribution/commissionConfig'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

const ACTIVITY_KEY = 'activityName'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10
}
export default {
  name: 'SettingTable',
  directives: { waves },
  data() {
    return {
      activeName: 'baseSetting',
      tableKey: 0,
      subTableKey: 0,
      form: {},
      settingLoading: true,
      merchant: {},
      merchantConfig: {},
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: 0,
      listLoading: true,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      commisQuery: Object.assign({}, defaultListQuery),
      commisList: null,
      commisTotal: 0,
      commisLoading: true,
    }
  },
  created() {
    let aname = window.localStorage.getItem(ACTIVITY_KEY);
    if (aname){
      this.activeName = aname;
    }
    this.getDetail();
    this.getLevelList();
    this.getCommisList();
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
    getLevelList() {
      this.listLoading = true
      fetchLevelList(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = parseInt(response.result.total)
        this.listLoading = false
      })
    },
    getCommisList(){
      this.commisLoading = true
      fetchCommisList(this.commisQuery).then(response => {
        this.commisList = response.result.list
        this.commisTotal = parseInt(response.result.total)
        this.commisLoading = false
      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getLevelList()
    },
    handleModify(id){
      this.$router.push({path: '/distribution/setting/level/'+id})
    },
    handleCommisSearchList() {
      this.commisQuery.pageNum = 1
      this.getCommisList()
    },
    handleCommisModify(id){
      this.$router.push({path: '/distribution/setting/commission/'+id})
    },
    sortChange(data) {
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getLevelList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getLevelList()
    },
    handleTabClick(tab, event) {
      var name = tab.name;
      window.localStorage.setItem(ACTIVITY_KEY, name)
    },
    deleteLevelConfig(index,row){
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteLevelConfig(row.id).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.handleSearchList();
        });
      }).catch(() => {});
    },
    deleteCommissionConfig(index,row){
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteCommission(row.id).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.handleCommisSearchList();
        });
      }).catch(() => {});
    },
    handleConfigChange(type){
      let data = {};
      if ('distributor' === type) {
        data.isDistributor = this.merchantConfig.isDistributor;
      }
      if ('commission' === type){
        data.isCommission = this.merchantConfig.isCommission;
      }
      modifyConfig(data).then(response=>{
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
      });
    }
  }
}
</script>
