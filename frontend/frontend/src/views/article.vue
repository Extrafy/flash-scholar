<template>
    <el-container class="article-container">
        <el-header class="article-header">
            <topBar></topBar>
        </el-header>
        <el-main class="article-main">

            <div class="article-body">

                <div class="article-basic-info">
                    <div class="article-title">
                        <h1>{{ articleInfo.title }}</h1>
                    </div>
                    <div class="article-authors">
                        <span v-for="(author, index) in articleInfo.authors.slice(0, 10)" :key="index">
                            <span @click="router.push('/scholar/' + author.authorId)" :style="{ cursor: 'pointer' }">
                                {{ author.authorName }}
                            </span>
                        </span>
                    </div>

                    <div class="article-institutions">
                        <span v-for="(institution, index) in articleInfo.institutions.slice(0, 10)" :key="index">
                            <span @click="router.push('/institution/' + institution.institutionId)"
                                :style="{ cursor: 'pointer' }">
                                {{ institution.institutionName }}
                            </span>
                            {{ index < articleInfo.institutions.slice(0, 10).length - 1 ? ', ' : '' }} </span>
                    </div>
                    <div class="article-journal">
                        <span>
                            {{ articleInfo.journal.time }}
                            <span v-if="articleInfo.journal.publisher"> | </span>
                            {{ articleInfo.journal.publisher }}
                        </span>
                    </div>


                    <div class="article-actions">

                        <el-tooltip :disabled="isHovering1" content="原文链接" placement="bottom" effect="light">
                            <el-button type="success" class="button-icon1"
                                :class="{ 'expanded': isHovering1, 'expanded-button': isHovering1 }"
                                @mouseenter="isHovering1 = true" @mouseleave="isHovering1 = false"
                                @click="openWindow('origin')">

                                <span class="iconfont">&#xe601;</span>

                                <span v-show="isHovering1" class="button-text">
                                    原文章链接
                                </span>
                            </el-button>
                        </el-tooltip>


                        <el-tooltip :disabled="isHovering2" content="分享网页" placement="bottom" effect="light">
                            <el-button type="primary" class="button-icon2"
                                :class="{ 'expanded': isHovering2, 'expanded-button': isHovering2 }"
                                @mouseenter="isHovering2 = true" @mouseleave="isHovering2 = false"
                                @click="copyCurrentURL()">

                                <span class="iconfont" :style="{ fontSize: '20px' }">&#xeb24;</span>

                                <span v-show="isHovering2" class="button-text">
                                    分享网页
                                </span>
                            </el-button>
                        </el-tooltip>



                        <el-tooltip :disabled="isHovering3" content="收藏文章" placement="bottom" effect="light">
                            <el-button type="warning" class="button-icon3"
                                :class="{ 'expanded': isHovering3, 'expanded-button': isHovering3 }"
                                @mouseenter="isHovering3 = true" @mouseleave="isHovering3 = false"
                                @click="showCollectionDialog()">

                                <span class="iconfont">&#xe60f;</span>

                                <span v-show="isHovering3" class="button-text">
                                    收藏文章
                                </span>
                            </el-button>
                        </el-tooltip>



                        <el-tooltip :disabled="isHovering4" content="openAlex链接" placement="bottom" effect="light">
                            <el-button type="danger" class="button-icon4"
                                :class="{ 'expanded': isHovering4, 'expanded-button': isHovering4 }"
                                @mouseenter="isHovering4 = true" @mouseleave="isHovering4 = false"
                                @click="openWindow('openAlex')">

                                <span class="iconfont">&#xe61e;</span>

                                <span v-show="isHovering4" class="button-text">
                                    openAlex
                                </span>
                            </el-button>
                        </el-tooltip>

                    </div>

                    <el-dialog title="添加到收藏夹" v-model="collectionDialogVisible" width="400px">
                        <div class="collection-list">
                            <el-checkbox-group v-model="selectedFolders">
                                <div v-for="folder in collectionFolders" :key="folder.fid" class="folder-item">
                                    <el-checkbox :label="folder.fid">
                                        <span class="folder-name">{{ folder.fname }}</span>
                                    </el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>

                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="collectionDialogVisible = false">取消</el-button>
                                <el-button @click="createNewFolder" type="success">
                                    新建收藏夹
                                </el-button>
                                <el-button type="primary" @click="confirmCollection"
                                    :disabled="selectedFolders.length === 0">
                                    确定
                                </el-button>
                            </div>
                        </template>
                    </el-dialog>

                    <el-dialog title="新建收藏夹" v-model="newFolderDialogVisible" width="400px">
                        <el-form :model="newFolderForm" label-width="80px">
                            <el-form-item label="名称" :rules="[{ required: true, message: '请输入收藏夹名称' }]">
                                <el-input v-model="newFolderForm.name" placeholder="请输入收藏夹名称"></el-input>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input v-model="newFolderForm.description" type="textarea"
                                    placeholder="请输入收藏夹描述"></el-input>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="newFolderDialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="confirmCreateFolder"
                                :disabled="!newFolderForm.name">确定</el-button>
                        </template>
                    </el-dialog>

                </div>

                <div class="article-info">

                    <div class="article-info-left">
                        <div class="article-abstract">
                            <p class="abstract-title">摘要</p>
                            <p class="abstract-content">
                                {{ displayedAbstract }}
                                <span v-if="articleInfo.abstract.length > abstractMaxLength" class="expand-button"
                                    @click="toggleAbstract">
                                    {{ isAbstractExpanded ? '收起' : '展开' }}
                                </span>
                            </p>
                        </div>

                        <div class="referencesAndRelated">
                            <p class="referenceAndRelated-title">参考文献</p>
                            <ul v-if="displayedReferences.length > 0">
                                <li v-for="(reference, index) in displayedReferences" :key="index">
                                    <p class="referenceAndRelated-content"
                                        @click="navigateToArticle(getArticleId('references', index))"
                                        style="cursor: pointer;">
                                        <span style="color: black;">[{{ (referencesCurrentPage - 1) * pageSize +
                                            index + 1 }}]</span>
                                        <span style="color: #3498db; padding-left: 10px;">{{ reference }}</span>
                                    </p>
                                </li>
                            </ul>
                            <div v-else-if="isReferencesLoading" class="loading-text">
                                加载中...
                            </div>
                            <div v-else-if="displayedReferences.length === 0 && !isReferencesLoading"
                                class="no-data-text">
                                暂无参考文献
                            </div>
                            <div :style="{ marginTop: '20px', marginBottom: '10px' }">
                                <el-pagination v-if="referencesTotal > pageSize" :current-page="referencesCurrentPage"
                                    :page-size="pageSize" :total="referencesTotal"
                                    @current-change="handleReferencesPageChange" layout="prev, pager, next" />
                            </div>
                        </div>

                        <div class="referencesAndRelated">
                            <p class="referenceAndRelated-title">相关文献</p>
                            <ul v-if="displayedRelatedDocs.length > 0">
                                <li v-for="(relatedDoc, index) in displayedRelatedDocs" :key="index">
                                    <p class="referenceAndRelated-content"
                                        @click="navigateToArticle(getArticleId('related', index))"
                                        style="cursor: pointer;">
                                        <span style="color: black;">[{{ (relatedDocsCurrentPage - 1) * pageSize +
                                            index + 1 }}]</span>
                                        <span style="color: #3498db; padding-left: 10px;">{{ relatedDoc }}</span>
                                    </p>
                                </li>
                            </ul>
                            <div v-else-if="isRelatedDocsLoading" class="loading-text">
                                加载中...
                            </div>
                            <div v-else-if="displayedRelatedDocs.length === 0 && !isRelatedDocsLoading"
                                class="no-data-text">
                                暂无相关文献
                            </div>
                            <div :style="{ marginTop: '20px', marginBottom: '10px' }">
                                <el-pagination v-if="relatedDocsTotal > pageSize" :current-page="relatedDocsCurrentPage"
                                    :page-size="pageSize" :total="relatedDocsTotal"
                                    @current-change="handleRelatedDocsPageChange" layout="prev, pager, next" />
                            </div>
                        </div>

                        <div class="comments">
                            <p class="comments-title">评论区</p>
                            <div v-if="uid === undefined" class="no-comments">
                                请先登录, 登录后才可查看评论和发表评论
                            </div>
                            <div v-else-if="commentCount === 0" class="no-comments">
                                暂无评论,快来抢沙发吧!
                            </div>
                            <div class="comment-item" v-for="(comment, index) in comments" :key="index">
                                <div class="comment-header">
                                    <span class="comment-user">{{ comment.username }}</span>
                                    <span class="comment-info">
                                        {{ comment.likes }} 点赞 · {{ comment.replyCount }} 回复 · {{
                                            comment.commentTime }}
                                    </span>
                                </div>

                                <div class="comment-content">
                                    {{ comment.content }}
                                </div>

                                <div class="comment-actions">
                                    <div class="view-details" @click="viewCommentDetails(comment.commentId)">
                                        查看详情
                                    </div>

                                    <div class="action-buttons">
                                        <span class="iconfont" @click="deleteComment(comment.commentId)"
                                            v-if="getUserNickName() === comment.username" :style="{ fontSize: '22px' }">
                                            &#xe632;
                                        </span>
                                        <span class="iconfont like-button"
                                            @click="likeOrDislikeComment(comment.commentId, comment.isLiked)"
                                            :class="{ 'liked': comment.isLiked }" :style="{ fontSize: '20px' }">
                                            &#xe651;
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <div class="add-comment" v-if="uid !== undefined">
                                <el-input type="textarea" v-model="newComment" :maxlength="500"
                                    placeholder="快来发表你的评论吧..." rows="3" show-word-limit />
                                <div class="comment-buttons">
                                    <el-button type="danger" @click="newComment = ''">清空输入栏</el-button>
                                    <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">发布
                                    </el-button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div class="article-info-right">

                <div class="article-sider">

                    <div class="article-sider-item1">
                        <h3 class="section-title">统计信息</h3>
                        <div class="statistics">
                            <div class="statistic-item">
                                <span class="number citation-count">{{ animatedCitationCount }}</span>
                                <span class="label">引用量</span>
                            </div>
                            <div class="statistic-item">
                                <span class="number favorite-count">{{ animatedFavoriteCount }}</span>
                                <span class="label">收藏数</span>
                            </div>
                            <div class="statistic-item">
                                <span class="number comment-count">{{ animatedCommentCount }}</span>
                                <span class="label">评论数</span>
                            </div>
                        </div>
                    </div>

                    <div class="article-sider-item2">
                        <div :style="{ height: 'auto' }">
                            <h3 class="section-title">领域</h3>
                            <ul class="fields-list">
                                <li v-for="(field, index) in articleInfo.articleFields" :key="index">
                                    <p class="field-item" @click="router.push('/concept/' + field.fieldId)">{{
                                        field.fieldName }}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>

        </el-main>

    </el-container>

