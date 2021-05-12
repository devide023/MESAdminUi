<template>
  <div>
    <el-dialog
      title="组合查询"
      :visible.sync="showdialog"
      @close="close_dialog_handle"
    >
      <el-table :data="list"
      :empty-text="empty_text"
      style="width: 100%">
        <el-table-column header-align="center" align="center" label="左括号">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.left"
              size="small"
              clearable
            >
              <el-option
                v-for="(item, index) in leftlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="字段名">
          <template slot-scope="scope">
            <el-select v-model="scope.row.colname" size="small" placeholder="">
              <el-option
                v-for="(item, index) in collist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="条件">
          <template slot-scope="scope">
            <el-select v-model="scope.row.oper" size="small" placeholder="">
              <el-option
                v-for="(item, index) in operlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="条件值">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.value"
              size="small"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="逻辑值">
          <template slot-scope="scope">
            <el-select v-model="scope.row.logic" size="small" clearable>
              <el-option
                v-for="(item, index) in logiclist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="右括号">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.right"
              size="small"
              clearable
            >
              <el-option
                v-for="(item, index) in rightlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="remove_row_handle(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="success" @click="and_query_handle">加条件</el-button>
        <el-button type="primary" @click="query_handle">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isshow: {
      type: Boolean,
      default: false,
    },
    collist: {
      require: true,
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      list: [],
      rowindex: 0,
      isclose:false,
      empty_text:'查询条件为空',
      leftlist: [
        { label: "", value: "" },
        { label: "(", value: "(" },
        { label: "((", value: "((" },
        { label: "(((", value: "(((" },
        { label: "((((", value: "((((" },
      ],
      rightlist: [
        { label: "", value: "" },
        { label: ")", value: ")" },
        { label: "))", value: "))" },
        { label: ")))", value: ")))" },
        { label: "))))", value: "))))" },
      ],
      operlist: [
        { label: "包含", value: "like" },
        { label: "等于", value: "=" },
        { label: "不等于", value: "<>" },
        { label: "大于", value: ">" },
        { label: "大于等于", value: ">=" },
        { label: "小于", value: "<" },
        { label: "小于等于", value: "<=" },
      ],
      logiclist: [
        { label: "并且", value: "and" },
        { label: "或者", value: "or" },
      ],
    };
  },
  computed: {
    showdialog: {
      get() {
        return this.isshow;
      },
      set(val) {
        this.$emit("update:isshow", val);
      },
    },
  },
  methods: {
    query_handle() {
      let ret = "";
      this.list.forEach((item) => {
        ret =
          ret + ` ${item.colname} ${item.oper} ${item.value} ${item.logic} `;
      });
      this.$emit("query", { exp: ret, list: this.list });
      this.$emit("close",this.isclose)
    },
    and_query_handle() {
      this.list.push({
        rowno: this.rowindex,
        left: "",
        right: "",
        colname: "",
        oper: "",
        value: "",
        logic: "",
      });
      this.rowindex++;
    },
    remove_row_handle(row) {
      let pos = this.list.findIndex((i) => i.rowno === row.rowno);
      this.list.splice(pos, 1);
    },
    close_dialog_handle() {
      this.$emit("close", this.isclose);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>