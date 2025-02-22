<template>
    <div class="search_outer_teshu">
        <topBar :opacity-value="1" />
        <div class="super-search" v-if="searchType == 1">
            <div class="filter" v-for="(single, index) of filter.singleFilters">
                <el-input v-model="single.content" style="max-width: 1000px" placeholder="请输入"
                @keydown.enter="getPapersOperation(1)"
                    class="input-with-select">
                    <template #prepend>
                        <el-select v-model="single.type" placeholder="Select"
                            style="width: 80px; margin-right: 20px; border: none; box-shadow: none;">
                            <el-option :label="SingleFilter.types[0]" value="AND" />
                            <el-option :label="SingleFilter.types[1]" value="OR" />
                            <el-option :label="SingleFilter.types[2]" value="NOT"  :disabled="index == 0"/>
                        </el-select>
                        <el-select v-model="single.choose" placeholder="Select"
                            style="width: 90px;  margin-right: 20px; border: none; box-shadow: none;">
                            <el-option :label="SingleFilter.chooses[0]" value="篇名" />
                            <el-option :label="SingleFilter.chooses[1]" value="作者" />
                            <el-option :label="SingleFilter.chooses[2]" value="篇关摘" />
                        </el-select>
                        <el-select v-model="single.accurate" placeholder="Select"
                            style="width: 90px;  border: none; box-shadow: none;">
                            <el-option :label="SingleFilter.accurates[0]" value="精确" />
                            <el-option :label="SingleFilter.accurates[1]" value="模糊" />
                        </el-select>
                    </template>
                </el-input>
                <span style="width: 10px; height: 1px;"></span>
                <el-button class="addSubButton" @click="add(index)" style="margin-left: 10px;"
                    v-show="filter.singleFilters.length < 10">+</el-button>
                <el-button class="addSubButton" @click="remove(index)" style="margin-left: 10px;" :disabled="index == 0"
                    v-show="filter.singleFilters.length != 1">-</el-button>
            </div>
            <div style="margin-top: 20px;">
                <span class="up_date">发表日期</span>
                <el-date-picker v-model="filter.searchForm" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px"></el-date-picker>
                <el-button class="addSubButton" @click="superjie = true;" style="margin-top: -2px;
                                    margin-right: 20px; float: right;">?</el-button>
                <el-button type="primary" style="width:70px; 
                                    height: 30px;
                                    color: antiquewhite;
                                    margin-top: 0px;
                                    margin-right: 20px;
                                    position: relative;
                                    float: right;
                                    margin-left: 50px" @click="getPapersOperation(1)">
                    <el-icon class="el-icon--search" style="font-size: 17px; color: white;">
                        <Search />
                    </el-icon>
                    <span style="color: white;">检索</span>
                </el-button>
                <span class="warning_empty2" v-if="super_empty">内容不能为空</span>
            </div>
        </div>
        <div class="background">
            <div class="grid-item">
                <div class="filter-out">
                    <div style="width: 10; height: 5px;"></div>
                    <span class="filter-title">筛选</span>
                    <el-button type="primary" style="position: relative; 
                                    width:40px; 
                                    height: 25px;
                                    color: white;
                                    float: right;" @click="getPapersOperation(1)">
                        确定
                    </el-button>
                    <el-button type="primary" style="position: relative; 
                                    width:40px; 
                                    height: 25px;
                                    color: white;
                                    margin-right: 10px;
                                    float: right;" @click="resetFilter">
                        重置
                    </el-button>
                    <div style="width: 10; height: 20px;"></div>
                    <div class="filter-body">
                        <div class="filter-inner">
                            <div style="width: 10px; height: 30px;"></div>
                            <span class="year-title">发表年份</span>
                            <div style="width: 10px; height: 15px;"></div>
                            <span style="font-size: 13px;">
                                <span style="color: rgba(0, 0, 0, 0.6); font-weight: 500;">范围：</span>
                                <input v-model.number="start_year" class="year-input">
                                <span style="color: #007bff; font-weight: 500;"> ~ </span>
                                <input v-model.number="end_year" class="year-input">
                            </span>
                            <div style="width: 10px; height: 15px;"></div>
                            <div style="width: 100%; height: 1.5px; background-color: rgba(107, 119, 140, 0.3);"></div>
                            <div style="width: 10px; height: 20px;"></div>
                            <span class="type-title">类型</span>
                            <div style="width: 10px; height: 10px;"></div>
                            <el-checkbox v-model="typeFilter[0]" label="article" size="" style="width: 50%;"
                                class="guangbiao" />
                            <el-checkbox v-model="typeFilter[1]" label="book" size="" style="width: 50%;"
                                class="guangbiao" />
                            <el-checkbox v-model="typeFilter[2]" label="dataset" size="" style="width: 50%;"
                                class="guangbiao" />
                            <el-checkbox v-model="typeFilter[3]" label="others" size="" style="width: 50%;"
                                class="guangbiao" />
                            <div style="width: 10px; height: 15px;"></div>
                        </div>
                    </div>
                    <div v-if="cost_time != -1" class="cost_time">查询用时 <span class="cost_shu">{{ cost_time }}</span> 毫秒
                    </div>
                </div>
            </div>
            <div class="grid-item">
                <div class="paper-list-out">
                    <div style="width: 10; height: 5px;"></div>
                    <el-select-v2 v-model="value" :options="options" placeholder="请选择" size=""
                        style="width: 180px; float: right; margin-top:-5px;" />
                    <span class="filter-title">论文({{ paperLength }})<span class="sort-title">排序
                        </span>
                    </span>
                    <el-switch
                     v-if="searchType == 0"
                        v-model="search_all"
                        size="large"
                        inline-prompt
                        active-text="搜标题"
                        inactive-text="搜全部"
                        style="position: relative; 
                                    color: antiquewhite;
                                    font-size: 16px;
                                    margin-right: 30px;
                                    margin-top: -8px;
                                    float: right;"
                    />
                    <el-button type="primary" style="position: relative; 
                                    width:30px; 
                                    height: 30px;
                                    color: antiquewhite;
                                    margin-right: 15px;
                                    margin-top: -4px;
                                    float: right;" @click="getPapersOperation(1)" v-if="searchType == 0">
                        <el-icon class="el-icon--search" style="font-size: 20px;">
                            <Search />
                        </el-icon>
                    </el-button>
                    <el-input v-model="input" style="width:200px; float: right; margin-right: 5px; margin-top: -5px;"
                        placeholder="请输入" v-if="searchType == 0" @keydown.enter="getPapersOperation(1)" />
                    <span class="warning_empty" v-if="normal_empty">内容不能为空</span>
                    <div style="width: 10; height: 20px;"></div>
                    <div v-for="(paper, index) in paginatedPapers" :key="index" class="paper-item">
                        <div style="width: 100%;"><span class="paper_title guangbiao" @click="goDetail(paper.id)"
                                v-html="paper.title"></span>
                        </div>
                        <div style="height: 8px; width: 8px;"></div>
                        <div style="width: 100%;"><span class="paper_author" v-for="(author, index) in paper.authors"
                                @click="gotoAuthor(author.id)">
                                <span v-html="author.name"></span>
                                <span v-if="index !== paper.authors.length - 1"
                                    style="color: rgb(81, 81, 81);">,</span></span>
                        </div>
                        <div style="height: 3px; width: 3px;"></div>
                        <div style="width: 100%;"><span class="paper_author" v-for="(school, index) in paper.schools"
                                @click="gotoSchool(school.id)">
                                <span v-html="school.name"></span>
                                <span v-if="index !== paper.schools.length - 1"
                                    style="color: rgb(81, 81, 81);">,</span></span>
                        </div>
                        <div style="height: 5px; width: 5px;"></div>
                        <div class="year_and_pub"><span>{{ paper.year.getFullYear() }}</span> · <span>{{ paper.journal
                                }}</span>
                        </div>
                        <div style="height: 3px; width: 5px;"></div>
                        <div style="width: 100%;"><span class="paper_abstract" v-html="paper.abstract"></span></div>
                        <div style="height: 3px; width: 5px;"></div>
                        <div class="label_box">
                            <span v-for="label in paper.labels" class="label_class"
                                @click="router.push('/concept/' + label.id)">
                                <font-awesome-icon :icon="['fas', 'tags']" /> {{ label.name }}
                            </span>
                        </div>
                        <div style="height: 6px; width: 5px;"></div>
                        <div style="width: 100%;">
                            <span class="to_cite" @click="showCollectionDialog(paper)"><font-awesome-icon
                                    :icon="['fas', 'star']" style="margin-right: 2px;" />收藏</span>
                            <span class="to_cite" @click="isDialogVisible = true; cited_paper = paper"><font-awesome-icon :icon="['fas', 'quote-right']"
                                    style="margin-right: 2px;" />引用</span>
                            <span class="paper_cite">被引用次数：{{ paper.cite_num }}</span>
                        </div>
                    </div>
                    <el-pagination v-if="paperLength > pageSize" v-model:current-page="currentPage"
                        :page-size="pageSize" :total="paperLength" @current-change="handlePageChange"
                        layout="prev, pager, next, jumper, total" class="page_trans" />
                    <div style="height: 60px; width: 5px;"></div>
                </div>
            </div>
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
                    <el-button type="primary" @click="confirmCollection" :disabled="selectedFolders.length === 0">
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
                    <el-input v-model="newFolderForm.description" type="textarea" placeholder="请输入收藏夹描述"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="newFolderDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmCreateFolder" :disabled="!newFolderForm.name">确定</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="isDialogVisible" title="BibTeX" width="30%">
            <el-input type="textarea" :value="bibtexData()" readonly :rows="10" class="bibtex-content"></el-input>
            <template #footer>
                <el-button @click="copyToClipboard">复制到剪切板</el-button>
                <el-button @click="isDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="superjie" title="高级搜索优先级解释" width="30%">
            <!-- <el-input type="textarea" :value="bibtexData()" readonly :rows="10" class="bibtex-content"></el-input> -->
            <span style="width: 100%; text-align: center;">例如以下的搜索会搜到以下集合</span>
            <img src="../assets/image/super1.png" style="width: 80%; margin-left: 10%;">
            <img src="../assets/image/super2.png" style="width: 80%; margin-left: 10%;">
            <template #footer>
                <el-button @click="superjie = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">

