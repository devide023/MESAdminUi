<template>
    <div>
        <base-query @query="queryhandle"></base-query>
        <el-table :data="list">
          <el-table-column label="编号" prop="code"></el-table-column>
          <el-table-column label="名称" prop="title"></el-table-column>
          <el-table-column label="创建者" prop="adduser"></el-table-column>
          <el-table-column label="创建日期">
              <template slot-scope="scope">
                {{scope.row.addtime | format_date}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="50" fixed="right">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-setting" style="font-size: 16px"></i>
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
    </div>
</template>

<script>
import BaseQuery from '@/components/QueryBar/BaseQuery'
import RoleFn from '@/api/role/index'
    export default {
        components: {
          BaseQuery  
        },
        data() {
            return {
                list: [],
                queryform:{
                    keyword:''
                },
                recordcount: 0,
                pageindex: 1,
                pagesize: 20,
            }
        },
        mounted() {
           this.getlist();
        },
        methods: {
            getlist() {
                RoleFn.role_list({
                    keyword: this.queryform.keyword,
                    pageindex: this.pageindex,
                    pagesize: this.pagesize,
                }).then((result) => {
                    this.list = result.list
                    this.recordcount = result.resultcount
                }).catch((err) => {
                    this.$message(err)
                });
            },
            queryhandle(data){
                console.log(data)
                this.queryform.keyword = data.keyword
                this.getlist()
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>