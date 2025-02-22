import axios from 'axios'
import { apiHandler } from "./apiHandler";

const usrSvcHttpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30011', // 用户微服务的URL和端口
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000, // 请求超时时间
});

/**
 * 获取选中的用户详情
 * @param {number} userId 用户 ID
 * @returns {Promise} 返回用户详情
 */

export async function userDetailsApi(userId) {

    return apiHandler(() => usrSvcHttpInstance.request({
        url: `/api/user/uid/${userId}`,
        method: "get",
        })
    );
}

export async function changeProfileApi(uid, nickname, password){
    const requestBody = {
        uid: uid,
        nickname: nickname,
        password: password,
    };
    return apiHandler(()=>usrSvcHttpInstance.request({
        url: `/api/user/update/uid`,
        method: "post",
        data: requestBody
    }));
}
export async function changePwdApi(uid, pwd, chkpwd){
    return apiHandler(()=>usrSvcHttpInstance.request({
        url: `/api/user/password/uid/${uid}?password=${pwd}&confirmedPassword=${chkpwd}`,
        method: "post",
    }));
}

export async function followersApi(uid) {
    return apiHandler(() =>usrSvcHttpInstance.request({
            url: `/api/follow/followers?id=${uid}`,
            method: "get",
        })
    );
}

/**
 * 获取用户列表
 * @param {Object} params 分页参数，参数无
 * @returns {Promise} 返回用户列表和总数
 */
export async function usersApi() {
    return apiHandler(() =>usrSvcHttpInstance.request({
            url: "/api/user/all",
            method: "get",
        })
    );
}

/**
 * 更新用户成为学者的请求（同意或拒绝申请）
 * @param {number} uid 用户 UID
 * @param {string} status 新状态 ('通过' 或 '拒绝')
 * @returns {Promise} 返回操作结果
 */
export async function changeUserStatusApi(uid, status) {
    return apiHandler(() =>usrSvcHttpInstance.request({
            url: `/api/admin/role/uid/${uid}`,
            method: "post",
            data: { status }, // 通过 status 指定状态
        })
    );
}

export async function getAuthorInfo(json){
    const url = 'http://120.46.63.223:9200/authors/_search';

    const requestBody = {
        query: {
            bool: json
        },
        size: 1
    };

    // const requestBody = {
    //     query: {
    //         bool: {
    //             must: json
    //         }
    //     }
    // };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function checkFollowRel(id1,id2){
    return apiHandler(() => usrSvcHttpInstance.request({
            url: `/api/follow/is-followed?id_from=${id1}&id_to=${id2}`,
            method: "get",
        })
    );
}

export async function getUserInfoByAuthorId(authorId){
    return apiHandler(() => usrSvcHttpInstance.request({
            url: `/api/user/authorId/${authorId}`,
            method: "get",
        })
    );
}

export async function randomScholars(num){
    return apiHandler(() => usrSvcHttpInstance.request({
            url: `/api/author/random/${num}`,
            method: "post",
        })
    );
}

export async function followHandler(id1,id2,authorName,inst){
    return apiHandler(() => usrSvcHttpInstance.request({
            url: `/api/follow/addOrCancel?id_from=${id1}&id_to=${id2}&author_name=${authorName}&author_inst=${inst}`,
            method: "post",
        })
    );
}

export async function getHistory(uid) {
    try {
        const requestBody = {
            uid: uid,
        };
        const response = await axios.post(
            `http://120.46.63.223:30021/api/history/get`,
            requestBody
        );
        return response.data;
    } catch (error) {
        console.log('获取历史记录失败', error);
        return null;
    }
}