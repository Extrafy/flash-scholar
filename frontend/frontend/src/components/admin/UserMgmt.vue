<template>
    <div class="main">
        <h2>学者门户认领</h2>

        <!-- 操作栏 -->
        <div class="table-header">
            <el-button 
                type="success" 
                size="small" 
                @click="handleBulkApprove"
                :disabled="!selectedRows.length"
            >一键同意</el-button>
            <el-button 
                type="danger" 
                size="small" 
                @click="handleBulkReject"
                :disabled="!selectedRows.length"
            >一键拒绝</el-button>

            <!-- 搜索框 -->
            <el-input
                v-model="searchQuery"
                placeholder="搜索用户ID..."
                clearable
                class="search-input"
                @input="useSearch"
                :prefix-icon="'Search'" 
            >
            </el-input>
        </div>

        <!-- 表格 -->
        <el-table 
            :data="paginatedData" 
            border 
            @selection-change="handleSelectionChange"
            class="user-table">

            <el-table-column 
                type="selection" 
                :selectable="row => row.statusText === '待审核'" 
            ></el-table-column>

            <el-table-column label="用户ID">
                <template #default="{ row }">
                    <el-button 
                        type="text" 
                        @click="goToUserProfile(row.userId)" 
                        style="color: #3399FF;"
                    >
                        {{ row.userId }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="学者ID">
                <template #default="{ row }">
                    <el-button 
                        type="text" 
                        @click="goToScholarProfile(row.authorId)" 
                        style="color: #3399FF;"
                    >
                        {{ row.authorId }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column 
                v-for="column in tableConfig" 
                :key="column.prop" 
                :prop="column.prop" 
                :label="column.label"
                show-overflow-tooltip
            ></el-table-column>

            <!-- 状态列 -->
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.statusText)">{{ row.statusText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <!-- 审核提交材料按钮 -->
                    <el-button 
                        type="primary" 
                        size="small" 
                        :disabled="row.statusText !== '待审核'" 
                        @click="openMaterialDialog(row)"
                    >审核提交材料</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 审核材料弹窗 -->
        <el-dialog v-model="materialDialogVisible" width="50%">
            <div>
                <!-- 预留材料显示区域 -->
                <p>审核材料：</p>
                <div class="materials-content">
                    <p><strong>学者姓名：</strong>{{ currentMaterial?.name || '暂无信息' }}</p>
                    <p><strong>学术机构：</strong>{{ currentMaterial?.orName || '暂无信息' }}</p>
                    <p><strong>研究领域：</strong>{{ currentMaterial?.area || '暂无信息' }}</p>
                    <p><strong>申请时间：</strong>{{ currentMaterial?.applicationTime || '暂无信息' }}</p>
                    <p><strong>邮箱：</strong>{{ currentMaterial?.email || '暂无信息' }}</p>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <!-- 确认通过按钮 -->
                    <el-button type="success" @click="confirmAction('通过')">通过</el-button>
                    <!-- 确认拒绝按钮 -->
                    <el-button type="danger" @click="confirmAction('拒绝')">拒绝</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination 
                size="small"
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="filteredData.length" 
                background
                layout="prev, pager, next,jumper,total"
                @current-change="handlePageChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSearch } from '@/stores/search';
import { usePagination } from '@/stores/paginate';
import { useBulkActions } from '@/stores/bulkAction';
import {useMaterialDialog}from '@/stores/dialog';
import { getApplyInfoApi, applyExamApi } from '@/apis/scholarApplication.js';
import { useRouter } from 'vue-router';
const rawTable = ref([]);

const tableConfig = [
    // { prop: 'authorId', label: '学者ID' },
    { prop: 'applicationTime', label: '申请时间' },
];
// 搜索与过滤
const { searchQuery, filteredData } = useSearch(rawTable, tableConfig.map(item => item.prop));
// 分页
const { currentPage, pageSize, paginatedData, handlePageChange } = usePagination(filteredData);
// 引入弹窗控制逻辑
const { materialDialogVisible, currentMaterial,openMaterialDialog, confirmAction } = useMaterialDialog(applyExamApi);
// 获取状态对应的标签类型
const getStatusType = (statusText) => {
    if (statusText === '待审核') return 'warning';
    if (statusText === '已通过') return 'success';
    return 'danger';
};
const router = useRouter();

const goToUserProfile = (userId) => {
    // router.push(`/person/${userId}`)
    window.open(`/person/${userId}`, '_blank');
};

const goToScholarProfile = (authorId) => {
    // 针对学者ID跳转
    window.open(`/scholar/${authorId}`, '_blank');
};
/* 批量操作*/
const { selectedRows, handleSelectionChange, handleBulkApprove, handleBulkReject } = useBulkActions(async (row, action) => {
    const status = action === '通过' ? 1 : 2;

    const response = await applyExamApi(row.userId, status);
    if (response.code === 200) {
        row.status = action === '通过' ? 1 : 2;
        row.statusText = action === '通过' ? '已通过' : '已拒绝';
    }
});
// 获取申请记录
const fetchTableData = async () => {
    const response = await getApplyInfoApi();
    if(response){
        rawTable.value = response.data.map(item => ({
            ...item,
            statusText: item.status === 0 ? '待审核' : item.status === 1 ? '已通过' : '已拒绝',
        }));
    }   

};

onMounted(fetchTableData);
</script>

<style scoped>
.main {
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.user-table {
    border: 1px solid #dcdfe6; 
    border-radius: 5px;
}

.user-table ::v-deep(.el-table__header) th {
    background-color: #f5f5f5; /* 浅灰色背景 */
    color: #606266; /* 深灰色字体 */
    font-weight: bold; /* 表头字体加粗 */
    border-bottom: 2px solid #dcdfe6; /* 表头底部边框稍微加粗 */
}

.table-header {
    display: flex;
    align-items:center;
    margin-bottom: 2%;
}

.el-input {
    display: flex;  
    margin-left: auto;
    width: 25%;
}

.materials-content {
    min-height: 20%;
    border: 1px dashed #dcdfe6;
    padding: 2%;
 
    color: #909399;
}
.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 1%;
}
</style>
