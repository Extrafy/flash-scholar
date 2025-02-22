import axios from 'axios';
import { apiHandler } from "@/apis/apiHandler.js";
import {ElMessage} from "element-plus";

const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30014',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000,
});

export async function getCollectionFolders(userId) {
    return apiHandler(() => httpInstance.request({
        url: `/api/favourites/get/${userId}`,
        method: "get",
    })
    );
}

export async function deleteCollectionFolder(userId,folderId) {
    return apiHandler(() => httpInstance.request({
            url: `/api/favourite/delete?uid=${userId}&fid=${folderId}`,
            method: "delete",
        })
    );
}

export async function getFolderContents(fid) {
    return apiHandler(() => httpInstance.request({
        url: `/api/collections/get/${fid}`,
        method: "get",
    })
    );
}

// 把文章放进收藏夹
export async function addCollection(userId, achievementId, fids, title, authors, journal, quoteTime, date) {
    try {
        const requestBody = {
            "uid": userId,
            "achievementId": achievementId,
            "fid": fids, // 收藏夹id数组
            "title": title,
            "authors": authors,
            "journal": journal,
            "quoteTime": quoteTime,
            "date": date
        };

        const response = await axios.post(
            `http://120.46.63.223:30014/api/collections/add`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('放进收藏夹失败', error);
        return null;
    }
}

// 新建一个收藏夹
export async function createCollectionFolder(userId, description, fname) {
    try {
        const requestBody = {
            "uid": userId,
            "description": description,
            "fname": fname
        };

        const response = await axios.post(
            `http://120.46.63.223:30014/api/favourite/add`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('新建收藏夹失败', error);
        return null;
    }
}

export async function deleteCollection(userId, achievementId, fid) {
    try {
        const response = await axios.delete(
            `http://120.46.63.223:30014/api/collections/delete?uid=${userId}&achievementId=${achievementId}&fid=${fid}`,
        );
        ElMessage.success("删除成功!");
        return response;
    } catch (error) {
        console.log('删除收藏夹失败', error);``
        return null;
    }
}

export async function getCollectionCount(achievementId) {
    try {
        const response = await axios.get(
            `http://120.46.63.223:30014/api/collections/getCount/${achievementId}`,
        );
        return response.data.data;
    } catch (error) {
        console.log('获得文章收藏数量失败', error);
        return null;
    }
}