</template>

<script setup lang="ts">
import { onMounted, ref, computed, getCurrentInstance, watch } from 'vue';
import { PaperInfo, Tag, Query4Work } from '@/utils/paperClasses.vue';
import { searchWorks } from '@/apis/search';
import { Link, Share, Star } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { getOpenAlexArticle, getOpenAlexInfo } from '@/apis/article';
import { getArticleComments, addArticleComments, removeArticleComments, likeArticleComments, dislikeArticleComments } from '@/apis/comment';
import { getUserId, getUserNickName } from '@/http/cookie';
import topBar from '@/components/topBar.vue';
import { addCollection, getCollectionFolders, createCollectionFolder, getCollectionCount } from '@/apis/collection';
import { ElMessage, ElMessageBox } from 'element-plus';
import { removeHtml, reconstructAbstract } from '@/utils/stringProcessor';
import { addHistory } from '@/apis/history';
import { startAnimation } from '@/utils/animation';

let uid = getUserId();


const isHovering1 = ref(false);
const isHovering2 = ref(false);
const isHovering3 = ref(false);
const isHovering4 = ref(false);

const collectionDialogVisible = ref(false);
const collectionFolders = ref([]);
const selectedFolders = ref([]);
const newFolderDialogVisible = ref(false);
const newFolderForm = ref({
    name: '',
    description: ''
});

