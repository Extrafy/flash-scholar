<template>
    <div class="chart-container">
        <!-- 仪表盘 -->
        <div id="response-time-gauge" class="chart"></div>
        <!-- 折线图 -->
        <div id="response-time-line" class="line-chart"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTimeInfo } from "@/apis/platFormData";
import * as echarts from 'echarts';

const avgResponseTime = ref(null); // 一天的平均响应时间
const timePeriods = ["00:00-04:00", "04:00-08:00", "08:00-12:00", "12:00-16:00", "16:00-20:00", "20:00-24:00"]; // 六个时间段
const responseTimes = ref([]); // 每个时间段的平均响应时间

const maxValue = ref(250);
const minValue = ref(0);

// 渲染仪表盘
const renderGauge = () => {
    const chart = echarts.init(document.getElementById("response-time-gauge"));

    const options = {
        title: {
            text: "查询平均响应时间",
            left: "center",
        },
        tooltip: {
            formatter: "{a} <br/>{b}: {c} ms",
        },
        series: [
            {
                name: "响应时间",
                type: "gauge",
                min: minValue.value,
                max: maxValue.value,
                detail: {
                    formatter: "{value} ms",
                    fontSize: 15,
                },
                data: [{ value: avgResponseTime.value, name: "平均响应时间" }],
                axisLine: {
                    lineStyle: {
                        color: [
                            [0.3, "#91cc75"],
                            [0.7, "#fac858"],
                            [1, "#ee6666"],
                        ],
                        width: 10,
                    },
                },
                pointer: {
                    width: 5,
                },
                splitLine: {
                    length: 10,
                },
            },
        ],
    };

    chart.setOption(options);
};

// 渲染折线图
const renderLineChart = () => {
    const chart = echarts.init(document.getElementById("response-time-line"));

    const options = {
        title: {
            text: "查询响应时间分布",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
            formatter: "{b}<br />响应时间: {c} ms",
        },
        xAxis: {
            type: "category",
            data: timePeriods,
            axisLabel: {
                interval: 0, // 显示所有 x 轴标签
                rotate: 45, // x 轴标签倾斜 45 度，避免重叠
            },
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: "{value} ms",
            },
        },
        series: [
            {
                name: "响应时间",
                type: "line",
                smooth: true,
                data: responseTimes.value,
                lineStyle: {
                    color: "#5470c6",
                },
                itemStyle: {
                    color: "#5470c6",
                },
            },
        ],
    };

    chart.setOption(options);
};

const fetchDataAndRenderCharts = async () => {
    try {
        const response = await getTimeInfo();
        const list = response.data;
        if (list && list.length >= 7) {
            avgResponseTime.value = Number(list[0]?.toFixed(2));
            if (avgResponseTime.value > maxValue.value) {
                maxValue.value = Number(avgResponseTime.value + 60).toFixed(0);
            }
            responseTimes.value = list.slice(1, 7).map(item => Number(item.toFixed(2)) || 0);
            renderGauge();
            renderLineChart();
        } else {
            console.error("数据格式错误，无法渲染图表");
        }
    } catch (error) {
        console.error("获取数据失败", error);
    }
};

// 页面加载时渲染图表
onMounted(() => {
    fetchDataAndRenderCharts();
});
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    gap: 20px; /* 图表之间的间隙 */
}

.chart {
    width: 50%;
    height: 100%; /* 设置一个较小的固定高度 */
}

.line-chart {
    width: 80%; /* 增大折线图的宽度 */
    height: 100%; /* 设置折线图较大的高度 */
}
</style>
