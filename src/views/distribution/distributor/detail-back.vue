<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <h3>分销商信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销商编号</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.distributorSn}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">管理员名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.managerUserName}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">管理员头像</el-col>
            <el-col class="form-border font-small" :span="5"><img style="height: 35px;vertical-align:middle;" :src="entityObject.managerUserPic"></el-col>
          </el-row>
          <el-row v-if="entityObject.parent">
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商</el-col>
            <el-col class="form-border font-small" :span="5">
              {{entityObject.parent.distributorSn}}
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级管理员名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.parent.managerUserName}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级管理员头像</el-col>
            <el-col class="form-border font-small" :span="5">
              <span><img style="height: 35px;vertical-align:middle;" :src="entityObject.parent.managerUserPic"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销账户</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.splitPayAccount | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">会员数量</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.fansNum | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">推广分销商数量</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.distributorNum | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销等级</el-col>
            <el-col class="form-border font-small" :span="5">
              <!-- 配置hover -->
              {{entityObject.levelName | formatNull}}
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商</el-col>
            <el-col class="form-border font-small" :span="5">
              <span v-if="entityObject.parent">
                {{entityObject.parent.distributorSn | formatNull}}
              </span>
              <span v-else>无</span>
            </el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">上级分销商管理员</el-col>
            <el-col class="form-border font-small" :span="5">
              <span v-if="entityObject.parent">
                {{entityObject.parent.managerUserName | formatNull}}
              </span>
              <span v-else>无</span>
            </el-col>
          </el-row>
        </div>
        <h3>分销信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">本级分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.selfSalesRatio | formatNull}}%</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">父级分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.parentSalesRatio | formatNull}}%</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">祖父分销</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.grandSalesRatio | formatNull}}%</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">分销佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.controbuteCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">代理分销佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.agentCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">利润返点佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.profitCommission | formatNull}}(元)</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">可提取佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.extractedCommission | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">已提取佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.unextractedCommissio | formatNull}}(元)</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">总佣金</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.totalCommission | formatNull}}(元)</el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <div class="filter-container" v-if="entityObject.shop">
      <el-card class="box-card">
        <h3>店铺信息</h3>
        <div class="form-container-border">
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺名称</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.name | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺主图</el-col>
            <el-col class="form-border font-small" :span="5"><span><img style="height: 35px;vertical-align:middle;" :src="entityObject.shop.pic"></span></el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">店铺标题</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.title | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">联系人姓名</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.contactUsername | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">联系人电话</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.contactPhone}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">备注</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.description | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">省</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverProvince | formatNull}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">市</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverCity}}</el-col>
            <el-col :span="3" class="form-border form-left-bg font-small">区县</el-col>
            <el-col class="form-border font-small" :span="5">{{entityObject.shop.receiverRegion | formatNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="form-border form-left-bg font-small">详细地址</el-col>
            <el-col class="form-border font-small" :span="21">{{entityObject.shop.receiverDetailAddress | formatNull}}</el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 查询分销商账户记录 -->
    <div class="filter-container">
      <el-card class="box-card">
        <h3>分销商详情</h3>
        <el-tabs v-model="activeName">
          <el-tab-pane label="操作记录" name="moneyHistory">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
              <el-form-item label="记录类型: ">
                <el-select v-model="listQuery.type" class="form-item" placeholder="全部" :clearable="true">
                  <el-option
                    v-for="item in typeOptions"
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
              v-loading="listLoading"
              :data="historyList"
              stripe
              style="font-size: 12px;"
              fit
              highlight-current-row
              :default-expand-all="false"
              @sort-change="sortChange">
              <el-table-column label="编号" width="60" align="left">
                <template slot-scope="scope">
                  {{ scope.row.id }}
                </template>
              </el-table-column>
              <el-table-column label="金额" width="120" align="left">
                <template slot-scope="scope">
                  {{ scope.row.money }}(元)
                </template>
              </el-table-column>
              <el-table-column label="操作类型" width="120" align="center">
                <template slot-scope="scope">
                  {{ scope.row.type | formatType}}
                </template>
              </el-table-column>
              <el-table-column label="记录" align="left">
                <template slot-scope="scope">
                  {{scope.row.history}}
                </template>
              </el-table-column>
              <el-table-column label="操作人" width="120" align="left">
                <template slot-scope="scope">
                  {{ scope.row.handlerUserName }}
                </template>
              </el-table-column>
              <el-table-column label="头像" width="80" align="center">
                <template slot-scope="scope">
                  <span><img style="height: 35px;vertical-align:middle;" :src="scope.row.handlerUserPic"></span>
                </template>
              </el-table-column>
              <el-table-column label="时间" width="120" align="center">
                <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
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
                @pagination="getHistoryList"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="下级分销商" name="childrenDistr">
            <el-form :inline="true" :model="distrQuery" class="demo-form-inline">
              <el-form-item label="输入搜索: ">
                <el-input v-model="distrQuery.managerUserName" class="form-item" placeholder="分销名称" />
              </el-form-item>
              <el-form-item label="推广编号: ">
                <el-input v-model="distrQuery.distributorSn" class="form-item" placeholder="推广编号" />
              </el-form-item>
              <el-form-item>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleDistrSearchList">
                  {{ $t('table.search') }}
                </el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="distrLoading"
              :data="distrList"
              stripe
              style="font-size: 12px;"
              fit
              highlight-current-row
              :default-expand-all="false"
              @sort-change="sortChange">
              <el-table-column label="头像" width="80" align="center">
                <template slot-scope="scope">
                  <span><img style="height: 35px" :src="scope.row.managerUserPic"></span>
                </template>
              </el-table-column>
              <el-table-column label="分销名称" width="160" align="left">
                <template slot-scope="scope">
                  {{ scope.row.managerUserName }}
                </template>
              </el-table-column>
              <el-table-column label="推广编号" align="left">
                <template slot-scope="scope">
                  {{ scope.row.distributorSn }}
                </template>
              </el-table-column>
              <el-table-column label="分销统计" width="100" align="center">
                <template slot-scope="scope">
                  <router-link :to="'/distribution/distributor/dashbord/'+scope.row.id" class="link-type">
                    <span>分销统计</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="店铺" width="100" align="left">
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="500"
                    :ref="'shopPover'+scope.$index"
                    trigger="hover">
                    <div class="form-container-border">
                      <el-row>
                        <el-col :span="6" class="table-cell table-cell-title">店铺名称</el-col>
                        <el-col :span="6" class="table-cell table-cell-title">店铺主图</el-col>
                        <el-col :span="12" class="table-cell table-cell-title">店铺标题</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="table-cell">{{scope.row.shop.name | formatNull}}</el-col>
                        <el-col :span="6" class="table-cell"><span><img style="height: 20px;vertical-align:middle;" :src="scope.row.shop.pic"></span></el-col>
                        <el-col :span="12" class="table-cell">{{scope.row.shop.title | formatNull}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="table-cell table-cell-title">联系人姓名</el-col>
                        <el-col :span="6" class="table-cell table-cell-title">联系人电话</el-col>
                        <el-col :span="12" class="table-cell table-cell-title">备注</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="table-cell">{{scope.row.shop.contactUsername | formatNull}}</el-col>
                        <el-col :span="6" class="table-cell">{{scope.row.shop.contactPhone | formatNull}}</el-col>
                        <el-col :span="12" class="table-cell">{{scope.row.shop.description | formatNull}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">省</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">市</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">区县</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{scope.row.shop.receiverProvince | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.shop.receiverCity | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.shop.receiverRegion | formatNull}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="table-cell table-cell-title">详细地址</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="table-cell">{{scope.row.shop.receiverDetailAddress | formatNull}}</el-col>
                      </el-row>
                    </div>
                  </el-popover>
                  <el-button v-popover="'shopPover' + scope.$index" type="text" style="font-size: 12px;" >{{ scope.row.shop.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="分销等级" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.levelName}}
                </template>
              </el-table-column>
              <el-table-column label="会员数量" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.fansNum}}
                </template>
              </el-table-column>
              <el-table-column label="推广数量" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.distributorNum }}
                </template>
              </el-table-column>
              <el-table-column label="佣金" width="80" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="380"
                    :ref="'paymentPover'+scope.$index"
                    trigger="hover">
                    <div class="form-container-border">
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">本级分销</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">父级分销</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">祖父分销</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{scope.row.selfSalesRatio | formatNull}}%</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.parentSalesRatio | formatNull}}%</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.grandSalesRatio | formatNull}}%</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">分销佣金</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">代理分销佣金</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">利润返点佣金</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{scope.row.controbuteCommission | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.agentCommission | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.profitCommission | formatNull}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">可提取佣金</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">已提取佣金</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">总佣金</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{scope.row.extractedCommission | formatNull}}(元)</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.unextractedCommissio | formatNull}}(元)</el-col>
                        <el-col :span="8" class="table-cell">{{scope.row.totalCommission | formatNull}}(元)</el-col>
                      </el-row>
                    </div>
                  </el-popover>
                  <el-button v-popover="'paymentPover' + scope.$index" type="text" style="font-size: 12px;" >佣金</el-button>
                </template>
              </el-table-column>
              <el-table-column label="支付账户" width="80" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="280"
                    :ref="'accountPover'+scope.$index"
                    trigger="hover">
                    <div class="form-container-border">
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">分销类型</el-col>
                        <el-col :span="16" class="table-cell table-cell-title">分销账户</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{scope.row.splitPayType | formatSplitPayType}}</el-col>
                        <el-col :span="16" class="table-cell">{{scope.row.splitPayAccount | formatNull}}</el-col>
                      </el-row>
                    </div>
                  </el-popover>
                  <el-button v-popover="'accountPover' + scope.$index" type="text" style="font-size: 12px;" >账户</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button type="text" style="font-size: 12px;" @click="handleDistrDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                background
                layout="total, sizes,prev, pager, next,jumper"
                :page-size="distrQuery.pageSize"
                :page-sizes="[10,15,25]"
                :current-page.sync="distrQuery.pageNum"
                :total="distrTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @pagination="getDistrList"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="我的会员" name="memberList">
            <el-form :inline="true" :model="memberQuery" class="demo-form-inline">
              <el-form-item label="输入搜索: ">
                <el-input v-model="memberQuery.nickname" class="form-item" placeholder="会员名称" />
              </el-form-item>
              <el-form-item label="会员类型: ">
                <el-select v-model="memberQuery.sourceType" class="form-item" placeholder="全部" :clearable="true">
                  <el-option
                    v-for="item in memberTypeOptions"
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
              v-loading="memberLoading"
              :data="memberList"
              stripe
              style="font-size: 12px;"
              fit
              highlight-current-row
              :default-expand-all="false"
              @sort-change="sortChange">
              <el-table-column label="头像" width="80" align="center">
                <template slot-scope="scope">
                  <span><img style="height: 35px;vertical-align:middle;" :src="scope.row.icon"></span>
                </template>
              </el-table-column>
              <el-table-column label="昵称" align="left">
                <template slot-scope="scope">
                  {{ scope.row.nickname }}
                </template>
              </el-table-column>
              <el-table-column label="性别" width="80" align="center">
                <template slot-scope="scope">
                  {{ scope.row.gender | formatGender}}
                </template>
              </el-table-column>
              <el-table-column label="生日" width="120" align="center">
                <template slot-scope="scope">
                  {{ scope.row.birthday}}
                </template>
              </el-table-column>
              <el-table-column label="等级" width="120" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="180"
                    trigger="hover">
                    <span style="font-size: 12px;">成长值: {{ scope.row.growth}}</span>
                    <el-button slot="reference" type="text" style="font-size: 12px;" >{{ scope.row.memberLevelName}}</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="积分" width="80" align="center">
                <template slot-scope="scope">
                  {{ scope.row.integration}}
                </template>
              </el-table-column>
              <el-table-column label="邀请人" width="120" align="center">
                <template slot-scope="scope">
                  {{ scope.row.inviterName }}
                </template>
              </el-table-column>
              <el-table-column label="邀请头像" width="100" align="center">
                <template slot-scope="scope">
                  <span><img style="height: 35px" :src="scope.row.inviterIcon"></span>
                </template>
              </el-table-column>
              <el-table-column label="账户" width="80" align="left">
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="380"
                    :ref="'couponPover'+scope.$index"
                    @show="getAccountData(scope.$index, scope.row)"
                    trigger="hover">
                    <div class="form-container-border" v-show="account" v-loading="accountLoading">
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">订单数量</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">优惠券数量</el-col>
                        <el-col :span="8" class="table-cell table-cell-title">评价数</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{account.orderCount | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{account.couponCount | formatNull}}</el-col>
                        <el-col :span="8" class="table-cell">{{account.commentCount | formatNull}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell table-cell-title">退货数量</el-col>
                        <el-col :span="16" class="table-cell table-cell-title">累计消费金额</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="table-cell">{{account.returnOrderCount | formatNull}}</el-col>
                        <el-col :span="16" class="table-cell">{{account.consumeAmount | formatNull}}(元)</el-col>
                      </el-row>
                    </div>
                  </el-popover>
                  <el-button v-popover="'couponPover' + scope.$index" type="text" style="font-size: 12px;" >账户</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button type="text" style="font-size: 12px;" @click="handleMemberDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                background
                layout="total, sizes,prev, pager, next,jumper"
                :page-size="memberQuery.pageSize"
                :page-sizes="[10,15,25]"
                :current-page.sync="memberQuery.pageNum"
                :total="memberTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @pagination="getMemberList"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getDetail,fetchHistroyList,fetchList as fetchDistrList,deleteDistributor} from '@/api/distribution/distributor'
import {fetchList as fetchMemberList,getDetail as getMemberDetail, deleteMember} from '@/api/member/member'
import {formatDate} from '@/utils/date'
import waves from '@/directive/waves' // waves directive

const defaultListQuery = {
  type: null,
  pageNum: 1,
  pageSize: 10
}
// 默认查询参数
export default {
  name: 'DistributorDetail',
  directives: {waves},
  filters: {
    formatCreateTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const dateTime = new Date(time);
      return formatDate(dateTime, 'yyyy-MM-dd');
    },
    formatUseTime(time) {
      if (time == null || time === '') {
        return ''
      }
      const dateTime = new Date(time);
      return formatDate(dateTime, 'yyyy-MM-dd hh:mm:ss');
    },
    formatNull(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无'
      } else {
        return value
      }
    },
    formatGender(value){
      if (value === 1){
        return '男'
      } else if (value === 2){
        return '女'
      }
      return '未知'
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === '') {
        return '暂无';
      } else if (value.length > 8) {
        return value.substr(0, 8) + '...'
      } else {
        return value
      }
    },
    formatType(value){
      if (value === 0) {
        return '分销';
      }else if (value === 1) {
        return '返点';
      }else if(value === 2) {
        return '提现'
      }
      return ''
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      distrQuery: Object.assign({}, defaultListQuery),
      memberQuery: Object.assign({}, defaultListQuery),
      accountLoading: true,
      account: {},
      id: null,
      activeName: 'moneyHistory',
      listLoading: true,
      total: 0,
      historyList: null,
      entityObject: {},
      distrLoading: true,
      distrTotal: 0,
      distrList: null,
      memberLoading: true,
      memberTotal: 0,
      memberList: null,
      applyForm: {
        receiveType: 0
      },
      typeOptions: [{
        value: 0,
        label: '分销'
      },{
        value: 1,
        label: '返点'
      },{
        value: 2,
        label: '提现'
      }],
      memberTypeOptions: [{
        value: 0,
        label: '微信'
      },{
        value: 1,
        label: '支付宝'
      }]
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.getDetail();
    this.getHistoryList();
    this.getDistrList();
    this.getMemberList();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getHistoryList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getHistoryList()
    },
    sortChange(data) {

    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getHistoryList()
    },
    handleDistrSearchList(){
      this.distrQuery.pageNum = 1
      this.getDistrList()
    },
    handleMemberSearchList(){
      this.memberQuery.pageNum = 1
      this.getMemberList()
    },
    getDetail(){
      getDetail(this.id).then(response => {
        this.entityObject = response.result;
      });
    },
    getHistoryList(){
      this.listLoading = true
      this.listQuery.distributorId = this.id;

      fetchHistroyList(this.listQuery).then(response => {
        this.historyList = response.result.list
        this.total = parseInt(response.result.total)
        this.listLoading = false
      });
    },
    getDistrList(){
      this.distrLoading = true
      this.distrQuery.parentId = this.id;

      fetchDistrList(this.distrQuery).then(response => {
        this.distrList = response.result.list
        this.distrTotal = parseInt(response.result.total)
        this.distrLoading = false
      });
    },
    getAccountData(index,row){
      this.accountLoading = true;
      this.account = {}
      getMemberDetail(row.id).then(response => {
        if (response.result.account){
          this.account = response.result.account
          this.accountLoading = false;
        }
      })
    },
    getMemberList(){
      this.memberLoading = true
      this.memberQuery.distributorId = this.id;

      fetchMemberList(this.memberQuery).then(response => {
        this.memberList = response.result.list
        this.memberTotal = parseInt(response.result.total)
        this.memberLoading = false
      });
    },
    handleDistrDelete(index, row) {
      this.$confirm('是否要进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        deleteDistributor(row.id).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.getDistrList();
        });
      }).catch(() => {});
    }
  }
}
</script>
<style scoped>

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    line-height: 40px;
    padding-left: 10px;

  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .font-small {
    font-size: 12px;
    color: #606266;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
  .el-switch__label * {
    line-height: 1;
    font-size: 10px;
    display: inline-block;
  }

  .table-cell {
    line-height: 25px;
    padding-left: 10px;
    vertical-align: center;
    font-size: 12px;
    color: #606266;
    text-align: left;
    overflow: hidden;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .table-cell-title {
    font-size: 12px;
    line-height: 25px;
    background: #F2F6FC;
    color: #303133;
  }
</style>