const router = useRouter();
const route = useRoute();

const animatedCitationCount = ref(0); // 动画引用量
const animatedFavoriteCount = ref(0); // 动画收藏数
const animatedCommentCount = ref(0); // 动画评论数

const newComment = ref(''); // 用于存储输入的评论内容
const commentCount = ref(0);     // 评论数
const comments = ref([]); // 文章评论

const isReferencesLoading = ref(true);
const isRelatedDocsLoading = ref(true);
const isAbstractExpanded = ref(false);

const abstractMaxLength = 600; // 设置摘要初始显示的最大长度
const displayedAbstract = computed(() => {
    if (isAbstractExpanded.value || articleInfo.value.abstract.length <= abstractMaxLength) {
        return articleInfo.value.abstract;
    }
    return articleInfo.value.abstract.substring(0, abstractMaxLength) + '...';
});

const toggleAbstract = () => {
    isAbstractExpanded.value = !isAbstractExpanded.value;
};

interface PageData {
    titles: string[];
    ids: string[];
    isLoaded: boolean;
}

const references = ref<PageData[]>([]); // 按页存储的引用文献
const relatedDocs = ref<PageData[]>([]); // 按页存储的相关文献
const displayedReferences = ref<string[]>([]);
const displayedRelatedDocs = ref<string[]>([]);
const referencesTotal = ref(0);
const relatedDocsTotal = ref(0);
const pageSize = 10;

