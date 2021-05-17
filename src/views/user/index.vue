<template>
  <div>
    <div class="query_bar">
      <el-input
        v-model="queryform.keyword"
        placeholder="关键字:姓名、编码"
        clearable
        size="small"
        class="query_txt"
      ></el-input>
      <el-button
        type="success"
        icon="el-icon-search"
        size="small"
        @click="queryhandle"
        >查询</el-button
      >
      <el-button type="warning" @click="dialog_comquery = true" size="small"
        >组合查询</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        v-fun="{ code: 'add' }"
        @click="show_user_dialog"
        >新增</el-button
      >
    </div>
    <el-table
      :data="list"
      ref="table_user"
      stripe
      border
      row-key="id"
      size="mini"
      style="width: 100%"
    >
      <el-table-column type="selection" @select="handleSelect">
      </el-table-column>
      <el-table-column prop="id" label="UID" width="100"> </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagtype">{{
            scope.row.status | statusname
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        column-key="code"
        label="编号"
        v-hide="{ code: 'code' }"
        width="100"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.code" ref="code"></el-input>
          </template>
          <span v-else>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="150"
        column-key="name"
        v-hide="{ code: 'name' }"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.name" ref="name"></el-input>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" column-key="role">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.roleids" multiple style="width: 100%">
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
          <span v-else>{{ get_rolesname(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="!scope.row.edit"
                @click.native="user_edit(scope.row)"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.edit"
                @click.native="submit_edit(scope.row)"
                >提交</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.edit"
                @click.native="cancel_edit(scope.row)"
                >取消</el-dropdown-item
              >
              <el-dropdown-item @click.native="change_pwd(scope.row)"
                >改密</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="recordcount"
      :current-page="pageindex"
      :page-size="pagesize"
      :page-sizes="[20, 50, 100, 200]"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      background
      style="text-align: right"
    ></el-pagination>

    <el-dialog :title="dialog_title" :visible.sync="dialog_user" top="10px">
      <el-form
        :model="user_form"
        ref="user_form"
        :rules="rules"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="用户编码" prop="code">
          <el-input v-model="user_form.code" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user_form.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="user_form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="关联角色" prop="roleids">
          <el-select
            v-model="user_form.roleids"
            multiple
            collapse-tags
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_user = false">取消</el-button>
        <el-button type="primary" @click="save_user">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialog_title"
      :visible.sync="dialog_user_edit"
      top="10px"
    >
      <el-form
        :model="user_form_edit"
        ref="user_form_edit"
        :rules="rules"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="用户编码" prop="code">
          <el-input v-model="user_form_edit.code" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user_form_edit.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="关联角色" prop="roleids">
          <el-select
            v-model="user_form_edit.roleids"
            multiple
            collapse-tags
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_user_edit = false"
          >取消</el-button
        >
        <el-button type="primary" @click="submit_user_edit">确定</el-button>
      </div>
    </el-dialog>
    <com-query
      :isshow="dialog_comquery"
      :collist="collist"
      @query="com_query_handle"
      @close="query_close_handle"
    ></com-query>
    <el-dialog title="重置密码" :visible.sync="dialogVisible">
      <el-form
        :model="pwd_form"
        ref="pwdform"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="密码">
          <el-input type="password" v-model="pwd_form.pwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="change_pwd_handle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  userlist,
  save_user_info,
  edit_user_info,
  reset_userpwd,
} from "@/api/user";
import { deepClone } from "@/utils/index";
import RoleFn from "@/api/role/index";
import ComQuery from "@/components/QueryBar/ComQuery";
import router from "@/router/index";
import store from "@/store/index";
export default {
  components: {
    ComQuery,
  },
  data() {
    return {
      list: [],
      dialog_userrole: false,
      dialog_user: false,
      dialog_user_edit: false,
      dialog_title: "",
      dialog_comquery: false,
      dialogVisible: false,
      rolelist: [],
      roleids: [],
      editfields: [],
      currowobj: {},
      collist: [
        { label: "姓名", value: "ta.name" },
        { label: "编号", value: "ta.code" },
      ],
      queryform: {
        name: "",
        code: "",
        queryexp: [],
      },
      user_form: {
        code: "",
        name: "",
        pwd: "",
        roleids: [],
        adduser: store.getters.userinfo.id,
      },
      user_form_edit: {
        roleids: [],
      },
      pwd_form: {
        id: 0,
        pwd: "",
      },
      rules: {
        code: [{ required: true, message: "请输入用户编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pwd: [{ required: true, message: "请设置密码", trigger: "blur" }],
        roleids: [
          {
            required: true,
            type: "array",
            message: "请设置角色",
            trigger: "change",
          },
        ],
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 20,
    };
  },
  mounted() {
    this.get_userlist();
    this.get_rolelist();
    this.editfields = router.currentRoute.meta.editfields;
  },
  methods: {
    get_userlist() {
      userlist({
        keyword: this.queryform.keyword,
        queryexp: this.queryform.queryexp,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      }).then((res) => {
        console.log(res);
        this.recordcount = res.resultcount;
        res.list.map((i) => {
          this.$set(i, "edit", false);
          let temp = [];
          i.roles.forEach((j) => {
            temp.push(j.id);
          });
          this.$set(i, "roleids", temp);
          i.originalname = i.name;
          return i;
        });
        this.list = res.list;
      });
    },
    queryhandle() {
      this.get_userlist();
    },
    user_role(row) {
      this.dialog_userrole = true;
    },
    user_edit(row) {
      let isedit = this.list.filter((i) => i.edit).length;
      if (isedit) {
        this.$message.error("行处于编辑状态,请完成行编辑");
      } else {
        this.currowobj = deepClone(row);
        row.edit = true;
      }
    },
    cancel_edit(row) {
      let pos = this.list.findIndex((t) => t.id == row.id);
      let rowdata = deepClone(this.currowobj);
      this.$set(rowdata);
      this.list.splice(pos, 1, rowdata);
    },
    submit_edit(row) {
      edit_user_info(row).then((res) => {
        this.$message(res.msg);
        if (res.code === 1) {
          row.roles = [];
          row.roleids.forEach((i) => {
            let temp = this.rolelist.filter((t) => t.id === i)[0];
            row.roles.push(temp);
          });
          row.edit = false;
        }
      });
    },
    change_pwd(row) {
      this.dialogVisible = true;
      this.pwd_form.id = row.id;
    },
    change_pwd_handle() {
      reset_userpwd(this.pwd_form).then((res) => {
        this.$message.success(res.msg);
        if (res.code === 1) {
          this.$refs.pwdform.resetFields();
          this.dialogVisible = false;
        }
      });
    },
    save_user() {
      this.$refs["user_form"].validate((v) => {
        if (v) {
          save_user_info(this.user_form).then((res) => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.$refs["user_form"].resetFields();
              this.dialog_user = false;
              this.get_userlist();
            }
          });
        } else {
          return false;
        }
      });
    },
    submit_user_edit() {
      this.$refs["user_form_edit"].validate((v) => {
        if (v) {
          edit_user_info(this.user_form_edit).then((res) => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.$refs["user_form_edit"].resetFields();
              this.dialog_user_edit = false;
              this.get_userlist();
            }
          });
        } else {
          return false;
        }
      });
    },
    get_rolesname(roles) {
      let rolenames = "";
      roles.forEach((i) => {
        rolenames += i.title + ",";
      });
      return rolenames;
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.get_userlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.get_userlist();
    },
    get_rolelist() {
      RoleFn.all_role_list().then((res) => {
        console.log(res);
        this.rolelist = res.list;
      });
    },
    show_user_dialog() {
      this.dialog_title = "新增用户";
      this.user_form.id = 0;
      this.dialog_user = true;
    },
    com_query_handle(data) {
      console.log(data);
      this.queryform.queryexp = data.list;
      this.get_userlist();
    },
    query_close_handle(data) {
      this.dialog_comquery = data;
    },
    handleSelect(selection, row) {

      this.$refs.table_user.toggleRowSelection(r,sel)
      conso.log(r);
      conso.log(sel);
    },
  },
};
</script>

<style lang="scss" scoped>
.query_bar {
  margin: 10px 5px;
}
.query_txt {
  width: 250px;
  margin-right: 10px;
}
</style>