<template>
  <el-card class="box">
    <cus-bread class="bread" level1="数据统计" level2="数据报表"></cus-bread>
    <div id="main" style="width:600px;height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
// console.log(echarts);
export default {
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // console.log(111);
      // 指定图表的配置项和数据
      const myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      const res = await this.$http.get(`reports/type/1`)
      const option2 = res.data.data
      const option1 = {
        title: {
          text: "数据报表"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
       
      };
      const option = {...option1,...option2}
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      // console.log(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.bread{
  margin-bottom: 10px;
}
</style>