const referencesCurrentPage = ref(1);
const relatedDocsCurrentPage = ref(1);

// 添加获取文章ID的辅助函数
const getArticleId = (type: 'references' | 'related', index: number): string => {
    try {
        if (type === 'references') {
            const pageData = references.value[referencesCurrentPage.value - 1];
            return pageData?.ids?.[index] || '';
        } else {
            const pageData = relatedDocs.value[relatedDocsCurrentPage.value - 1];
            return pageData?.ids?.[index] || '';
        }
    } catch (error) {
        console.error('Error getting article ID:', error);
        return '';
    }
}

const navigateToArticle = (id: string) => {
    window.location.href = `/article/${id}`;
}

const articleInfo = ref({
    // 展示的数据
    "title": "",
    "authors": [],
    "institutions": [], // 机构
    "journal": {
        "time": "",
        "publisher": "",
    },
    "doi": "", //数字对象唯一标识
    "abstract": "", // 摘要
    "citationCount": 0, //引用量
    "articleFields": [{
        "fieldName": "",
        "fieldLevel": 0,
        "fieldId": ""
    }], // 论文领域
    "url": "", // 文章链接

    // 非展示的数据
    "id": "",
    "type": "", //文章类型
});


let isInOurDatabase = false; // 是否在我们的数据库中找到这个文章

// 初始化文章基本信息
const initArticleBasicInfo = async () => {
    const route = useRoute();
    const id = route.params.id;

    try {
        let search: Query4Work = new Query4Work(Query4Work.id_fields, id);
        let json = { must: [search.toJson()] }
        let response = await searchWorks(json);

        if (!response?.hits?.hits?.[0]?._source) { // 没有找到文章,调用openAlex
            const openAlexResponse = await getOpenAlexArticle(id);
            const source = openAlexResponse;

            // 首先收集所有机构名称
            const institutionMap = new Map<string, { name: string, id: string }>();
            source.authorships?.forEach(authorship => {
                authorship.institutions?.forEach(inst => {
                    if (inst.display_name) {
                        const instId = inst.id ? inst.id.split('/').pop() || '0' : '0';
                        institutionMap.set(instId, {
                            name: inst.display_name,
                            id: instId
                        });
                    }
                });
            });


            articleInfo.value = {
                title: source.title || '暂无标题',
                authors: source.authorships?.map(authorship => ({
                    authorName: authorship.author.display_name || '',
                    authorId: authorship.author.id.split('/').pop() || '0',
                })) || [],
                institutions: Array.from(institutionMap.values()).map(inst => ({
                    institutionName: inst.name,
                    institutionId: inst.id,
                })),
                journal: {
                    time: source.publication_date || '',
                    publisher: source.primary_location?.source?.display_name || ''
                },
                doi: source.doi || '',
                abstract: source.abstract_inverted_index ? removeHtml(reconstructAbstract(source.abstract_inverted_index)) : '暂无摘要',
                citationCount: source.cited_by_count || 0,

                articleFields: source.concepts?.map(concept => ({
                    fieldName: concept.display_name || '',
                    fieldLevel: concept.level || 0,
                    fieldId: concept.id.split('/').pop() || '',
                }))?.sort((a, b) => a.fieldLevel - b.fieldLevel)?.slice(0, 15) || [],

                url: source.primary_location?.landing_page_url || '',
                id: source.id?.split('/').pop() || '0',
                type: source.type || 'article',
            };

            startAnimation(animatedCitationCount, source.cited_by_count || 0);
            let count = await getCollectionCount(articleInfo.value.id);
            startAnimation(animatedFavoriteCount, count || 0);

            return source;
        }

        else { //在我们的数据库中找到了文章
            isInOurDatabase = true;
            const source = response.hits.hits[0]._source;
            const sortedConcepts = source.conceptDTOS.sort((a, b) => a.level - b.level).slice(0, 15);

            articleInfo.value = {
                title: source.title || '',
                authors: source.authorDTOS?.map(author => ({
                    authorName: author.authorName || '',
                    authorId: author.authorId || '0',
                })) || [],
                institutions: source.institutionDTOS?.map(inst => ({
                    institutionName: inst.institutionName || '',
                    institutionId: inst.institutionId || '0',
                })),
                journal: {
                    time: source.publishTime || '',
                    publisher: source.sources?.[0]?.name || ''
                },
                doi: source.doi || '',
                abstract: removeHtml(source.abstracts) || '暂无摘要',
                citationCount: source.cited || 0,

                articleFields: sortedConcepts?.map(concept => ({
                    fieldName: concept.conceptName || '',
                    fieldLevel: concept.conceptLevel || 0,
                    fieldId: concept.conceptId || '',
                }))?.sort((a, b) => a.fieldLevel - b.fieldLevel)?.slice(0, 15) || [],

                url: source.sources?.[0]?.url || '',
                id: source.workId || 0,
                type: source.type || "article",

            };

            //启动动画
            startAnimation(animatedCitationCount, source.cited || 0);
            let count = await getCollectionCount(articleInfo.value.id);
            startAnimation(animatedFavoriteCount, count || 0);

            return source;
        }


    } catch (error) {
        console.error('获取文章基本信息失败：', error);
    }

}


