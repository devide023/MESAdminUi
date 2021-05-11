<template>
    <div>
        <div class="query_bar">
            <el-input v-model="queryform.keyword" placeholder="关键字" size="small" class="query_key"></el-input>
            <el-button type="success" size="small" icon="el-icon-search" @click="querydata()">查询</el-button>
            <slot name="other"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryform:{
                    keyword:''
                }
            }
        },
        methods: {
            querydata() {
                this.$emit('query',this.queryform)
            }
        },
    }
</script>

<style lang="scss" scoped>
.query_bar{
    margin: 10px 5px;
}
.query_key{
    width: 250px;
    margin-right: 10px;
}
</style>