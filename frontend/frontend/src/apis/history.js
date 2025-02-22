import axios from 'axios';

// 添加历史记录
export async function addHistory(uid, achievementId, title, publisher, quoteTime, publishTime, authors) {
    try {
        const requestBody = {
            uid: uid,
            workId: achievementId,
            title: title,
            count: quoteTime,
            name: authors,
            publisher: publisher,
            publishTime: publishTime + " 00:00:00"
        };

        console.log(requestBody);

        const response = await axios.post(
            `http://120.46.63.223:30021/api/history/add`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('添加历史记录失败', error);
        return null;
    }
}


// 查询(获取)历史记录
export async function getHistory(uid) {
    try {
        const requestBody = {
            uid: uid
       };
        
        const response = await axios.post(
            `http://120.46.63.223:30021/api/history/get`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('获取历史记录失败', error);
        return null;
    }
}
