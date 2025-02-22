import axios from 'axios';

// 创建 axios 实例
const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011',
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000,
  });

export default httpInstance;