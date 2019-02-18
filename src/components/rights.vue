<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            list:[]
        }
    },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      
      const res = await this.$http.get(`rights/list`);
      console.log(res);
      const {data,meta:{msg,status}} = res.data
      if (status === 200) {
          this.list = data
      }
      
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
