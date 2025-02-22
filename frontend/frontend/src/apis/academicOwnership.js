import { apiHandler } from "./apiHandler";
import axios from "axios";

const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30021', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});

/**
 * 获取学术成果列表
 * @param {Object} params 分页参数 { page: 当前页码, pageSize: 每页数量 }
 * @returns {Promise} 返回审核数据和总条目数
 */
export async function getAuditDataApi() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/claim/get/all",
            method: "get",
        })
    );
}

/**
 * 更新审核认领学术成果状态
 * @returns {Promise} 返回操作结果
 */
export async function changeAuditStatusApi(uid,documentId, status) {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/claim/exam",
            method: "post",
            data: {
                "uid": uid,
                "documentId":documentId ,
                "ans": status
            }, 
        })
    );
}


