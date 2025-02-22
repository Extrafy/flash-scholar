<template>
    <div class="main">
        <h2>文献认领审核</h2>

        <!-- 操作按钮和搜索框 -->
        <div class="table-header">
            <!-- 一键操作按钮 -->
            <el-button 
                type="success" 
                size="small" 
                @click="handleBulkApprove"
                :disabled="!selectedRows.length"
            >
                一键通过
            </el-button>
            <el-button 
                type="danger" 
                size="small" 
                @click="handleBulkReject"
                :disabled="!selectedRows.length"
            >
                一键拒绝
            </el-button>

            <!-- 搜索框 -->
            <el-input
                v-model="searchQuery"
                placeholder="搜索表格..."
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
            class="custom-table"
        >
            <!-- 多选列 -->
            <el-table-column
                type="selection"
                :selectable="row => row.status === '未审核'"
            ></el-table-column>

            <!-- 动态列 -->
            <el-table-column
                v-for="column in meterConfig"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :sortable=true
                show-overflow-tooltip
            ></el-table-column>
            <!-- 状态列 -->
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.statusText)">{{ row.statusText }}</el-tag>
                </template>
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
                <template #default="{ row }">
                    <!-- 审核提交材料按钮 -->
                    <el-button 
                        type="primary" 
                        size="small" 
                        @click="openMaterialDialog(row)"
                    >审核学术成果</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 审核材料弹窗 -->
        <el-dialog v-model="materialDialogVisible" width="50%">
            <div>
                <p>审核材料：</p>
                <div class="materials-content">
                    暂无具体材料内容。
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="success" @click="confirmAction('通过')">通过</el-button>
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
                :pager-count="5"
                background
                layout="prev, pager, next, jumper, total"
                @current-change="handlePageChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuditDataApi, changeAuditStatusApi } from '@/apis/academicOwnership';
import { usePagination } from '@/stores/paginate';
import { useSearch } from '@/stores/search';
import { useBulkActions } from '@/stores/bulkAction';
import {useMaterialDialog}from '@/stores/dialog';

// 数据源
const rawTable = ref([
    { id: 1, title: '学术成果1', author: '作者1', status: '未审核' },
    { id: 2, title: '学术成果2', author: '作者2', status: '未审核' },
    { id: 3, title: '学术成果3', author: '作者3', status: '未审核' },
    { id: 4, title: '学术成果4', author: '作者4', status: '通过' },
    { id: 5, title: '学术成果5', author: '作者5', status: '拒绝' },
    { id: 6, title: '学术成果6', author: '作者6', status: '未审核' },
    { id: 7, title: '学术成果7', author: '作者7', status: '通过' },
]);
// 表头列配置
const meterConfig = [
    { prop: 'uid', label: 'ID' },
    { prop: 'title', label: '标题' },
    { prop: 'author', label: '作者' },
];
// 搜索功能
const { searchQuery, filteredData } = useSearch(rawTable, meterConfig.map(item => item.prop));
// 引入弹窗控制逻辑
const { materialDialogVisible, openMaterialDialog, confirmAction } = useMaterialDialog();
// 分页功能
const { currentPage, pageSize, paginatedData, handlePageChange } = usePagination(filteredData);

// // 修改审核状态
// const changeStatus = async (row, status) => {
//     const response = await changeAuditStatusApi(row.id, status);
// };
/*批量处理表格行*/
const { selectedRows, handleSelectionChange, handleBulkApprove, handleBulkReject } =useBulkActions(async (row, action) => {
    const status = action === '通过' ? 1 : 2;
    const response = await changeAuditStatusApi(row.uid,row.document_id,status);
    if (response.code === 200) {
        row.status = ans === 1 ? 1 : 2;
        row.statusText = ans === 1 ? '已通过' : '已拒绝';
    }
});
// 获取状态对应的标签类型
const getStatusType = (statusText) => {
    if (statusText === '待审核') return 'warning';
    if (statusText === '通过') return 'success';
    return 'danger';
};

const fetchTableData = async () => {
    const response = await getAuditDataApi();
    if(response){
        rawTable.value = response.data.map(item => ({
            ...item,
            statusText: item.status === 0 ? '待审核' : item.status === 1 ? '已通过' : '已拒绝',
        }));
    } 
    console.log(response);  
};
onMounted(fetchTableData);
</script>

<style scoped>

.custom-table {
    border: 1px solid #dcdfe6; 
    border-radius: 5px;
}
.custom-table ::v-deep(.el-table__header) th {
    background-color: #f5f5f5; /* 浅灰色背景 */
    color: #606266; /* 深灰色字体 */
    font-weight: bold; /* 表头字体加粗 */
    border-bottom: 2px solid #dcdfe6; /* 表头底部边框稍微加粗 */
}


.main {
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.table-header {
    display: flex;
    align-items:center;
    margin-bottom: 2%;
}
.el-input {
    margin-left:60%;
    width: 25%;
}
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 1%;
}
</style>
