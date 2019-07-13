<!--自定义表格树
<MyTableTree :mate="treeConfig" ref="MyTree"></MyTableTree>
treeConfig: {
    //等于 el-tree 的选项配置
    options: {
        'show-checkbox': true
    },
    //自定义表格列 目前只支持文本渲染
    columns: [
        {
            label: '菜单编码',
            prop: 'funcCode',
            span: 5
        }
    ],
    //操作按钮列表
    actions: [
        {
            type: String  //同el-button 的 type
            prop: function | String  //支持函数返回html 和 文本字符串
            action: function //按钮点击触发的函数 回调函数是该行的row
        }
    ],
    //tree 的数据来源
    rows: []
}
//得到该组件里 tree的实例用 this.$refs[name].tree
-->
<template>
  <div class="myGrid">
    <el-row>
      <el-col :span="24">
        <div class="rltv">
          <div class="tree-title tree-head-first">{{mate.title || '标题'}}</div>
          <el-row class="last">
            <el-col v-for="col in mate.columns" :key="col.label" :span="col.span" class="tree-title" :class="{'text-center': col.center}">{{col.label}}</el-col>
            <el-col :span="actionSpan" class="tree-title text-center" v-if="this.mate.actions && this.mate.actions.length">操作</el-col>
          </el-row>
        </div>
        <div class="myGridTree">
          <el-tree :data="mate.rows" :expand-on-click-node="false" :props="defaultProps" v-bind="mate.options"
                   @check-change="handleCheckChange" :render-content='renderContent'
                   @node-click="handleClick" @current-change="handleCurrentChange" ref="myTreeGrid">
          </el-tree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TreeCheckButton from './TreeCheckButton';
export default {
  components: {
    TreeCheckButton
  },
  props: {
    mate: Object,
    required: true
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tree: null,
      btnDisable: true,
      actionSpan: 0
    };
  },
  mounted () {
    this.tree = this.$refs.myTreeGrid;
  },
  created () {
    this.execSpan();
  },
  methods: {
    // 计算按钮宽度
    execSpan () {
      let sum = 0;
      this.mate.columns.map(col => {
        sum += Number.parseInt(col.span);
      });
      this.actionSpan = 24 - sum;
      this.mate.actions = this.mate.actions.filter(item => !item.isHide);
      if (!this.mate.actions || !this.mate.actions.length) {
        let last = this.mate.columns.length;
        this.mate.columns[last - 1].span += this.actionSpan;
      }
    },
    renderContent: function (h, node) {
      // 生成按钮
      let buttons = [];
      if (this.mate.actions) {
        for (let btn of this.mate.actions) {
          btn.text = typeof btn.prop === 'function' ? btn.prop(node.data) : btn.prop || '按钮';
          buttons.push(h(TreeCheckButton, {
            props: {
              name: btn.text,
              row: node.data,
              type: btn.type,
              className: btn.className || ''
            },
            on: {
              action: btn.action
            }
          }));
        }
      }
      // 单元格渲染
      let colSpan = 0;
      let cols = this.mate.columns.map((col) => {
        let value = '--', key = col.prop;
        if (typeof key === 'function') {
          value = key.call(this.mate._self || null, h, node.data);
          value = value instanceof Array ? value : [value];
        } else if (typeof key === 'string' && node.data[key]) {
          value = node.data[key];
        }
        colSpan = Number(col.span);
        if (colSpan <= 0) colSpan = 3;
        return h('el-col', {props: {span: colSpan}, 'class': {'text-center': col.center, 'textIndex5': true}}, value);
      });
      // 插入行按钮
      cols.push(h('el-col', {props: {span: this.actionSpan}, 'class': {'text-center': true}}, buttons));
      return h('span', [h('span',{'class': {'textIndex5': true}}, node.data.name), h('div', {'class': {'line-row': true}}, cols)]);
    },
    handleCheckChange (...list) {
      this.$emit('check-change', ...list);
    },
    handleClick (...list) {
      this.$emit('node-click', ...list);
    },
    handleCurrentChange (...list) {
      this.$emit('current-change', ...list);
    }
  }
};
</script>

<style lang="scss">
  $textIn: 8px;
  $borderColor: #e6ebf5;
  $lineH: 55px;
  .myGrid {
    .tree-title {
      border-bottom: 1px solid $borderColor;
      white-space: nowrap;
      overflow: hidden;
      height: $lineH;
      text-indent: $textIn;
      min-width: 0;
      text-overflow: ellipsis;
      box-sizing: border-box;
      font-size: 12px;
      color: #909399;
      font-weight:500;
      padding: 10px 0;
      text-align: center;
    }
    .tree-head-first {
      width: 30%;
      padding-left: 15px;
      position: absolute;
      left: 0;
      top: 0;
      text-align: left !important;
    }
    .el-tree-node__content {
      height: $lineH;
      position: relative;
      border-bottom: 1px solid $borderColor;
      border-top: none;
      text-align: left;
      .line-row {
        position: absolute;
        left: 30%;
        top: 0;
        width: 70%;
        margin-left: -1px;
        .el-col {
          overflow: hidden;
          //border-left: 1px solid $borderColor;
        }
      }
    }
    .myGridTree {
    }
    .line-btn {
      margin-left: 0;
      position: absolute;
      top: 10px
    }
    .textIndex5 {
      text-indent: $textIn;
      font-size: 12px;
      height: $lineH;
      line-height: $lineH;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .last {
      margin-left: 30%;
    }
    .rltv {
      position: relative;
      //border: 1px solid #dfe6ec;
      border-bottom: 0;
    }
    .col-tree, .text-center {
      text-align: center;
    }
  }
</style>
