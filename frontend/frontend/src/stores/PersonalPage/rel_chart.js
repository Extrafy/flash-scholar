import * as echarts from 'echarts';
import { nextTick } from 'vue';
export async function initRelChart(graphData) {
    await nextTick();
    const chartDom = document.getElementById('rel_chart');
    if (!chartDom) {
        return;
    }
    const myChart = echarts.init(chartDom, null, {
        renderer: 'svg'
    });
    myChart.showLoading();

    const graph = arrangeNodesInCircle(graphData);
    console.log('Graph data loaded:', graph);
    myChart.hideLoading();

    graph.nodes.forEach(function (node) {
        node.label = {
            show: node.symbolSize > 10
        };
    });

    const option = {
        toolbox: {
            show: true,
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        title: {
            text: '专家关系网络',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        legend: [
            {
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        animationDuration: 1000,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {},
        series: [
            {
                name: '专家',
                type: 'graph',
                legendHoverLink: false,
                layout: 'none',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.20,
                    width: 3,
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 12
                    }
                }
            }
        ]
    };

    option && myChart.setOption(option);
    // 添加点击事件监听器
    myChart.on('click', function (params) {
        if (params.dataType === 'node') {
            // 处理节点点击事件
            handleNodeClick(params.data);
        } else if (params.dataType === 'edge') {
            // 处理边点击事件
            handleEdgeClick(params.data);
        }
    });
}

// 节点点击处理函数
function handleNodeClick(node) {
    console.log('Node clicked:', node);
    // 在这里添加跳转逻辑，例如：
    window.location.href = `/scholar/${node.authorId}`;
}

// 边点击处理函数
function handleEdgeClick(edge) {
    console.log('Edge clicked:', edge);
    // 在这里添加跳转逻辑，例如：
}

function arrangeNodesInCircle(graphData) {
    // 找到中心节点 (id=0)
    const centerNode = graphData.nodes.find(node => node.id === "0");
    if (!centerNode) {
        console.error("中心节点 (id=0) 不存在！");
        return;
    }

    // 中心节点的固定坐标
    const centerX = -250;
    const centerY = 350;

    // 半径基础值
    const baseRadius = [50,75,100];

    // 筛选非中心节点
    const otherNodes = graphData.nodes.filter(node => node.id !== "0");

    // 计算总节点数
    const totalNodes = otherNodes.length;

    // 均匀分布角度
    const angleStep = (2 * Math.PI) / totalNodes;

    // 遍历节点，计算每个节点的位置
    let i = 0;
    otherNodes.forEach((node, index) => {
        const angle = index * angleStep; // 当前节点的角度
        const radius = baseRadius[i++%3] + node.symbolSize; // 根据节点大小调整半径
        node.x = centerX + radius * Math.cos(angle); // 极坐标 x
        node.y = centerY + radius * Math.sin(angle); // 极坐标 y
        node.symbolSize = 25;
    });

    // 将中心节点的 x, y 固定为 (-250, 350)
    centerNode.x = centerX;
    centerNode.y = centerY;
    centerNode.symbolSize = 50;

    console.log("Updated graphData:", graphData);
    return graphData;
}
