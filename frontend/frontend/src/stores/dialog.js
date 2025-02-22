import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export const useMaterialDialog = (applyExamApi) => {
    const materialDialogVisible = ref(false); // 弹窗显示状态
    const currentRow = ref(null); // 当前操作的行数据
    const currentMaterial=ref(null)
    // 打开审核材料弹窗
    const openMaterialDialog = (row) => {
        currentRow.value = row;
        materialDialogVisible.value = true;
        currentMaterial.value = {
            applicationTime: row.applicationTime,
            area: row.area,
            email: row.email,
            name: row.name,
            orName: row.orName
        };
    };

    // 确认审核操作（通过或拒绝）
    const confirmAction = async (action) => {
        const status = action === '通过' ? 1 : 2; // 1 为通过，2 为拒绝
        
        await ElMessageBox.confirm(
            `确认要${action}该申请吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        const response = await applyExamApi(currentRow.value.userId, status);
        if (response.code === 200) {
            currentRow.value.status = status;
    
            currentRow.value.statusText = action === '通过' ? '已通过' : '已拒绝';
            materialDialogVisible.value = false; // 关闭弹窗
        } 
        
    };

    return {
        materialDialogVisible,
        currentMaterial,
        openMaterialDialog,
        confirmAction,
    };
};


