import { ElMessage } from "element-plus"; // 引入消息提示组件
/**
 * 通用接口处理函数，捕获异常并返回后端数据
 * @param {Function} apiFunc 接口请求函数
 * @param {Array} args 接口请求参数
 * @returns {Promise<any>} 成功时返回 data，失败时弹出消息提示
 */

export async function apiHandler(apiFunc) {
    try {
        const response = await apiFunc();
        if (response.data.code === 200) {
            return response.data; 
        } else {
            ElMessage.error(response.data.message || "操作失败"); // 弹出错误提示
        }
    } catch (error) {
        ElMessage.error(error?.response?.data?.message || "接口请求失败");
    }
}

