<template>
    <div class="main">
      <h1>学术分享平台统计后台</h1>
  
      <!-- 统计数据概览 -->
      <div class="stat-container">
        <el-card
          v-for="item in stats"
          :key="item.key"
          shadow="hover"
          class="stat-card"
        >
          <div class="stat-header">
            <!-- 添加动态图标 -->
            <el-icon :size="28" class="stat-icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </div>
          <!-- 使用 NumberAnimation 显示数字 -->
          <NumberAnimation
            :from="item.oldValue"
            :to="item.value"
            :duration="3"
            class="stat-value"
            :format="(value) => value.toFixed(0)"
          />
          <div class="stat-footer">
            <span :class="item.trend === 'up' ? 'trend-up' : 'trend-down'">
              {{ item.change }}%
              <el-icon>
                <component
                  :is="item.trend === 'up' ? CaretTop : CaretBottom"
                />
              </el-icon>
            </span>
          </div>
        </el-card>
      </div>
  
      <!-- 平台响应时间仪表盘 -->
      <div class="chart-container">
        <responseChart />
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted,markRaw } from "vue";
  import { useIntervalFn } from "@vueuse/core";
  import { CaretTop, CaretBottom, UserFilled } from "@element-plus/icons-vue"; // 导入用户图标
  import { Edit, Notebook } from "@element-plus/icons-vue"; // 导入其他图标
  import NumberAnimation from "vue-number-animation";
  import responseChart from "./responseChart.vue";
  import {
    getPlatformArticles,
    getPlatformScholars,
    getPlatformUsers,
  } from "@/apis/platFormData";
  
  const stats = reactive([
    {
      title: "平台用户数量",
      key: "platformUsers",
      icon: markRaw(UserFilled), // 用户图标
      oldValue: 0,
      value: 0,
      change: null,
      trend: null,
    },
    {
      title: "平台学者数量",
      key: "platformScholars",
      icon: markRaw(Edit), // 学者图标
      oldValue: 0,
      value: 0,
      change: null,
      trend: null,
    },
    {
      title: "平台文章数量",
      key: "platformArticles",
      icon: markRaw(Notebook), // 文章图标
      oldValue: 0,
      value: 0,
      change: null,
      trend: null,
    },
  ]);
  
  // 更新统计数据
  const updateStats = async () => {
    let response = await getPlatformUsers();
    if (response.code == 200) {
      updateStat("platformUsers", response.data);
    }
  
    response = await getPlatformScholars();
    if (response.code == 200) {
      updateStat("platformScholars", response.data);
      console.log(response.data);
    }
    response = await getPlatformArticles();
    if (response.code == 200) {
      updateStat("platformArticles", response.data);
    }
  };
  
  const updateStat = (key, newData) => {
    const stat = stats.find((item) => item.key === key);
  
    if (!stat.oldValue) {
      stat.oldValue = newData;
      stat.value = newData;
      stat.change = 0;
      stat.trend = "up";
    } else {
      stat.oldValue = stat.value;
      stat.value = newData;
      stat.change = (
        ((stat.value - stat.oldValue) / stat.oldValue) *
        100
      ).toFixed(2);
      stat.trend = stat.value >= stat.oldValue ? "up" : "down";
    }
  };
  
  onMounted(updateStats);
  
  useIntervalFn(updateStats, 10000);
  </script>
  
  <style scoped>
  .main {
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2%;
  }
  
  .stat-container {
    display: flex;
    justify-content: space-between;
    gap: 2%;
  }
  
  .stat-card {
    background-color: #f5f7fa;
    padding: 2%;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
  }
  
  .stat-card:hover {
    background-color: #e8f0fe;
    border-color: #409eff;
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    color: var(--el-text-color-secondary);
    margin-bottom: 2%;
  }
  
  .stat-header .stat-icon {
    margin-right: 10px;
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    margin-bottom: 2%;
  }
  
  .stat-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  
  .stat-footer .trend-up {
    color: var(--el-color-success);
    display: flex;
    align-items: center;
  }
  
  .stat-footer .trend-down {
    color: var(--el-color-error);
    display: flex;
    align-items: center;
  }
  
  .chart-container {
    margin-top: 2%;
    width: 100%;
    height: 350px;
    display: flex;
    justify-content: center;
  }
  </style>
  