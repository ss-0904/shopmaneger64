<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <el-row class="searchBox">
      <el-col>
        <!-- 搜索 -->
        <el-input placeholder="请输入内容" v-model="query" class="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 添加 -->
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <!--
        id: (...)
        username: (...)
        email: (...)
        mobile: (...)
        create_time: (...)
        mg_state: (...)
        role_name: (...)
      -->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="list">{{ list.row.create_time | fmtdate }}</template>
      </el-table-column>
      <el-table-column prop="name" label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      // 表格数据
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // console.log(res)
      const {
        data,
        meta: { msg, status }
      } = res.data
      console.log(msg)
      if (status === 200) {
        this.list = data.users
        console.log(this.list)
      }
    }
  }
}
</script>

<style>
.box {
  height: 100%;
}
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 350px;
}
</style>
