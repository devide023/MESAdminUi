<template>
  <div>
    <base-query @query="queryhandle">
      <template #other>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="add_role"
        >新增角色</el-button>
      </template>
    </base-query>
    <el-table :data="list">
      <el-table-column label="编号" prop="code" />
      <el-table-column label="名称" prop="title" />
      <el-table-column label="创建者" prop="adduser" />
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.addtime | format_date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="role_edit(scope.row)">编辑</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="role_menu(scope.row)">关联菜单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageindex"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="recordcount"
      background
      style="text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" top="10px">
      <el-form
        ref="role_form"
        :model="role_form"
        label-position="right"
        size="small"
        label-width="100px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="role_form.title" />
        </el-form-item>
        <el-form-item label="菜单及功能">
          <el-tree :data="menutree" :props="treeconfig"
                   show-checkbox
                   node-key="id"
          />
        </el-form-item>
        <el-form-item label="编辑字段">
          <el-table
            :data="fieds"
            style="width: 100%"
          >
            <el-table-column
              label="label"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="隐藏字段">
          <el-table
            :data="fieds"
          >
            <el-table-column
              prop="prop"
              label="label"
            />
          </el-table>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="error" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save_role_handle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseQuery from "@/components/QueryBar/BaseQuery";
import RoleFn from "@/api/role/index";
import MenuFn from "@/api/menu/index";
export default {
  components: {
    BaseQuery,
  },
  data() {
    return {
      dialogVisible: false,
      dialogtitle: "",
      list: [],
      menutree: [],
      funsdata: [],
      fieds:[],
      editfieds:[],
      hidefieds:[],
      queryform: {
        keyword: "",
      },
      role_form: {
        title: "",
      },
      treeconfig: {
        children: "children",
        label: "title",
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 20,
    };
  },
  mounted() {
    this.getlist();
    this.getmenutree();
  },
  methods: {
    getlist() {
      RoleFn.role_list({
        keyword: this.queryform.keyword,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      })
        .then((result) => {
          this.list = result.list;
          this.recordcount = result.resultcount;
        })
        .catch((err) => {
          this.$message(err);
        });
    },
    getmenutree() {
      MenuFn.menu_tree({
        pid: 0,
        pageindex: 1,
        pagesize: 65535,
      }).then((res) => {
        this.menutree = res.list;
      });
    },
    queryhandle(data) {
      console.log(data);
      this.queryform.keyword = data.keyword;
      this.getlist();
    },
    add_role() {
      this.dialogtitle = "新增角色";
      this.dialogVisible = true;
    },
    role_menu(row) {},
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(index) {
      this.pageindex = index;
    },
    save_role_handle() {},
    node_click_handle() {},
  },
};
</script>

<style lang="scss" scoped>
</style>