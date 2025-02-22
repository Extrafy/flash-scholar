<template>
    <div class="background">
        <div class="table_out" :style="{ height: `${totalHeight + 71}px` }">
            <div style="height: 1px; width: 5px;"></div>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="热门文献" name="first" class="top_font">

                </el-tab-pane>
                <el-tab-pane label="推荐文献" name="second" class="top_font">

                </el-tab-pane>
                <div v-for="(paper, index) in paper_list" :key="paper" class="scrollbar-demo-item" ref="papers">
                    <div style="width: 100%;"><span class="paper_title" @click="gotoPaper(index)">{{ paper.title }}</span></div>
                    <div style="height: 6px; width: 5px;"></div>
                    <div style="width: 100%;"><span class="paper_author" v-for="(author, index) in paper.authors" @click="gotoPersonPage(author.id)">{{
                        author.name }}
                            <span v-if="index !== paper.authors.length - 1"
                                style="color: rgb(81, 81, 81);">/</span></span> <span class="year">·</span> <span
                            class="year">{{
                                paper.year.getFullYear() }}</span></div>
                    <div style="height: 6px; width: 5px;"></div>
                    <div style="width: 100%;"><span class="paper_abstract">{{ paper.abstract }}</span></div>
                    <div style="height: 6px; width: 5px;"></div>
                    <div style="width: 100%;">
                        <span class="to_cite" @click="isDialogVisible = true; cited_paper = paper"><font-awesome-icon :icon="['fas', 'quote-right']"
                             style="margin-right: 2px;" />引用</span>
                        <span class="paper_cite">被引用次数：{{ paper.cite_num }}</span>
                    </div>
                    <div v-if="index !== paper_list.length - 1" style="width: 100%; height: 1.5px; background-color: rgba(107, 119, 140, 0.2); 
                        margin-top: 15px; margin-bottom: 10px;"></div>
                </div>
            </el-tabs>
        </div>
        <div style="height: 30px; width: 5px;"></div>
        <el-dialog v-model="isDialogVisible" title="BibTeX" width="30%">
            <el-input type="textarea" :value="bibtexData()" readonly :rows="10" class="bibtex-content"></el-input>
            <template #footer>
                <el-button @click="copyToClipboard">复制到剪切板</el-button>
                <el-button @click="isDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { getRandomWork } from '@/apis/search';
import { PaperInfo } from '@/utils/paperClasses.vue'
import { ElDialog } from 'element-plus';
import { ElMessage } from 'element-plus';

library.add(faQuoteRight);

defineComponent({
    components: {
        FontAwesomeIcon,
        ElDialog
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

const activeName = ref('first')

let hot_paper_list = ref([])

let recomment_paper_list = ref([])

let paper_list = ref([]);
const gotoPaper = async (index) => {
    // console.log(paper_list.value[index]);
    window.open(`/article/${paper_list.value[index].id}`);
}
const gotoPersonPage = async (id) => {
    // console.log(paper_list.value[index].authors[index1].id)
    window.open(`/scholar/${id}`);
}

async function getPapersOperation() {
    try {
        let data = await getRandomWork();
        hot_paper_list.value = [];
        for (let each of data.hits.hits) {
            console.log(each)
            hot_paper_list.value.push(new PaperInfo(each));
        }
        let data2 = await getRandomWork();
        recomment_paper_list.value = [];
        for (let each of data2.hits.hits) {
            recomment_paper_list.value.push(new PaperInfo(each));
        }
        paper_list.value = hot_paper_list.value;
        const observer = new ResizeObserver(() => {
            totalHeight.value = papers.value.reduce((sum, div) => sum + div.offsetHeight + 10, 0);
        });

        nextTick(() => {
            papers.value.forEach((div) => observer.observe(div));
        });
    } catch (error) {
        console.error(error);
    }
}

getPapersOperation();

const handleClick = (tab, event) => {
    if (tab.index == 0) {
        paper_list.value = hot_paper_list.value;
    }
    else {
        paper_list.value = recomment_paper_list.value;
    }
    const observer = new ResizeObserver(() => {
        totalHeight.value = papers.value.reduce((sum, div) => sum + div.offsetHeight + 10, 0);
    });
    papers.value.forEach((div) => observer.observe(div));
}

const papers = ref([]);
const totalHeight = ref(0);
onMounted(() => {
    paper_list.value = recomment_paper_list.value;
    const observer = new ResizeObserver(() => {
        totalHeight.value = papers.value.reduce((sum, div) => sum + div.offsetHeight + 10, 0);
    });
    papers.value.forEach((div) => observer.observe(div));
});
</script>

<style>
.el-tabs__item {
    font-size: 16px !important;
    font-weight: 600 !important;
}
</style>

<style scoped>
.bibtex-content {
    width: 100%;
    font-family: monospace;
}

.background {
    width: 100%;
    position: absolute;
}

.table_out {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    width: 70%;
    margin-left: 15%;
    margin-top: 100px;
}

.demo-tabs {
    margin-top: 6px;
    margin-left: 2%;
    width: 96%;
}

.paper_title {
    font-size: 19px;
    font-weight: 700;
}
.paper_title:hover {
    cursor: pointer;
}

.paper_author {
    margin-right: 5px;
    color: rgb(0, 149, 186);
    font-size: 15px;
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
    margin-left: 20px;
}

.to_cite {
    font-size: 13px;
    font-weight: 500;
    color: rgb(81, 81, 81);
}

.to_cite:hover {
    color: rgb(67, 67, 189);
    cursor: pointer;
}
</style>
