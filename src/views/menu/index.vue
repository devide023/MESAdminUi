<template>
  <div>
    <base-query @query="queryhandle">
      <template #other>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="add_menu_handle"
          >新增</el-button
        >
      </template>
    </base-query>
    <el-table
      :data="list"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagtype">{{
            scope.row.status | statusname
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编码" prop="code" />
      <el-table-column label="名称" prop="title" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.menutype | typecolor">{{
            scope.row.menutype | typename
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路由路径" prop="path" />
      <el-table-column label="视图路径" prop="viewpath" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column label="操作员" prop="addusername" />
      <el-table-column label="操作日期">
        <template slot-scope="scope">
          {{ scope.row.addtime | format_date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit_menu(scope.row)"
                ><span class="el-icon-edit">编辑</span></el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.menutype === '01'"
                @click.native="add_sub_menu(scope.row)"
                ><span class="el-icon-circle-plus-outline"
                  >子菜单</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.menutype === '02'"
                @click.native="add_sub_menu(scope.row)"
                ><span class="el-icon-plus">功能字段</span></el-dropdown-item
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
      layout="total, sizes, prev, pager, next"
      background
      style="text-align: right"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!--添加菜单表单-->
    <el-dialog
      :title="dialog_title"
      :visible.sync="dialog_add"
      top="10px"
      @open="dialog_open_handle"
    >
      <el-form
        ref="menu_form"
        :model="menu_form"
        :rules="rules"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="menu_form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="menu_form.title" placeholder="" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menu_form.path" placeholder="" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menutype">
          <el-select
            v-model="menu_form.menutype"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in menutypes"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视图路径" prop="viewpath">
          <el-input v-model="menu_form.viewpath" placeholder="" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="menu_form.icon"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in elementIcons"
              :key="index"
              :value="item"
              :label="item"
            >
              <span style="float: left">{{ item }}</span>
              <span style="float: right"><svg-icon :icon-class="item" /></span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number
            v-model="menu_form.seq"
            :min="10"
            :step="10"
            placeholder=""
            @change="handlechange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_add = false">取消</el-button>
        <el-button type="primary" @click="save_menu">确定</el-button>
      </div>
    </el-dialog>
    <!--添加页面功能、数据功能-->
    <el-dialog :title="dialog_title" :visible.sync="dialog_fun_add" top="10px">
      <el-form
        ref="form_funs"
        :rules="rules"
        :model="menu_form"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="功能名称">
          <el-select
            v-model="menu_form.funs"
            multiple
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in funcodes"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(i, index) in menu_form.fields"
          :key="index"
          :label="'字段' + (index + 1)"
        >
          <el-input
            :key="(index + 2) * 100"
            v-model="i.name"
            placeholder="名称"
            style="width: 45%"
          />
          <el-input
            :key="(index + 1) * (index + 2)"
            v-model="i.code"
            placeholder="值"
            style="width: 45%"
          />
          <div style="width: 5%; float: right">
            <el-button v-if="index == 0" type="text" @click="add_field_handle"
              >增加</el-button
            >
            <el-button v-else type="text" @click="remove_field_handle(index)"
              >移除</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialog_fun_add = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save_fun_fields">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑菜单对话框-->
    <el-dialog :title="dialog_title" :visible.sync="dialog_edit" top="10px">
      <el-form
        ref="edit_roleform"
        :model="menu_form_edit"
        :rules="rules"
        label-position="right"
        label-width="80px"
        size="small"
      >
      <el-form-item label="编码" prop="code">
          <el-input v-model="menu_form_edit.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="menu_form_edit.title"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="menutype">
          <el-select :disabled="menu_form_edit.menutype|is_disable"  v-model="menu_form_edit.menutype" style="width:100%">
            <el-option
              v-for="(item,index) in menutypes"
              :key="index"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="menu_form_edit.menutype ==='01' || menu_form_edit.menutype ==='02'">
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menu_form_edit.path" placeholder="" />
        </el-form-item>
        <el-form-item label="视图路径">
          <el-input v-model="menu_form_edit.viewpath" placeholder="" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="menu_form_edit.icon"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in elementIcons"
              :key="index"
              :value="item"
              :label="item"
            >
              <span style="float: left">{{ item }}</span>
              <span style="float: right"><svg-icon :icon-class="item" /></span>
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <el-form-item label="状态">
          <el-select v-model="menu_form_edit.status" style="width:100%">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number v-model="menu_form_edit.seq" @change="inputChange" :min="10" :step="10" ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialog_edit = false">取消</el-button>
        <el-button type="primary" @click="submit_menu_form_edit"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseQuery from "@/components/QueryBar/BaseQuery";
import MenuFn from "@/api/menu/index";
import elementIcons from "@/views/icons/element-icons";
import { menutypes, funcodes } from "./menutypes";
import store from "@/store/index";
import {deepClone} from '@/utils/index';
export default {
  components: {
    BaseQuery,
  },
  filters: {
    is_disable(val) {
      if(val==='01' || val === '02') {
        return false
      }
      else{
       return true
      }
    },
    typename(typecode) {
      let item = menutypes.filter((i) => i.code === typecode);
      if (item) {
        return item[0].name;
      } else {
        return "";
      }
    },
    typecolor(typecode) {
      let color = "primary";
      switch (typecode) {
        case "01":
          color = "primary";
          break;
        case "02":
          color = "warning";
          break;
        case "03":
          color = "info";
          break;
        case "04":
          color = "danger";
          break;
        default:
          break;
      }
      return color;
    },
  },
  data() {
    return {
      dialog_title: "",
      dialog_add: false,
      dialog_edit: false,
      dialog_fun_add: false,
      list: [],
      elementIcons,
      menutypes,
      funcodes: funcodes,
      current_menuid: 0,
      queryform: {
        keyword: "",
        pid: 0,
      },
      menu_form: {
        pid: 0,
        code: "",
        title: "",
        icon: "",
        path: "",
        viewpath: "",
        menutype: "",
        seq: 0,
        status: 1,
        adduser: store.getters.userinfo.id,
        funs: [],
        fields: [],
      },
      menu_form_edit: {},
      rules: {
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
        viewpath: [
          { required: true, message: "请输入视图路径", trigger: "blur" },
        ],
        menutype: [
          {
            required: true,
            message: "请选择类型",
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
    this.getlist();
    this.menu_form.fields.push({
      name: "",
      code: "",
    });
  },
  methods: {
    getlist() {
      MenuFn.menu_tree({
        pid: this.queryform.pid,
        keyword: this.queryform.keyword,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      }).then((result) => {
        this.list = result.list;
        this.recordcount = result.resultcount;
      });
    },
    queryhandle(data) {
      this.queryform.keyword = data.keyword;
      this.getlist();
    },
    edit_menu(row) {
      this.menu_form_edit = deepClone(row);
      this.menu_form_edit.updateuser = store.getters.userinfo.id

      this.dialog_title = "菜单编辑";
      this.dialog_edit = true;
    },
    get_submenu(row, treeNode, resolve) {
      console.log(row);
      MenuFn.menu_sub({
        pid: row.id,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      }).then((result) => {
        resolve(result.list);
      });
      resolve(row.children);
    },
    add_menu_handle() {
      this.dialog_title = "新增菜单";
      this.menu_form.pid = 0;
      this.current_menuid = 0;
      this.dialog_add = true;
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    save_menu() {
      this.$refs["menu_form"].validate((v) => {
        if (v) {
          MenuFn.add_menu(this.menu_form).then((res) => {
            this.$message.success(res.msg);
            if (res.code === 1) {
              this.dialog_add = false;
              this.getlist();
            }
          });
        } else {
          return false;
        }
      });
    },
    handlechange(val) {
      this.menu_form.seq = val;
    },
    inputChange(val){
      this.menu_form_edit.seq = val;
    },
    add_sub_menu(row) {
      this.current_menuid = row.id;
      this.menu_form.pid = row.id;
      if (row.menutype === "02") {
        this.dialog_title = "定义页面功能、字段";
        this.dialog_fun_add = true;
      }
      if (row.menutype === "01") {
        this.dialog_title = "新增" + row.title + "子菜单";
        this.dialog_add = true;
      }
    },
    dialog_open_handle() {
      MenuFn.get_menucode({
        id: this.current_menuid,
      }).then((res) => {
        this.menu_form.code = res.menucode;
      });
    },
    save_fun_fields() {
      this.$refs["form_funs"].validate((v) => {
        if (v) {
          let funobj = [];
          this.menu_form.funs.forEach((i) => {
            this.funcodes
              .filter((j) => {
                return j.code === i;
              })
              .forEach((item) => {
                funobj.push(item);
              });
          });
          MenuFn.add_menu_funs({
            funs: funobj,
            fields: this.menu_form.fields,
            pid: this.menu_form.pid,
            adduser: this.menu_form.adduser,
          }).then((res) => {
            this.$message.success(res.msg);
            if (res.code === 1) {
              this.dialog_fun_add = false;
              this.menu_form.funs = [];
              this.menu_form.fields = [];
              this.menu_form.fields.push({
                name: "",
                code: "",
              });
              this.getlist();
            }
          });
        }
      });
    },
    add_field_handle() {
      this.menu_form.fields.push({
        name: "",
        code: "",
      });
    },
    remove_field_handle(index) {
      this.menu_form.fields.splice(index, 1);
    },
    submit_menu_form_edit() {
      this.$refs['edit_roleform'].validate(v=>{
        if(v){
          MenuFn.edit_menu(this.menu_form_edit).then(res=>{
            this.$message.success(res.msg)
            if(res.code === 1){
              this.dialog_edit = false
              this.getlist()
            }
          })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>