class SingleFilter {
    public type: string; // 0 And, 1 Or, 2 Not
    public static types: string[] = ["AND", "OR", "NOT"];
    public choose: string; // 0 篇名, 1 作者, 2 篇关摘
    public static chooses: string[] = ["篇名", "作者", "篇关摘"];
    public accurate: string;
    public static accurates: string[] = ["精确", "模糊"];
    public content: string;

    constructor(type: string, choose: string, accurate: string, content: string) {
        this.type = type;
        this.choose = choose;
        this.content = content;
        this.accurate = accurate;
    }
}

class Filter {
    public singleFilters: SingleFilter[];
    public searchForm = [new Date(2018, 0, 1), new Date(2024, 11, 31)];

    constructor() {
        this.singleFilters = [new SingleFilter("AND", "篇名", "精确", "")];
    }
}
</script>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { PaperInfo, Tag, Query4Work } from '@/utils/paperClasses.vue';
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuoteRight, faTags, faStar } from '@fortawesome/free-solid-svg-icons';
import { searchWorksQuick, postTime } from '@/apis/search';
import topBar from '@/components/topBar.vue';
import router from '@/router/index';
import { ElLoading } from 'element-plus'
import { addCollection, getCollectionFolders, createCollectionFolder } from '@/apis/collection';
import { getUserId } from '@/http/cookie';
import { ElMessage } from 'element-plus';
import { removeHtml } from '@/utils/stringProcessor';

