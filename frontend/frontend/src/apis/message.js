import axios from 'axios'
import { apiHandler } from "./apiHandler";

const usrSvcHttpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});


export async function getMessage(userId) {

    return apiHandler(() => usrSvcHttpInstance.request({
        url: `/api/msg/uid/${userId}`,
        method: "get",
        })
    );
}

export async function deleteMessage(id) {

    return apiHandler(() => usrSvcHttpInstance.request({
        url: `/api/msg/del/id/${id}`,
        method: "delete",
        })
    );
}

// export async function deleteAllMessages(uid, type){
//     const requestBody = {
//         uid: uid,
//         type: type,
//     };
//     console.log(requestBody);
//     return apiHandler(()=>usrSvcHttpInstance.request({
//         url: `/api/msg/del/all`,
//         method: "delete",
//         data: requestBody
//     }));
// }

export async function deleteAllMessages(uid, type) {
    const url = `/api/msg/del/all?uid=${uid}&type=${type}`;
    return apiHandler(() => usrSvcHttpInstance.request({
        url: url,
        method: "delete"
    }));
}