// 初始化引用和相关文献
const initReferencesAndRelated = async (source) => {
    let referenceIds = [];
    let relatedIds = [];
    if (!source.referencesDTOS && !source.relatedDTOS) {
        referenceIds = (source.referenced_works || [])
            .map(url => url.split('/').pop())
            .filter(id => id); // 过滤掉可能的 null/undefined
        relatedIds = (source.related_works || [])
            .map(url => url.split('/').pop())
            .filter(id => id);
    } else {
        referenceIds = source.referencesDTOS.map(dto => dto.id);
        relatedIds = source.relatedDTOS.map(dto => dto.id);
    }

    // 设置总数
    referencesTotal.value = referenceIds.length;
    relatedDocsTotal.value = relatedIds.length;

    // 初始化页数组
    const referencesPages = Math.ceil(referencesTotal.value / pageSize);
    const relatedPages = Math.ceil(relatedDocsTotal.value / pageSize);

    references.value = Array(referencesPages).fill(null).map(() => ({
        titles: [],
        ids: [],
        isLoaded: false
    }));
    relatedDocs.value = Array(relatedPages).fill(null).map(() => ({
        titles: [],
        ids: [],
        isLoaded: false
    }));

    // 1. 先加载参考文献第一页
    if (!isInOurDatabase) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await loadReferencePage(1, referenceIds);

    // 2. 等待1秒后加载相关文献第一页
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadRelatedPage(1, relatedIds);

    // 3. 依次加载参考文献的剩余页面
    for (let page = 2; page <= referencesPages; page++) {
        await new Promise(resolve => setTimeout(resolve, 900));
        await loadReferencePage(page, referenceIds);
    }

    // 4. 最后加载相关文献的剩余页面
    for (let page = 2; page <= relatedPages; page++) {
        await new Promise(resolve => setTimeout(resolve, 900));
        await loadRelatedPage(page, relatedIds);
    }

}

// 评论初始化部分
const initComments = async () => {
    if (uid === undefined) {
        return;
    }
    const getCommentResponse = await getArticleComments(uid, articleInfo.value.id);
    comments.value = getCommentResponse;
    commentCount.value = getCommentResponse.length;
    startAnimation(animatedCommentCount, commentCount.value);
}

const submitComment = async () => {
    if (!newComment.value.trim()) {
        ElMessage.warning('评论内容不能为空');
        return;
    }

    try {
        if (uid === undefined) {
            ElMessage.error('请先登录');
            newComment.value = ''; // 清空评论输入框
            return;
        }

        await addArticleComments(0, uid, articleInfo.value.id, newComment.value);
        newComment.value = ''; // 清空评论输入框
        ElMessage.success('评论发布成功');
        await updateComments(); // 更新评论列表
    } catch (error) {
        console.error('发布评论失败：', error);
        ElMessage.error('发布评论失败，请稍后重试');
    }

}

const viewCommentDetails = (commentId: any) => {
    router.push({
        path: `/comment/${articleInfo.value.id}/${commentId}`,
    }).then(() => {
        window.location.reload();
    });
};

const deleteComment = async (commentId: any) => {
    try {
        await removeArticleComments(commentId);  // 等待删除操作完成
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
            await dislikeArticleComments(uid, commentId);
            ElMessage.success('取消点赞成功');
        } else {
            await likeArticleComments(uid, commentId);
            ElMessage.success('点赞成功');
        }
        const getCommentResponse = await getArticleComments(uid, articleInfo.value.id);
        comments.value = getCommentResponse;

    } catch (error) {
        console.error('点赞操作失败：', error);
        ElMessage.error('操作失败，请稍后重试');
    }
}

