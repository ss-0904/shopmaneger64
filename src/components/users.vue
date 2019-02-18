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
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="searchInput"
          clearable
          @clear="getAllUsers()"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加 -->
        <el-button @click="showDiaAddUser()" type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table height="350px" :data="list" style="width: 100%">
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
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showMsgBoxDele(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 - 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 对话框 - 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option
              v-for="(item,i) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>

            <!-- 获取角色名数据  v-for遍历 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 表格数据
      list: [],
      // 对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 下拉框数据
      selectVal: -1,
      currUserId: -1,
      roles: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色 - 发送请求
    async setRole() {
      const res = await this.$http.put(
        `users/${this.currUserId}/role
`,
        { rid: this.selectVal }
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleRole = false;
      }
    },
    // 分配角色 - 打开对话框
    async showDiaSetRole(user) {
      this.currUserId = user.id;
      this.formdata = user;
      this.dialogFormVisibleRole = true;
      // 获取角色名称
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;
      // 给下拉框v-model绑定的selectVal赋值
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.selectVal = res2.data.data.rid;
    },
    // 修改状态
    async changeState(user) {
      // console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      // console.log(res);
    },
    // 编辑-发送请求
    async editUser() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      }
    },
    // 编辑-显示对话框
    showDiaEditUser(user) {
      // 获取当前用户的数据
      this.formdata = user;
      this.dialogFormVisibleEdit = true;
    },
    // 删除-显示确认框
    showMsgBoxDele(user) {
      // console.log(user)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.pagenum = 1;
            this.$message.success(msg);
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    // 添加-发送请求
    async addUser() {
      const res = await this.$http.post(`users`, this.formdata);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.getTableData();
      }
    },
    // 添加-打开对话框
    showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
      // 清空
      this.formdata = {};
    },
    // 搜索-清空时获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      console.log(msg);
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
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
