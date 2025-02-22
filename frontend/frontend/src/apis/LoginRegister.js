import axios from "axios";

const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000,
});


export  function userLoginApi(data){
    return  httpInstance.request({
        url: '/api/user/login',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } );
}
export  function adminLoginApi(data){
    return  httpInstance.request({
        url: '/api/admin/login',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } )
}

export async function registerApi(data){
    const rtn = await httpInstance.request({
        url: '/api/user/register',
        method: 'put',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     } );
     return rtn.data
}

export async function getCodeApi(data){
    const rtn = await httpInstance.request({
        url: `/api/email/send/${data}`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
     });
     return rtn.data
}