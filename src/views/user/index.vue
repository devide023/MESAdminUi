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
      <el-button type="primary" @click="dialog_comquery=true">组合查询</el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="show_user_dialog"
        >新增</el-button
      >
    </div>
    <el-table :data="list" stripe :border="true" style="width: 100%"
    @cell-dblclick='cell_dbclick_handle'
    >
      <el-table-column prop="id" label="UID" width="100"> </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{
            scope.row.status === 1 ? "启用" : "禁用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编号" width="100"> </el-table-column>
      <el-table-column label="姓名" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.name" placeholder=""
            @blur="cell_blur_handle(scope.row)"
            ></el-input>
          </template>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          {{ get_rolesname(scope.row.roles) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="user_edit(scope.row)"
                >编辑</el-dropdown-item
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
    <com-query :isshow="dialog_comquery" 
    :collist="collist" 
    @query="com_query_handle"
    @close="query_close_handle"
    ></com-query>
  </div>
</template>

<script>
import { userlist, save_user_info, edit_user_info } from "@/api/user";
import RoleFn from "@/api/role/index";
import ComQuery from '@/components/QueryBar/ComQuery';
export default {
  components: {
    ComQuery
  },
  data() {
    return {
      list: [],
      dialog_userrole: false,
      dialog_user: false,
      dialog_user_edit: false,
      dialog_title: "",
      dialog_comquery:false,
      rolelist: [],
      collist:[
        {label:'姓名',value:'name'},
        {label:'编号',value:'code'},
      ],
      queryform: {
        name: "",
        code: "",
      },
      user_form: {
        code: "",
        name: "",
        pwd: "",
        roleids: [],
      },
      user_form_edit: {
        roleids: [],
      },
      user_role_form: {},
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
  },
  methods: {
    get_userlist() {
      userlist({
        keyword: this.queryform.keyword,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      }).then((res) => {
        console.log(res);
        this.recordcount = res.resultcount;
        res.list.map(i=>{
          this.$set(i, 'edit', false)
          i.originalname = i.name
          return i
        })
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
      console.log(row);
      this.dialog_title = "编辑用户";
      this.user_form_edit = row;
      let temproleids = [];
      row.roles.forEach((i) => temproleids.push(i.id));
      this.user_form_edit.roleids = temproleids;
      this.dialog_user_edit = true;
    },
    change_pwd(row) {
      console.log(row);
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
    cell_dbclick_handle(row, column, cell, event){
      row.edit = true
    },
    cell_blur_handle(row){
      row.edit = false
    },
    com_query_handle(data){
      console.log(data)
    },
    query_close_handle(data){
      this.dialog_comquery = data
    }
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