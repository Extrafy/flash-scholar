<template>
    <el-container class="comment-container">
        <el-header class="comment-header">
            <topBar></topBar>
        </el-header>

        <el-main class="comment-main">
            <div class="comment-content">
                <p
                    :style="{ 'font-size': '28px', 'font-weight': 'bold', 'margin-bottom': '30px', 'margin-left': '10px' }">
                    {{ title }}
                </p>
                <el-breadcrumb :separator-icon="ArrowRight" :style="{ 'margin-bottom': '30px', 'margin-left': '10px' }">
                    <el-breadcrumb-item :to="{ path: `/article/${articleId}` }">论文详情</el-breadcrumb-item>
                    <el-breadcrumb-item>评论详情</el-breadcrumb-item>
                </el-breadcrumb>

                <el-card v-if="mainComment" class="el-card">
                    <div class="main-comment">
                        <p :style="{ 'font-size': '20px', 'font-weight': 'bold', 'color': '#333' }">
                            <strong>{{ mainComment.content }}</strong>
                        </p>
                        <p :style="{ 'font-size': '12px', 'color': '#555' }">
                            {{ mainComment.username }} · {{ mainComment.replyCount }} 回答 · {{ mainComment.commentTime }}
                        </p>
                    </div>

                    <el-divider></el-divider>

                    <div v-if="replies.length > 0">
                        <div v-for="(reply, index) in replies" :key="reply.id">
                            <p style="font-weight: bold; color: #3498db;">{{ reply.username }} </p>
                            <p> {{ reply.content }}</p>

                            <div class="comment-other-details">
                                <div style="font-size: 12px; color: #555;">
                                    {{ reply.commentTime }} | {{ reply.likes }} 点赞
                                </div>
                                <div class="comment-buttons">
                                    <span class="iconfont" @click="deleteComment(reply.commentId)"
                                        v-if="getUserNickName() === reply.username" :style="{ fontSize: '21px' }">
                                        &#xe632;
                                    </span>
                                    <span class="iconfont like-button"
                                        @click="likeOrDislikeComment(reply.commentId, reply.isLiked)"
                                        :class="{ 'liked': reply.isLiked }" :style="{ fontSize: '20px' }">
                                        &#xe651;
                                    </span>
                                </div>

                            </div>

                            <el-divider></el-divider>
                        </div>
                    </div>

                    <div v-else>
                        <p class="no-reply">暂无回复, 期待你的第一条回复！</p>
                    </div>

                    <div class="reply-input">
                        <el-input v-model="newReply" type="textarea" placeholder="来说点什么吧" maxlength="500" :rows="4"
                            show-word-limit></el-input>

                        <div class="comment-buttons">
                            <el-button type="danger" @click="newReply = '';">清空输入栏</el-button>
                            <el-button type="primary" :disabled="!newReply.trim()" @click="addReply">发布
                            </el-button>
                        </div>


                    </div>

                </el-card>

            </div>

        </el-main>

    </el-container>


</template>

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import { getArticleComments, addArticleComments, removeArticleComments, likeArticleComments, dislikeArticleComments } from '@/apis/comment';
import { PaperInfo, Tag, Query4Work } from '@/utils/paperClasses.vue';
import { getOpenAlexArticle, getOpenAlexInfo } from '@/apis/article';
import { searchWorks } from '@/apis/search';
import topBar from '@/components/topBar.vue';
import { getCommentReplies } from '@/apis/comment';
import { getUserId, getUserNickName } from '@/http/cookie';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const articleId = route.params.articleId;
const commentId = route.params.commentId;

const title = ref(""); // 文章标题
const comments = ref([]); // 评论列表
const mainComment = ref(null); // 主评论
const replies = ref([]); // 回复列表

async function initComments() {
    // 获取文章标题
    let search: Query4Work = new Query4Work(Query4Work.id_fields, articleId);
    let json = { must: [search.toJson()] }
    let response = await searchWorks(json);

    if (!response?.hits?.hits?.[0]?._source) { // 如果文章不在数据库中, 就调用openalex接口获取文章信息
        const openAlexResponse = await getOpenAlexArticle(articleId);
        const source = openAlexResponse;
        title.value = source.title;
    } else {
        const source = response.hits.hits[0]._source;
        title.value = source.title;
    }

    const getCommentResponse = await getCommentReplies(getUserId(), commentId);
    comments.value = getCommentResponse;
    mainComment.value = getCommentResponse[0]; // 第一个是主评论
    replies.value = getCommentResponse.slice(1); // 其余的是回复

}


const newReply = ref(""); // 新回复内容
const addReply = async () => {
    if (newReply.value.trim() === "") {
        ElMessage.warning('评论内容不能为空');
        return;
    }

    try {
        await addArticleComments(commentId, getUserId(), articleId, newReply.value);
        newReply.value = ''; // 清空评论输入框
        ElMessage.success('评论发布成功');
        await updateComments(); // 更新评论列表
    } catch (error) {
        console.error('发布评论失败：', error);
        ElMessage.error('发布评论失败，请稍后重试');
    }

};

const deleteComment = async (commentId: any) => {
    try {
        await removeArticleComments(commentId);
        ElMessage.success('评论删除成功');
        await updateComments();  // 更新评论列表
    } catch (error) {
        console.error('删除评论失败：', error);
        ElMessage.error('删除评论失败，请稍后重试');
    }
}

const likeOrDislikeComment = async (commentId, isLiked) => {
    try {
        if (isLiked) {
            await dislikeArticleComments(getUserId(), commentId);
            ElMessage.success('取消点赞成功');
        } else {
            await likeArticleComments(getUserId(), commentId);
            ElMessage.success('点赞成功');
        }
        await updateComments();

    } catch (error) {
        console.error('点赞操作失败：', error);
        ElMessage.error('操作失败，请稍后重试');
    }
}

async function updateComments() {
    await initComments();
}

// 初始化主评论和回复
onMounted(() => {
    initComments();
});


</script>

<style scoped>
.comment-header {
    margin: 0;
    padding: 0;
}

.comment-main {
    background-color: rgb(242, 243, 248);
    height: calc(100vh - 75px);
}

.comment-content {
    margin-left: 15%;
    margin-right: 15%;
}

.main-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.comment-other-details {
    display: flex;
    justify-content: space-between;
}

.comment-meta {
    font-size: 14px;
    color: #999;
}

.no-reply {
    font-size: 16px;
    color: #888;
}

.reply-input {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.el-card {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 0px 20px 10px 20px;
}

.el-input {
    border-radius: 10px;
}

.el-button {
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
}

.comment-buttons {
    cursor: pointer;
    display: flex;
    justify-content: center;
    gap: 15px;
}

.like-button {
    transition: color 0.3s ease;
}


.like-button.liked {
    color: #e74c3c;
}
</style>
