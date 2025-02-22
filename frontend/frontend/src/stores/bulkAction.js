/**
 * 表单批量操作
 */

import { ref } from 'vue';

export function useBulkActions(changeStatus) {
    // 定义选中行的状态
    const selectedRows = ref([]);

    // 更新选中行
    const handleSelectionChange = (rows) => {
        selectedRows.value = rows;
    };

    // 批量通过操作
    const handleBulkApprove = async () => {
        for (const row of selectedRows.value) {
            await changeStatus(row, '通过');
        }
        // 清空选中项
        selectedRows.value = [];
    };

    // 批量拒绝操作
    const handleBulkReject = async () => {
        for (const row of selectedRows.value) {
            await changeStatus(row, '拒绝');
        }
        // 清空选中项
        selectedRows.value = [];
    };

    // 返回状态和操作方法
    return {
        selectedRows,
        handleSelectionChange,
        handleBulkApprove,
        handleBulkReject,
    };
}