import { useRoute } from 'vue-router';
import { ElDialog, ElTag, ElInput, ElButton } from 'element-plus';

defineComponent({
    components: {
        ElDialog,
        ElTag,
        ElInput,
        ElButton
    }
});
let cited_paper: PaperInfo;
const bibtexData = () => {
    return `@article{${parseBibName()},
  author = {${parseBibAuthor()}},
  title = {${parseBibTitle()}},
  journal = {${parseBibJournal()}},
  year = {${parseBibYear()}},
  doi = {${parseBibDoi()}}
}`;
}

function parseBibName(){
    if(!cited_paper){
        return "暂无";
    }
    let author_bib = '';
    if(cited_paper.authors.length > 0){
        author_bib = cited_paper.authors[0].name.split(' ')[0];
    }
    return parseBibTitle().split(' ')[0] + author_bib + parseBibYear();
}

function parseBibJournal(){
    if(!cited_paper){
        return "暂无";
    }
    return cited_paper.journal ? cited_paper.journal : "暂无";
}

function parseBibDoi(){
    if(!cited_paper){
        return "暂无";
    }
    return cited_paper.doi ? cited_paper.doi : "暂无";
}

function parseBibYear(){
    if(!cited_paper){
        return "暂无";
    }
    return cited_paper.year ? cited_paper.year.getFullYear() : 2024;
}