function openWindow(type: string) { // 打开对应的论文网页
    let url = null;
    if (type === "origin") {
        url = articleInfo.value.url;
    } else if (type === "openAlex") {
        url = "https://openalex.org/works/" + articleInfo.value.id;
    }

    ElMessageBox.confirm(
        `您即将前往网页“${url}”，是否继续？`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        window.open(url, '_blank');
    }).catch(() => {
        // 点击取消按钮
    });
}

const copyCurrentURL = () => {
    // 检查是否支持 navigator.clipboard
    if (navigator.clipboard && window.isSecureContext) {
        // 现代浏览器方案
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                ElMessage.success('链接已复制到剪贴板，快去分享给ta吧！');
            })
            .catch(err => {
                fallbackCopyTextToClipboard(window.location.href);
            });
    } else {
        // 降级方案
        fallbackCopyTextToClipboard(window.location.href);
    }
}

// 降级复制方案
const fallbackCopyTextToClipboard = (text) => {
    try {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = text;

        // 将文本区域添加到文档中
        document.body.appendChild(textArea);

        // 选择文本
        textArea.select();

        // 执行复制命令
        const successful = document.execCommand('copy');

        // 移除临时文本区域
        document.body.removeChild(textArea);

        if (successful) {
            ElMessage.success('链接已复制到剪贴板，快去分享给ta吧！');
        } else {
            ElMessage.error('复制失败，请手动复制');
        }
    } catch (err) {
        console.error('复制失败:', err);
        ElMessage.error('复制失败，请手动复制');
    }
}




const showCollectionDialog = async () => {
    try {
        if (uid === undefined) {
            ElMessage.error('请先登录, 登录之后才能收藏文章');
            return;
        }

        collectionDialogVisible.value = true;
        const response = await getCollectionFolders(uid);
        collectionFolders.value = response.data;
    } catch (error) {
        console.error('获取收藏夹失败：', error);
        ElMessage.error('获取收藏夹失败');
    }
}

const confirmCollection = async () => {
    if (selectedFolders.value.length === 0) {
        return;
    }

    try {
        // 将作者数组转换为逗号分隔的字符串
        const authorsString = articleInfo.value.authors
            .map(author => author.authorName)
            .join(', ');

        // 遍历选中的收藏夹，添加文章
        const response = await addCollection(uid, articleInfo.value.id, selectedFolders.value,
            articleInfo.value.title, authorsString, articleInfo.value.journal.publisher,
            articleInfo.value.citationCount, articleInfo.value.journal.time);


        let notAdded = [];
        // 遍历响应数组
        response.forEach((result, index) => {
            if (result === null) {
            } else {
                notAdded.push(result.fname);
            }
        });

        // 如果有已添加的收藏夹，显示它们的名称
        const successMessage = notAdded.length > 0
            ? `添加到收藏夹成功: ${notAdded.join(', ')}`
            : '添加到收藏夹成功';

        ElMessage.success(successMessage);
        collectionDialogVisible.value = false;
        selectedFolders.value = []; // 清空选择
        let count = await getCollectionCount(articleInfo.value.id);
        startAnimation(animatedFavoriteCount, count || 0);
    } catch (error) {
        console.error('添加到收藏夹失败：', error);
        ElMessage.error('添加到收藏夹失败');
    }
}

const createNewFolder = () => {
    newFolderDialogVisible.value = true;
}

const confirmCreateFolder = async () => {
    if (!newFolderForm.value.name.trim()) {
        ElMessage.warning('收藏夹名称不能为空');
        return;
    }

    try {
        await createCollectionFolder(
            uid,
            newFolderForm.value.description,
            newFolderForm.value.name
        );

        ElMessage.success('创建收藏夹成功');
        newFolderDialogVisible.value = false;

        // 重置表单
        newFolderForm.value = {
            name: '',
            description: ''
        };

        // 刷新收藏夹列表
        const response = await getCollectionFolders(uid);
        collectionFolders.value = response.data;

    } catch (error) {
        console.error('创建收藏夹失败：', error);
        ElMessage.error('创建收藏夹失败，请稍后重试');
    }
};

