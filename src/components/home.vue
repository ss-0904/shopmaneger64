<template>
  <el-container class="container">
    <el-header>Header</el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main" >Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
  .container {
      height: 100%;
      background-color: pink;
  }
  .aside {
      background-color: blue;
  }
  .main {
      background-color: yellow;
  }
</style>