function parseBibTitle(){
    if(!cited_paper){
        return "暂无";
    }
    return cited_paper.ori_title ? cited_paper.ori_title : "暂无";
}

function parseBibAuthor(){
    if(!cited_paper){
        return "test"
    }
    let authors = [];
    for(let author of cited_paper.authors){
        authors.push(author.name);
    }
    return authors.length > 0 ? authors.join(", ") : "暂无";
}

// 控制弹出框的显示状态
const isDialogVisible = ref(false);

// 复制到剪切板的函数
const copyToClipboard = async () => {
    if (navigator.clipboard && window.isSecureContext) {
        // 现代浏览器方案
        navigator.clipboard.writeText(bibtexData())
            .then(() => {
                ElMessage.success('复制成功！');
            })
            .catch(err => {
                fallbackCopyTextToClipboard(bibtexData());
            });
    } else {
        // 降级方案
        fallbackCopyTextToClipboard(bibtexData());
    }
};

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
            ElMessage.success('复制成功！');
        } else {
            ElMessage.error('复制失败，请手动复制');
        }
    } catch (err) {
        console.error('复制失败:', err);
        ElMessage.error('复制失败，请手动复制');
    }
}

let typeFilter = ref([true, true, true, true]);

const pageSize = ref(5);
let filter = ref(new Filter());

let paperLength = ref(0);
let start_year = ref(0);
let end_year = ref(2024);
let normal_empty = ref(false);
let super_empty = ref(false);
let cost_time = ref(-1);
let search_all = ref(false);
let superjie = ref(false);

const initials = [
    '按匹配程度递减',
    '按被引用量递减',
    '按被引用量递增',
    '按发表时间递减',
    '按发表时间递增',
]
const options = Array.from({ length: 5 }).map((_, idx) => ({
    value: `${idx}`,
    label: `${initials[idx % 10]}`,
}))
const value = ref(options[0].value);

watch(value, () => {
    getPapersOperation(0);
});

const collectionDialogVisible = ref(false);
const collectionFolders = ref([]);
const selectedFolders = ref([]);
const newFolderDialogVisible = ref(false);
const newFolderForm = ref({
    name: '',
    description: ''
});
let articleInfo: PaperInfo;

const showCollectionDialog = async (paper) => {
    try {
        if (getUserId() === undefined) {
            ElMessage.error('请先登录, 登录之后才能收藏文章');
            return;
        }
        collectionDialogVisible.value = true;
        articleInfo = paper;
        const response = await getCollectionFolders(getUserId());
        collectionFolders.value = response.data;
    } catch (error) {
        console.error('获取收藏夹失败：', error);
        ElMessage.error('获取收藏夹失败');
    }
}

const createNewFolder = () => {
    newFolderDialogVisible.value = true;
}

const confirmCollection = async () => {
    if (selectedFolders.value.length === 0) {
        return;
    }
    if (!articleInfo) {
        return;
    }

    try {
        // 将作者数组转换为逗号分隔的字符串
        let authors = [];
        for (let author of articleInfo.authors) {
            authors.push(removeHtml(author.name));
        }
        let authorsString = authors.join(", ");

        // 遍历选中的收藏夹，添加文章
        const response = await addCollection(getUserId(), articleInfo.id, selectedFolders.value,
            removeHtml(articleInfo.title), authorsString, articleInfo.journal,
            articleInfo.cite_num, articleInfo.year);


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
    } catch (error) {
        console.error('添加到收藏夹失败：', error);
        ElMessage.error('添加到收藏夹失败');
    }
}