let sum = 0;
const getArticleTitle = async (id: string): Promise<string> => {
    try {
        let search: Query4Work = new Query4Work(Query4Work.id_fields, id);
        let json = { must: [search.toJson()] }
        let response = await searchWorks(json);

        if (response?.hits?.hits?.[0]?._source) {
            sum = sum + 1;
            return response.hits.hits[0]._source.title;
        }

        const openAlexResult = await getOpenAlexInfo(id);
        return openAlexResult?.title || `暂无标题`;
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        return `暂无标题 (ID: ${id})`;
    }
}


const handleReferencesPageChange = async (page: number) => {
    referencesCurrentPage.value = page;
    const pageIndex = page - 1;

    if (!references.value[pageIndex]?.isLoaded) {
        displayedReferences.value = Array(pageSize).fill('加载中...');
    } else {
        displayedReferences.value = references.value[pageIndex].titles;
    }
}


const handleRelatedDocsPageChange = async (page: number) => {
    relatedDocsCurrentPage.value = page;
    const pageIndex = page - 1;

    if (!relatedDocs.value[pageIndex]?.isLoaded) {
        displayedRelatedDocs.value = Array(pageSize).fill('加载中...');
    } else {
        displayedRelatedDocs.value = relatedDocs.value[pageIndex].titles;
    }
}


const loadReferencePage = async (page: number, allIds: string[]) => {
    const pageIndex = page - 1;

    if (references.value[pageIndex]?.isLoaded) {
        return;
    }

    isReferencesLoading.value = true;
    try {
        const start = pageIndex * pageSize;
        const pageIds = allIds.slice(start, start + pageSize);

        // 并发请求当前页的所有标题
        const titles = await Promise.all(
            pageIds.map(id => getArticleTitle(id))
        );

        references.value[pageIndex] = {
            titles,
            ids: pageIds,
            isLoaded: true
        };

        // 如果当前正在显示这一页，更新显示内容
        if (page === referencesCurrentPage.value) {
            displayedReferences.value = titles;
        }
    } finally {
        isReferencesLoading.value = false;
    }
}

const loadRelatedPage = async (page: number, allIds: string[]) => {
    const pageIndex = page - 1;

    if (relatedDocs.value[pageIndex]?.isLoaded) {
        return;
    }

    isRelatedDocsLoading.value = true;
    try {
        const start = pageIndex * pageSize;
        const pageIds = allIds.slice(start, start + pageSize);


        // 并发请求所有标题
        const titles = await Promise.all(
            pageIds.map(id => getArticleTitle(id))
        );

        relatedDocs.value[pageIndex] = {
            titles,
            ids: pageIds,
            isLoaded: true
        };

        if (page === relatedDocsCurrentPage.value) {
            displayedRelatedDocs.value = titles;
        }
    } finally {
        isRelatedDocsLoading.value = false;
    }
}

async function initAll() {
    const articleBasicInfo = await initArticleBasicInfo();

    // 添加历史记录
    addHistory(
        uid,
        articleInfo.value.id,
        articleInfo.value.title,
        articleInfo.value.journal.publisher,
        articleInfo.value.citationCount,
        articleInfo.value.journal.time,
        articleInfo.value.authors.map(author => author.authorName).join(', ')
    );

    await initComments();
    await initReferencesAndRelated(articleBasicInfo);
    console.log("有几个文章在我们数据库里?" + sum);
}

async function updateComments() {
    await initComments();
}

onMounted(() => {
    initAll();

});

</script>


<style scoped>
.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.loading-text {
    font-size: 14px;
    color: #666;
    padding: 0 0 10px 0;
}

.article-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
}

.article-header {
    margin: 0;
    padding: 0;
}

.article-main {
    background-color: rgb(242, 243, 248);
    height: calc(100vh - 75px);
    grid-template-columns: 70% 30%;
    display: grid;
}

.article-body {
    margin-left: 10%;
    width: 85%;
    height: auto;
}

.article-basic-info {
    padding-left: 15px;
    max-width: 880px;
}

.article-title {
    line-height: 1.4;
    font-size: 20px;
    word-wrap: break-word;
    word-break: break-word;
}

.article-info-right {
    position: relative;
    margin-right: 5%;
    padding-right: 10%;
}

.article-authors,
.article-institutions,
.article-journal {
    text-align: justify;
    margin-top: 10px;
}

.article-actions {
    margin: 2% 0 0 0;
    display: flex;
    gap: 2%;
}

