import { nextTick } from 'vue';
import * as echarts from 'echarts';

export async function initBarChart(dataX,dataY) {
    await nextTick();
    const chartDom = document.getElementById('bar_chart');
    if (!chartDom) {
        return;
    }

    const myChart = echarts.init(chartDom);
    myChart.showLoading();
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: dataX,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '引用量',
                type: 'bar',
                barWidth: '60%',
                data: dataY
            }
        ]
    };

    myChart.hideLoading();
    option && myChart.setOption(option);
}