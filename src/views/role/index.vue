<template>
  <div>
    <base-query @query="queryhandle">
      <template #other>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="add_role"
          >新增角色</el-button
        >
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
              <el-dropdown-item @click.native="role_edit(scope.row)"
                >编辑</el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="role_menu(scope.row)"
                >关联菜单</el-dropdown-item
              >
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
        :rules="rules"
        label-position="right"
        size="small"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="role_form.title" />
        </el-form-item>
        <el-form-item label="功能权限">
          <el-tree
            :data="permissiontree"
            :props="treeconfig"
            ref="permission_tree"
            show-checkbox
            node-key="id"
          />
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
import store from '@/store/index';
export default {
  components: {
    BaseQuery,
  },
  data() {
    return {
      dialogVisible: false,
      dialogtitle: "",
      list: [],
      permissiontree: [],
      fieds: [],
      queryform: {
        keyword: "",
      },
      role_form: {
        title: "",
        menuids: [],
        funs: [],
        editfieds: [],
        hidefieds: [],
        adduser:store.getters.userinfo.id,
        status:1
      },
      treeconfig: {
        children: "children",
        label: "title",
      },
      rules: {
        title: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 20,
    };
  },
  mounted() {
    this.getlist();
    this.getpermissiontree();
  },
  computed: {
    
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
    getpermissiontree() {
      MenuFn.menu_permission_tree().then((res) => {
        this.permissiontree = res.list;
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
    save_role_handle() {
      this.$refs.role_form.validate((v) => {
        if (v) {
          let cknodes = this.$refs.permission_tree.getCheckedNodes(false, true);
          let funs = [];
          let edits = [];
          let hides = [];
          let menuids = [];
          let exitid = [];
          cknodes.forEach((i) => {
            menuids.push(i.id);
            switch (i.title) {
              case "页面功能":
                exitid.push(i.id);
                let sub1 = cknodes.filter((t) => t.pid === i.id);
                sub1.forEach((t) => {
                  funs.push(t.title);
                  exitid.push(t.id);
                });
                break;
              case "编辑字段":
                exitid.push(i.id);
                let sub2 = cknodes.filter((t) => t.pid === i.id);
                sub2.forEach((t) => {
                  edits.push(t.title);
                  exitid.push(t.id);
                });
                break;
              case "隐藏字段":
                exitid.push(i.id);
                let sub3 = cknodes.filter((t) => t.pid === i.id);
                sub3.forEach((t) => {
                  hides.push(t.title);
                  exitid.push(t.id);
                });
                break;
              default:
                break;
            }
          });
          var mids_ok = menuids.filter((i) => !exitid.some((j) => j == i))
          this.role_form.menuids = mids_ok
          this.role_form.funs = funs
          this.role_form.editfieds = edits
          this.role_form.hidefieds = hides
          RoleFn.add_role(this.role_form).then((res) => {
            this.$message.success(res.msg);
            if(res.code === 1)
            {

            }
          });
        }
      });
    },
    node_click_handle() {},
  },
};
</script>

<style lang="scss" scoped>
</style>