.button-icon1,
.button-icon2,
.button-icon3,
.button-icon4 {
    transition: all 0.3s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.expanded-button {
    width: 100px;
    border-radius: 20px;
}

.button-text {
    display: none;
    transition: opacity 0.3s ease;
}

.expanded .button-text {
    display: block;
}

.expanded .iconfont {
    display: none;
}

.article-authors span {
    font-size: 16px;
    margin-right: 5px;
    display: inline-block;
    color: rgb(123, 161, 186);
}

.article-institutions span {
    color: rgb(125, 127, 130);
}

.article-info {
    width: 100%;
    height: auto;
}

.article-abstract {
    background-color: white;
    margin-top: 30px;
    border-radius: 20px;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
    padding: 10px 5px 5px 20px;
    height: auto;
}

.abstract-title,
.comments-title,
.referenceAndRelated-title {
    font-size: 18px;
    font-weight: bold;
}

.referenceAndRelated-content {
    font-size: 15px;
    font-weight: normal;
}

.abstract-content {
    font-size: 15px;
    line-height: 1.8;
    text-align: justify;
    max-width: 97%;
    padding: 0 0 5px 5px;
    transition: all 0.3s ease;
}

.expand-button {
    color: #3498db;
    cursor: pointer;
    margin-left: 8px;
    font-size: 14px;
    user-select: none;
}

.expand-button:hover {
    color: #2980b9;
}

.referencesAndRelated {
    background-color: white;
    margin-top: 30px;
    border-radius: 20px;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
    padding: 10px 5px 5px 20px;
}

.referencesAndRelated h3 {
    margin-bottom: 10px;
    color: #333;
}

.referencesAndRelated ul {
    list-style: none;
    padding: 0;
}

.referencesAndRelated li {
    margin-bottom: 10px;
}

.referenceAndRelated-title:hover {
    color: #2c8ccb;
}

.article-document {
    background-color: white;
    margin-top: 20px;
    height: auto;
    border-radius: 20px;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
}

.article-sider {
    margin-top: 30px;
    height: auto;
    position: sticky;
    top: 30px;
}

.article-sider-item1,
.article-sider-item2,
.article-sider-item3 {
    background-color: white;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 15px 20px 20px 20px;
    margin-bottom: 20px;
}


.section-title {
    font-size: 15px;
    color: #333;
    margin-bottom: 10px;
}

.fields-list,
.related-docs {
    list-style: none;
    padding: 0;
    margin: 0;
}

.field-item {
    cursor: pointer;
    font-size: 15px;
    color: #3498db;
    text-decoration: none;
    line-height: 1.4;
    padding-left: 10px;
}

.field-item:hover {
    color: #2c8ccb;
}

.statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding: 10px 10px 10px 10px;
    text-align: center;
}

.statistic-item {
    flex: 1;
    font-family: Arial, sans-serif;
}

.number {
    font-size: 26px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
}

.citation-count {
    color: #2ecc71;
}

.favorite-count {
    color: #e67e22;
}

.comment-count {
    color: #e74c3c;
}

.label {
    font-size: 14px;
    color: #666;
}

.no-comments,
.no-data-text {
    font-size: 14px;
}

.comments {
    padding: 10px 5px 5px 20px;
    margin-top: 20px;
    background-color: white;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
}

.comment-item {
    padding-left: 15px;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.3s ease;
}

.comment-item:hover {
    background-color: #f8faff;
}

.comment-header {
    font-size: 14px;
    color: #666;
    padding: 20px 0 15px 5px;
}

.comment-user {
    font-weight: bold;
    color: #3498db;
}

.comment-info {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
}

.comment-content {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: 2px solid #e0e0e0;
}

.comment-actions {
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0 10px 5px;
}

.comment-actions .view-details {
    cursor: pointer;
    color: #3498db;
    text-decoration: none;
}

.comment-actions span {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.comment-actions .liked {
    color: #e74c3c;
}

.add-comment {
    padding: 20px 10px 5px 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.comment-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px 0 10px 0;
}


.like-button {
    transition: color 0.3s ease;
}

.like-button.liked {
    color: #e74c3c;
}

.action-buttons {
    display: flex;
    gap: 15px;
    margin-right: 15px;
}

.el-menu-custom {
    background-color: #f8f8f9;
    border-bottom: 1px solid #ebeef5;
    border-radius: 10px;
}

.el-menu-custom .el-menu-item {
    font-size: 14px;
    color: #606266;
    margin-right: 20px;
}

.el-menu-custom .el-menu-item:hover {
    background-color: #ecf5ff;
    color: #409eff;
}

.el-icon {
    position: relative;
    color: #909399;
    left: 50%;
}
</style>
