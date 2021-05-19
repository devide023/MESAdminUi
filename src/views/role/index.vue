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
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagtype">{{
            scope.row.status | statusname
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" />
      <el-table-column label="名称" prop="title" />
      <el-table-column label="创建者" prop="addusername" />
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
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageindex"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next"
      :total="recordcount"
      background
      style="text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--角色添加窗口-->
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
            ref="permission_tree"
            :data="permissiontree"
            :props="treeconfig"
            show-checkbox
            check-strictly
            accordion
            node-key="id"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save_role_handle">确定</el-button>
      </div>
    </el-dialog>
    <!--角色编辑窗口-->
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogEdit"
      @opened="roleform_openhandle"
    >
      <el-form
        :model="role_form_edit"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="名称">
          <el-input v-model="role_form_edit.title"></el-input>
        </el-form-item>
        <el-form-item label="功能权限">
          <el-tree
            ref="permis_tree_edit"
            :data="permissiontree"
            :props="treeconfig"
            show-checkbox
            check-strictly
            accordion
            node-key="id"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogEdit = false">取消</el-button>
        <el-button type="primary" @click="submit_role_form_edit"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseQuery from "@/components/QueryBar/BaseQuery";
import RoleFn from "@/api/role/index";
import MenuFn from "@/api/menu/index";
import store from "@/store/index";
export default {
  components: {
    BaseQuery,
  },
  data() {
    return {
      dialogVisible: false,
      dialogEdit: false,
      dialogtitle: "",
      list: [],
      permissiontree: [],
      queryform: {
        keyword: "",
      },
      role_form: {
        title: "",
        code: "",
        menu_nodes: [],
        adduser: store.getters.userinfo.id,
        status: 1,
      },
      role_form_edit: {},
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
  computed: {},
  mounted() {
    this.getlist();
    this.getpermissiontree();
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
    role_edit(row) {
      this.dialogtitle = "编辑角色";
      RoleFn.role_menus({ id: row.id }).then((res) => {
        this.role_form_edit.id = row.id;
        this.role_form_edit.code = row.code;
        this.role_form_edit.title = row.title;
        this.role_form_edit.status = row.status;
        this.role_form_edit.menu_nodes = res.menus;
        this.role_form_edit.status = 1;
        this.role_form_edit.updateuser = store.getters.userinfo.id
        this.dialogEdit = true;
      });
    },
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
          this.role_form.menu_nodes = cknodes;
          RoleFn.add_role(this.role_form).then((res) => {
            this.$message(res.msg);
            if (res.code === 1) {
              this.getlist();
              this.dialogVisible = false;
              this.role_menu.menu_nodes = [];
              this.$refs.role_form.resetFields();
              this.$refs.permission_tree.setCheckedKeys([]);
            }
          });
        }
      });
    },
    node_click_handle() {},
    submit_role_form_edit() {
      let cknodes = this.$refs.permis_tree_edit.getCheckedNodes(false, true);
      this.role_form_edit.menu_nodes = cknodes;
      RoleFn.edit_role(this.role_form_edit).then(res=>{
        this.$message.success(res.msg)
        if(res.code === 1)
        {
          this.dialogEdit = false
          this.$refs.permis_tree_edit.setCheckedNodes([]);
        }
      })
      
    },
    roleform_openhandle() {
      let nodes = [];
      this.role_form_edit.menu_nodes.forEach(i=>{
        
        nodes.push(i)
        if(i.menu_permission){
          i.menu_permission.funs
          i.menu_permission.editfields
          i.menu_permission.hidefields
        }
      });
      this.$refs.permis_tree_edit.setCheckedNodes(nodes);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>