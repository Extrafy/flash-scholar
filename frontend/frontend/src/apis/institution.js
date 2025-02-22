import axios from 'axios'

const instSvcHttpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});

