<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>

    <!-- 步骤条 el-steps -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 标签页 
        1.默认active初始值和name的值 都是"1"
        2.点击第5个tab -> 被选中的tab的name值赋值给v-model的值,此时active="5"
    -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素  级联选择器
                options:数据源
                selectedOptions:[]
            -->
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 
                1.action : 服务器目录路径(全路径网址)
                2.headers{} 请求头
                3.:on-success fn
                4.:on-remove fn
          -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="obj"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>
            <quill-editor class="quill" v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      // 添加商品的表单元素
    //   goods_cat 以","分割的分类列表  不能为空 [1,2,3] -> "1,2,3"
    //   pics 上传的图片临时路径(对象) 可以为空 -> pics:[{pic:临时路径}]
    //   attrs 商品的参数(数组) 可以为空
    // -> [{attr_id:?,attr_value:?}] -> 来源arrDy 和 arrStatic 中每个对象的 attr_id 和 attr_vals
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: "",
        attrs: ""
      },
      // 级联使用的数据
      options: [],
      selectedOptions: [1,3,6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //   动态参数数组
      arrDy: [],
      //   静态参数数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //   添加商品
    async addGoods() {
        // 1.处理goods_cat
        this.form.goods_cat = this.selectedOptions.join(",")
        // 2.this.form.pics --> 在图片上传方法中splice和push
        // 3.attrs -> [{attr_id:?,attr_value:?}]
        // 动态参数数组
        // 遍历 -> 返回数组 -> return {}
        const arr1 = this.arrDy.map((item)=>{
            return {attr_id:item.attr_id,attr_value:item.attr_vals}
        })
        // 静态
        const arr2 = this.arrStatic.map((item)=>{
            return {attr_id:item.attr_id,attr_value:item.attr_vals}
        })
        this.form.attrs = [...arr1,...arr2]
        
        const res = await this.$http.post(`goods`,this.form)
        const {
            data,
            meta: { msg, status }
          } = res.data;
          if (status === 201) {
            //   提示
            this.$message.success(msg)
            //   会到列表
            this.$router.push({
                name:'goods'
            })
          }
    },
    // 图片上传方法
    handleRemove(file, fileList) {
      //   移除临时路径 file.response.data.tmp_path
    //   file.response.data.tmp_path;
    // findIndex(ES6数组新增API)
    const Index = this.form.pics.findIndex(item=>{
        return item.pic === file.response.data.tmp_path
    })
    },
    handleSuccess(response, file, fileList) {
      //   临时路径 response.data.tmp_path
      this.form.pics.push({
          pic:response.data.tmp_path
      })
    },
    //   点击任何tab都会触发
    async changeTab() {
      //   如果点击了第2个tab
      if (this.active === "2" || this.active === "3") {
        //   如果不是三级分类
        if (this.selectedOptions.length !== 3) {
          //   提示
          this.$message.error("请选择三级分类");
          if(this.active==="2"){
              this.arrDy=[]
          }else{
              this.arrStatic=[]
          }
          return;
        }
        // 获取静态参数
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.arrStatic = data;
          }
        }
        //   获取动态参数数据
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const {
            data,
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.arrDy = data;
            //   如果返回 ""
            this.arrDy.forEach(item => {
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
              // if(item.attr_vals.length===0){
              //     item.attr_vals=[]
              // }else{
              //     item.attr_vals = item.attr_vals.trim().split(",")
              // }
            });
          }
        }
      }
    },
    // 获取三级商品分类的数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 350px;
  overflow: auto;
}
.ql-editor ,.ql-blank {
    min-height: 200px;
}
</style>
