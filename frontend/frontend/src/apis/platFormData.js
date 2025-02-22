import { apiHandler } from "./apiHandler";
import axios from "axios";

const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});
const httpInstance30021 = axios.create({
  baseURL: 'http://120.46.63.223:30021', // 用户微服务的URL和端口
  headers: {
      "Content-Type": "application/json;charset=UTF-8",
  },
  timeout: 20000, // 请求超时时间
});

export async function getTimeInfo() {
  return apiHandler(() =>
    httpInstance30021.request({
      url: "/api/time/info",
      method: "get",
    })
  );
}

/**
 * 获取平台用户数量
 * @returns {Promise} 返回平台用户数量数据
 */
export async function getPlatformUsers() {
    return apiHandler(() =>
      httpInstance.request({
        url: "/api/user/num",
        method: "get",
      })
    );
  }
  
  /**
   * 获取平台学者数量
   * @returns {Promise} 返回平台学者数量数据
   */
  export async function getPlatformScholars() {
    return apiHandler(() =>
      httpInstance.request({
        url: "/api/author/num",
      
        method: "get",
      })
    );
  }
  
  /**
   * 获取平台文章数量
   * @returns {Promise} 返回平台文章数量数据
   */
  export async function getPlatformArticles() {
    return apiHandler(() =>
      httpInstance.request({
        url: "/api/work/num",
        method: "get",
      })
    );
  }

  /**
   * 获取平台机构数量
   * @returns {Promise} 返回平台文章机构数据
   */
  export async function getPlatformInstitution() {
    return apiHandler(() =>
      httpInstance.request({
        url: "/api/institution/num",
        method: "get",
      })
    );
  }

  /**
   * 获取平台领域数量
   * @returns {Promise} 返回平台领域数据
   */
  export async function getPlatformConcept() {
    return apiHandler(() =>
      httpInstance.request({
        url: "/api/concept/num",
        method: "get",
      })
    );
  }