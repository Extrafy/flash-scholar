import { apiHandler } from "./apiHandler";
import axios from "axios";

const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, 
});

/**
 * 获取机构成果个数排行
 * @returns {Promise} 返回机构成果个数排行的操作结果
 */
export async function getWorksCountRank() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/institution/rank/worksCount",
            method: "post",
        })
    );
}

/**
 * 获取机构总引用量排行
 * @returns {Promise} 返回机构总引用量排行的操作结果
 */
export async function getCitedByCountRank() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/institution/rank/citedByCount",
            method: "post",
        })
    );
}

/**
 * 获取领域成果个数排行
 * @returns {Promise} 返回领域成果个数排行的操作结果
 */
export async function getConceptWorksCountRank() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/concept/rank/worksCount",  
            method: "post",
        })
    );
}

/**
 * 获取领域总引用量排行
 * @returns {Promise} 返回领域总引用量排行的操作结果
 */
export async function getConceptCitedByCountRank() {
    return apiHandler(() =>
        httpInstance.request({
            url: "/api/concept/rank/citedByCount",  
            method: "post",
        })
    );
}