const confirmCreateFolder = async () => {
    if (!newFolderForm.value.name.trim()) {
        ElMessage.warning('收藏夹名称不能为空');
        return;
    }

    try {
        await createCollectionFolder(
            getUserId(),
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
        const response = await getCollectionFolders(getUserId());
        collectionFolders.value = response.data;

    } catch (error) {
        console.error('创建收藏夹失败：', error);
        ElMessage.error('创建收藏夹失败，请稍后重试');
    }
};

const route = useRoute();
let str = route.query.str as string;
if (str == null || str == undefined || str.length == 0) {
    str = "default";
}
let input = ref(str);
let search_type = route.query.type as string;
if (search_type == null || search_type == undefined || search_type.length == 0) {
    search_type = "0";
}
let searchType = parseInt(search_type);

let page_tmp = route.query.page as string;
if (page_tmp == null || page_tmp == undefined || page_tmp.length == 0) {
    page_tmp = "1";
}
let currentPage = ref(parseInt(page_tmp));;
let firstInPage = true;

let parpers = ref([]);

let realQuery: string = input.value;
let realjson;


async function getPapersOperation(type: number) {
    console.log(value.value);
    const loadingInstance1 = ElLoading.service({ fullscreen: true })
    try {
        let must = [];
        let should = [];
        let must_not = [];
        if (type == 1) {
            if (!firstInPage) {
                currentPage.value = 1;
            }
            firstInPage = false;
            let start: number = start_year.value;
            if (start < 1000) {
                start = 1000;
            }
            if (start > 9999) {
                start = 9999;
            }
            let end: number = end_year.value;
            if (end < 1000) {
                end = 1000;
            }
            if (end > 9999) {
                end = 9999;
            }
            let dateFilter = {
                "range": {
                    "publishTime": {
                        "gte": `${start}-01-01`,
                        "lte": `${end}-12-31`,
                        "format": "yyyy-MM-dd"
                    }
                }
            }
            must.push(dateFilter);
            if (typeFilter.value[3]) {
                let querys = [];
                if (!typeFilter.value[0]) {
                    querys.push("article");
                }
                if (!typeFilter.value[1]) {
                    querys.push("book");
                }
                if (!typeFilter.value[2]) {
                    querys.push("dataset");
                }
                if (querys.length > 0) {
                    must_not.push(new Query4Work(Query4Work.type_fields, querys.join(" OR ")).toJson());
                }
            }
            else {
                let querys = [];
                if (typeFilter.value[0]) {
                    querys.push("article");
                }
                if (typeFilter.value[1]) {
                    querys.push("book");
                }
                if (typeFilter.value[2]) {
                    querys.push("dataset");
                }
                if (querys.length > 0) {
                    must.push(new Query4Work(Query4Work.type_fields, querys.join(" OR ")).toJson());
                }
            }
        }
        if (searchType == 0) {
            if (type == 1) {
                realQuery = input.value;
                router.push({
                    path: '/search',
                    query: {
                        ...route.query, // 保留原有的查询参数
                        str: realQuery
                    }
                });
                let search: Query4Work;
                if(search_all.value){
                    search =  new Query4Work(Query4Work.all_fields, realQuery);
                }
                else{
                    search =  new Query4Work(Query4Work.default_fields, realQuery);
                }
                must.push(search.toJson())
                let json = {
                    must: must,
                    must_not: must_not,
                };
                realjson = json;
            }
            if (realQuery.length == 0) {
                normal_empty.value = true;
                setTimeout(function () {
                    normal_empty.value = false;
                }, 2000);
            }
            else {
                console.log("json: ", realjson);
                let response = await searchWorksQuick(realjson, (currentPage.value - 1) * pageSize.value, value.value);
                paperLength.value = response.hits.total.value;
                cost_time.value = response.took;
                parpers.value = [];
                for (let each of response.hits.hits) {
                    parpers.value.push(new PaperInfo(each, realQuery, search_all.value));
                }
                filte_papers();
            }
        }
        else {
            if (type == 1) {
                let myFilter: Filter = filter.value;
                for (let singleFilter of myFilter.singleFilters) {
                    if (singleFilter.content.length == 0) {
                        super_empty.value = true;
                        setTimeout(function () {
                            super_empty.value = false;
                        }, 2000);
                    }
                    let type: string[];
                    if (singleFilter.choose == "篇名") {
                        type = Query4Work.title_fields;
                    }
                    else if (singleFilter.choose == "作者") {
                        type = Query4Work.author_fields;
                    }
                    else {
                        type = Query4Work.default_fields;
                    }
                    if (singleFilter.type == "AND") {
                        must.push(new Query4Work(type, singleFilter.content, singleFilter.accurate).toJson());
                    }
                    else if (singleFilter.type == "OR") {
                        should.push(new Query4Work(type, singleFilter.content, singleFilter.accurate).toJson());
                    }
                    else {
                        must_not.push(new Query4Work(type, singleFilter.content, singleFilter.accurate).toJson());
                    }
                }
                let json;
                if (should.length > 0) {
                    json = {
                        must: must,
                        should: should,
                        must_not: must_not,
                        minimum_should_match: 1
                    }
                }
                else {
                    json = {
                        must: must,
                        should: should,
                        must_not: must_not
                    }
                }
                realjson = json;
            }
            let response = await searchWorksQuick(realjson, (currentPage.value - 1) * pageSize.value, value.value);
            paperLength.value = response.hits.total.value;
            cost_time.value = response.took;
            parpers.value = [];
            for (let each of response.hits.hits) {
                parpers.value.push(new PaperInfo(each));
            }
            parpers.value.sort((a, b) => a.rank - b.rank);
            filte_papers();
        }
        router.push({
            path: '/search',
            query: {
                ...route.query,
                page: currentPage.value,
            }
        });
        loadingInstance1.close();
        let res = await postTime({
            value: cost_time.value
        });
        console.log(res);
        // paperTypes.value = [];
        // paperTypes.value.push(new PaperType(0, parpers.value));
        // paperTypes.value.push(new PaperType(1, parpers.value));
        // paperTypes.value.push(new PaperType(2, parpers.value));
        // paperTypes.value.push(new PaperType(3, parpers.value));
        // paperFroms.value = [];
        // paperFroms.value.push(new PaperFrom(0, parpers.value));
        // paperFroms.value.push(new PaperFrom(1, parpers.value));
        // paperFroms.value.push(new PaperFrom(2, parpers.value));
        // filte_papers();
    } catch (error) {
        loadingInstance1.close();
        console.error(error);
    }
}

function highlightedText(text: string, keyword: string) {
    let keywords: string[] = keyword.split(/\s+/);
    const escapedKeywords = keywords.map((kw) =>
        kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    );
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
    return text.replace(regex, '<span style="color: red;">$1</span>');
}

if (searchType != 1) {
    getPapersOperation(1);
}

function goDetail(id: number) {
    window.open(`/article/${id}`);
}
function gotoAuthor(id) {
    window.open(`/scholar/${id}`);
}
function gotoSchool(id) {
    window.open(`/institution/${id}`);
}
function add(index: number) {
    filter.value.singleFilters.splice(index + 1, 0, new SingleFilter("AND", "篇名", "精确", ""));
}
function remove(index: number) {
    filter.value.singleFilters.splice(index, 1);
}

library.add(faQuoteRight);
library.add(faTags);
library.add(faStar);

function resetFilter() {
    // todo: 将筛选条件重置
    start_year.value = 0;
    end_year.value = 2024;
    for (let i: number = 0; i < 4; i++) {
        typeFilter.value[i] = true;
    }
    getPapersOperation(1);
}

defineComponent({
    components: {
        FontAwesomeIcon,
        topBar,
    }
});

let fromFilter = ref([true, true, true]);
watch(
    fromFilter,
    () => {
        filte_papers();
    },
    { deep: true }
);

let filtered_papers = ref([]);
const filte_papers = () => {
    filtered_papers.value = [];
    for (let paper of parpers.value) {
        // if (typeFilter.value[paper.type] && fromFilter.value[paper.journal_type]) {
        filtered_papers.value.push(paper);
        // }
    }
}

const paginatedPapers = computed(() => {
    return filtered_papers.value;
});

const handlePageChange = (page: number) => {
    currentPage.value = page;
    getPapersOperation(0);
};

</script>

<style scoped>
.el-switch__inner .is-text{
    font-size: 15px !important;
}

.bibtex-content {
    width: 100%;
    font-family: monospace;
}

.collect_button {
    width: 50px;
}

.custom-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    margin-top: 10px;
    margin-right: 20px;
    margin-left: 20px;
}

