<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table height="350px" :data="roles" style="width: 100%">
      <el-table-column type="expand" width="200">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="level1" v-for="(item1,i) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                @close="deleRights(scope.row,item1)"
                type="success"
                closable
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <el-row class="level2" v-for="(item2,i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    closable
                    type="warning"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20" class="level3">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
                    closable
                    type="info"
                    v-for="(item3,i) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            @click="showDiaSetRights(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      treelist: [],
      arrCheck: [],
      // arrExpand: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      dialogFormVisible: false
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 取消权限
    async deleRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        // this.getRoles();
        role.children = data;
      }
    },
    // 分配权限 - 打开对话框
    async showDiaSetRights(role) {
      const res = await this.$http.get(`rights/tree`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.treelist = data;
        // const temp = [];
        // this.treelist.forEach(item1 => {
        //   temp.push(item1.id);
        //   item1.children.forEach(item2 => {
        //     temp.push(item2.id);
        //     item2.children.forEach(item3 => {
        //       temp.push(item3.id);
        //     });
        //   });
        // });
        // this.arrExpand = temp

        const temp2 =[]
        role.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 => {
              temp2.push(item3.id)
            })
          })
        })
        this.arrCheck = temp2
      }

      this.dialogFormVisible = true;
    },
    async getRoles() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 10px;
}
.level1,
level2 {
  margin-bottom: 10px;
}
</style>
