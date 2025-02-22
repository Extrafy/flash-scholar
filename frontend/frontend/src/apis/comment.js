import axios from 'axios';

// 获取文章评论内容
export async function getArticleComments(userId, achievementId) {
    try {
        const response = await axios.get(`http://120.46.63.223:30011/api/comment/achievement/${userId}/${achievementId}`);
        return response.data.data;
    } catch (error) {
        console.log('获取评论内容失败', error);
        return null;
    }
}

// 获得评论的回复内容
export async function getCommentReplies(userId, commentId) {
    try {
        const response = await axios.get(`http://120.46.63.223:30011/api/comment/reply/${userId}/${commentId}`);
        return response.data.data;
    } catch (error) {
        console.log('获取评论回复失败', error);
        return null;
    }
}

// 发表评论内容
export async function addArticleComments(parentCommentId, userId, achievementId, content) {
    try {
        const requestBody = {
            parentCommentId: parentCommentId,
            userId: userId,
            achievementId: achievementId,
            content: content
        };

        const response = await axios.post(
            `http://120.46.63.223:30011/api/comment/add`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('发布评论内容失败', error);
        return null;
    }
}

// 删除评论
export async function removeArticleComments(commentId) {
    try {
        const response = await axios.delete(
            `http://120.46.63.223:30011/api/comment/delete`,
            {
                params: {
                    commentId: commentId
                }
            }
        );
        return response.data.data;
    } catch (error) {
        console.log('删除评论失败', error);
        return null;
    }
}

// 点赞评论
export async function likeArticleComments(userId, commentId) {
    try {
        const requestBody = {
            userId: userId,
            commentId: commentId
        };

        const response = await axios.post(
            `http://120.46.63.223:30011/api/comment/like`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('点赞评论失败', error);
        return null;
    }
}

// 取消点赞评论
export async function dislikeArticleComments(userId, commentId) {
    try {
        const requestBody = {
            userId: userId,
            commentId: commentId
        };

        const response = await axios.post(
            `http://120.46.63.223:30011/api/comment/unlike`,
            requestBody
        );
        return response.data.data;
    } catch (error) {
        console.log('取消点赞评论失败', error);
        return null;
    }
}