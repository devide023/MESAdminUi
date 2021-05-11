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
      lazy
      :load="get_submenu"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="编码" prop="code"></el-table-column>
      <el-table-column label="名称" prop="title"></el-table-column>
      <el-table-column label="路由路径" prop="path"></el-table-column>
      <el-table-column label="试图路径" prop="viewpath"></el-table-column>
      <el-table-column label="图标" prop="icon"></el-table-column>
      <el-table-column label="操作员" prop="adduser"></el-table-column>
      <el-table-column label="操作日期">
        <template slot-scope="scope">
          {{ scope.row.addtime | format_date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit_menu(scope.row)"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item @click.native="add_sub_menu(scope.row)"
                >新增</el-dropdown-item
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

    <el-dialog :title="dialog_title" :visible.sync="dialog_add" top="10px">
        <el-form :model="menu_form"
            ref="menu_form"
            :rules="rules"
            label-width="80px"
            label-position="right"
            size="small">
          <el-form-item label="编码" prop="code">
              <el-input v-model="menu_form.code" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="title">
              <el-input v-model="menu_form.title" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="路由路径" prop="path">
              <el-input v-model="menu_form.path" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="menutype">
              <el-select v-model="menu_form.menutype" placeholder="" style="width:100%">
                <el-option v-for="(item,index) in menutypes" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="视图路径" prop="viewpath">
              <el-input v-model="menu_form.viewpath" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
              <el-select v-model="menu_form.icon" placeholder="" style="width:100%">
                <el-option v-for="(item,index) in elementIcons" :key="index" :value="item" :label="item">
                    <span style="float: left">{{ item }}</span>
                    <span style="float: right"><i :class="'el-icon-'+item"></i></span>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="权重">
              <el-input-number v-model="menu_form.seq" :min="10" :step="10" placeholder="" @change="handlechange"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_add = false">取消</el-button>
        <el-button type="primary" @click="save_menu">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import BaseQuery from "@/components/QueryBar/BaseQuery";
import MenuFn from "@/api/menu/index";
import elementIcons from '@/views/icons/element-icons';
import menutypes from './menutypes';
import store from '@/store/index';
export default {
  components: {
    BaseQuery,
  },
  data() {
    return {
      dialog_title: "",
      dialog_add: false,
      dialog_edit: false,
      list: [],
      elementIcons,
      menutypes,
      queryform: {
        keyword: "",
        pid: 0,
      },
      menu_form: {
          pid:0,
          code:'',
          title:'',
          icon:'',
          path:'',
          viewpath:'',
          menutype:'',
          seq:0,
          status:1,
          adduser:store.getters.userinfo.id
      },
      menu_form_edit: {},
      rules:{
          code:[{required: true, message: "请输入编码", trigger: "blur"}],
          title:[{required: true, message: "请输入名称", trigger: "blur"}],
          path:[{required: true, message: "请输入路由路径", trigger: "blur"}],
          viewpath:[{required: true, message: "请输入视图路径", trigger: "blur"}],
          icon:[{required: true, message: "请选择图标", trigger: "blur"}]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 20,
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      MenuFn.menu_sub({
        pid: this.queryform.pid,
        pageindex: this.pageindex,
        pagesize: this.pagesize,
      })
        .then((result) => {
          this.list = result.list;
          this.recordcount = result.resultcount;
        })
        .catch((err) => {});
    },
    queryhandle(data) {
      this.queryform.keyword = data.keyword;
    },
    edit_menu(row) {
      this.menu_form_edit = row;
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
        this.dialog_title='新增菜单'
        this.menu_form.pid = 0
        this.dialog_add = true
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    save_menu(){
       this.$refs['menu_form'].validate(v=>{
           if(v){
               MenuFn.add_menu(this.menu_form).then(res=>{
                   this.$message.info(res.msg)
                   if(res.code ===1)
                   {
                       this.getlist()
                   }
                   
               })
           }
           else{
               return false
           }
       }) 
    },
    handlechange(val){
        this.menu_form.seq = val
    },
    add_sub_menu(row){
        this.menu_form.pid = row.id
        this.dialog_title = '新增' + row.title + '子菜单'
        this.dialog_add = true
    }
  },
};
</script>

<style lang="scss" scoped>
</style>