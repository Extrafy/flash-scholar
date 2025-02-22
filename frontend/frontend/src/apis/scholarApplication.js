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
 * 获取申请记录
 * @returns {Promise} 返回申请记录数据，包括用户ID、审核状态、记录时间
 */
export async function getApplyInfoApi() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/apply/info",
            method: "get",
        })
    );
}


/**
 * 审核申请记录
 * @param {Object} data 审核参数 { uid: 用户ID, ans: 审核结果 }
 * @returns {Promise} 返回接口响应结果
 */
export async function applyExamApi(uid,status) {

    return apiHandler(() =>
        httpInstance.request({
            url: "/api/apply/exam",
            method: "post",
            data: {
                userId:uid,
                ans:status
            }, // POST 请求体
        })
    );
}