.new-tag-input {
    flex: 1;
    max-width: 100px;
}

.search_outer_teshu {
    background-color: rgb(244, 245, 247);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}

.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper {
    border: none !important;
    box-shadow: none !important;
}

/* .el-button {
    padding: 0px 0px !important;
} */

.super-search {
    width: 60%;
    margin-left: 16%;
    margin-top: 40px;
    margin-bottom: 30px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 20px 70px;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.addSubButton {
    display: inline-block;
    justify-content: center;
    border-radius: 50%;
    padding: 0px 0px !important;
    width: 32px;
    height: 32px;
    font-size: 20px;
}

.filter {
    margin: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.up_date {
    font-size: 14px;
    color: grey;
    margin-right: 20px;
    margin-top: 5px;
    margin-left: 30px;
}

.el-icon--search {
    font-size: 20px;
    color: #eeeeee;
}

.year_and_pub {
    font-size: 13px;
    font-weight: 500;
    color: rgb(81, 81, 81);
}

.sort-title {
    float: right;
    margin-right: 20px;
}

.type-title {
    font-size: 15px;
}

.year-title {
    font-size: 15px;
}

.year-input {
    width: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    transition: border-color 0.3s ease;
    text-align: center;
    padding: 1px;
    margin-top: 1px;
    color: #007bff;
}

.year-input:hover {
    border-color: #888;
}

.year-input:focus {
    border-color: #007bff;
    outline: none;
}

.year-input {
    border-color: #d9d9d9;
}

.background {
    width: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: 3fr 7fr;
}

.grid-item {
    padding: 20px;
    display: flex;
    justify-content: center;
}

.filter-title {
    width: 60%;
    font-size: 15px;
    color: rgb(100, 100, 100);
}

.filter-out {
    width: 100%;
    margin-left: 16%;
}

.paper-list-out {
    width: 90%;
    margin-right: 5%;
    height: auto;
}

.filter-body {
    width: 100%;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    display: flex;
    justify-content: center;
}

.filter-inner {
    width: 84%;
}

.paper_title {
    font-size: 19px;
    font-weight: 700;
}

.paper_author {
    margin-right: 5px;
    color: rgb(0, 149, 186);
    font-size: 14px;
    font-weight: 500;
}

.paper_author:hover {
    cursor: pointer;
}

.year {
    font-size: 15px;
    font-weight: 500;
    color: rgb(103, 103, 103);
}

.paper_abstract {
    font-size: smaller;
    font-weight: 500;
}

.paper_cite {
    font-size: 13px;
    font-weight: 500;
    color: rgb(81, 81, 81);
}

.to_cite {
    font-size: 13px;
    font-weight: 500;
    color: rgb(81, 81, 81);
    margin-right: 20px;
}

.to_cite:hover {
    color: rgb(67, 67, 189);
    cursor: pointer;
}

.paper-item {
    padding: 15px 25px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    margin-bottom: 20px;
}

.page_trans {
    width: auto;
    display: flex;
    justify-content: center;
    background-color: rgb(244, 245, 247);
    color: black;
    border-radius: 2px;
    margin-top: 20px;
    padding: 5px 15px;
}

.label_class {
    border-radius: 5px;
    border: 1.5px solid rgb(62, 62, 62);
    padding: 2px 4px;
    font-size: 13px;
    margin-right: 10px;
    line-height: 2;
    color: rgb(62, 62, 62);
    white-space: nowrap;
}

.label_class:hover {
    cursor: pointer;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.guangbiao:hover {
    cursor: pointer;
}

.warning_empty {
    float: right;
    margin-right: 10px;
    font-size: 15px;
    color: red;
}

.warning_empty2 {
    float: right;
    margin-top: 5px;
    font-size: 15px;
    color: red;
}

.cost_time {
    margin-top: 50px;
    font-size: 20px;
    color: rgb(100, 100, 100);
}

.cost_shu {
    font-size: 24px;
    color: red;
}
</style>