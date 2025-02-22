import axios from "axios";


const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30021', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});

export async function applyForScholar(data){
    const rtn = await httpInstance.request({
        url: '/api/apply/add',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } );
     return rtn.data
}
export async function claimPassages(data){
    const rtn = await httpInstance.request({
        url: '/claim/add',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } );
     return rtn.data
}

export async function getScholars(data){
    const rtn = await httpInstance.request({
        url: '/claim/add',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } );
     return rtn.data
}