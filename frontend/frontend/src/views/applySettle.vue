<template>
    <div class="rootBlock">
        <div class="top-bar">
            <!-- 这里存放topbar -->
            <top-bar></top-bar>
        </div>
        <div class="outer-step-table">
            <div class="step-table">
                <div class="steps">
                    <el-steps style="max-width: 100%" :active="stepActive" finish-status="success" align-center>
                        <el-step title="个人信息" icon="Edit" v-if="stepActive == 0" />
                        <el-step title="个人信息" icon="Check" v-if="stepActive > 0" />
                        <el-step title="选择认证学者" icon="DocumentAdd" v-if="stepActive <= 2" />
                        <el-step title="选择认证学者" icon="Check" v-if="stepActive > 2" />
                        <el-step title="完成" icon="Check" />
                    </el-steps>
                </div>
                <div v-if="stepActive == 0" class="firstTable">
                    <el-form :label-position="left" label-width="28%" v-if="stepActive == 0">
                        <el-form-item label="姓名" label-position="left" class="form-item-label">
                            <el-input v-model="personalForm.name" />
                        </el-form-item>
                        <el-form-item label="所属机构" label-position="left" class="form-item-label">
                            <el-input v-model="personalForm.organization" />
                        </el-form-item>
                        <el-form-item label="电子邮箱" label-position="left" class="form-item-label">
                            <el-input v-model="personalForm.email" />
                        </el-form-item>
                        <el-form-item label="研究领域" label-position="left" class="form-item-label">
                            <el-input v-model="personalForm.field" />
                        </el-form-item>
                        <!-- <el-form-item label="个人首页 (可选)" label-position="left" class="form-item-label">
                            <el-input v-model="personalForm.homepage" />
                        </el-form-item> -->
                    </el-form>
                    <el-button type="primary" @click="nextStep" v-if="stepActive == 0">下一步</el-button>
                </div>
                <div v-if="stepActive == 1" class="secondTable">
                    <div><el-text size="large">已根据您的姓名，检索出 </el-text>
                        <el-text type="primary" size="large">{{ groupNum }}</el-text>
                        <el-text size="large"> 名学者，请选择:</el-text>
                        
                        <el-button type="primary" @click="submitAndNext" id="secondButton">确定</el-button>
                        <el-button type="primary" @click="goUpStep" id="thirdButton">上一步</el-button>
                    </div>
                    <div class="wrapPassageGroup">
                        <el-collapse v-model="activeNames" accordion>
                            <el-radio-group v-model="checkedId">
                            <el-collapse-item v-for="(group, index1) in groupList" :key="index1">
                                <template #title>
                                    <el-radio :value="index1" size="large" style="font-weight: bold;">{{ (1+index1)+'. '+personalForm.name }}
                                    </el-radio>
                                    
                                    <!-- <el-checkbox :label="(1+index1)+'. '+personalForm.name" :ischecked="true" size="large"
                                        style="font-weight: bold;" /> -->
                                    <!-- <el-text size="large"> {{ personalForm.name }}</el-text> -->
                                    <el-text size="middle"  v-if="authors.length>index1 && authors[index1]._source.organization_name!=null"> {{ authors[index1]._source.organization_name}}</el-text>
                                </template>
                                <template #icon="{ isActive }">
                                    <span class="icon-ele">
                                        {{ isActive ? 'Expanded' : 'Collapsed' }}
                                    </span>
                                </template>
                                <div>
                                    <el-collapse v-model="activeNames" style="margin-left: 30px;">

                                        <el-collapse-item v-for="(item, index2) in group" :key="index2"
                                             :name="index2" >
                                            <template #title v-if="item && item._source && item._source.title">
                                                <span style="font-weight: bold;font-size: 14px;" >{{ index2 + 1 }}.
                                                    {{ item._source.title }}</span>
                                            </template>
                                            <div style="margin-left:15px;font-size:13px;" v-if="item && item._source && item._source.abstracts">{{  truncString(item._source.abstracts,180) }}</div>
                                        </el-collapse-item>

                                    </el-collapse>
                                </div>
                            </el-collapse-item>
                        </el-radio-group>
                        </el-collapse>
                        
                    </div>

                </div>
                <div v-if="stepActive == 3" class="thirdTable">

                    <el-result icon="success" title="欢迎入驻" sub-title="您的申请将在3天内由管理员审核，请耐心等待">
                        <template #extra>
                            <el-button type="primary" @click="goBackMainPage">返回</el-button>
                        </template>
                    </el-result>

                </div>
            </div>
        </div>
    </div>
</template>

<script  lang="ts">
import topBar from '@/components/topBar.vue';
import { getUserId } from '@/http/cookie'
import { applyForScholar, getScholars } from '@/apis/applySettle'
import { searchAuthors , alexWorks} from '@/apis/search'
import {Query4Work} from '@/utils/paperClasses.vue'
import { searchWorks } from '@/apis/search';
import { ElMessage } from 'element-plus';
export default {
    components: { topBar },
    data() {
        return {
            stepActive: 0,
            personalForm: {
                name: "",
                organization: "",
                email: "",
                field: ""
            },
            groupNum: 3,
            activeNames: ["1"],
            authors: [],
            groupList: [
                [
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                  
                ],
                [
                {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                ], [
                {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                    {_source: {title: "Updatepreaasdf sdflakj  sladfkjas lkjlkj ljk", abstracts: "Shan She/Shan she/Muli/Zehuan"} },
                   
                ]

            ],
            checkedId: -1,
            img_url: "",
        };
    },
    methods: {
        nextStep() {
            this.stepActive += 1;
            //从第一步输入个人信息到第二步选择自己对应的学者，需要获取学者
            this.getScholarList();
        },
        goUpStep() {
            this.stepActive -=1;
        },
        goBackMainPage() {
            this.$router.go(-1);
        },
        submitAndNext() {
            if(this.checkedId==-1){
                
                ElMessage.error("请选择学者");
                return;
            }else{
                this.stepActive += 2;
            //先申请成为学者，
            this.applyScholar();
            }
        },
        applyScholar() {
            
            const info = {
                userId: getUserId(),
                authorId: this.authors[this.checkedId]._id,
                name: this.personalForm.name,
                orName: this.authors[this.checkedId]._source.organization_name==null?this.personalForm.organization:this.authors[this.checkedId]._source.organization_name,
                email: this.personalForm.email,
                area: this.personalForm.field,
            };
            applyForScholar(info)
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        getScholarList() {

            searchAuthors(this.personalForm.name)
                .then(async (res) => {
                    const tmp = res.hits.hits;
                    this.authors = [];
                    console.log(tmp);
                    let newGroup = [];
                    for(let i=0;i<tmp.length;i++){
                        
                        if(this.personalForm.organization == ""||this.personalForm.organization == null){//机构空
                            this.authors.push(tmp[i]);
                        }else{//机构非空，需要筛选出机构为空的，或者机构非空并且机构匹配的
                            if(tmp[i]._source.organization_name == null || this.strMatch(tmp[i]._source.organization_name, this.personalForm.organization)){
                                this.authors.push(tmp[i]);
                            }
                        }
                        
                    }
                    newGroup = await Promise.all(
                        this.authors.map(author => this.fromIdToPassages(author._id)));
                    // for(let i=0;i<this.authors.length;i++){
                    //     const auId = this.authors[i]._id;
                    //     let ret =await this.fromIdToPassages(auId);
                    //     newGroup.push(ret);
                    // }
                    console.log(this.authors);
                    this.groupList = newGroup;
                    this.$forceUpdate()
                    console.log(this.groupList);
                })
                .catch((err) => {
                    console.log(err);
                })

        },
        async fromIdToPassages(id){
            try{
                let search: Query4Work = new Query4Work(Query4Work.authorId_fields, id);
                let json = { must: [search.toJson()] }
                const response =  await searchWorks(json);
                
                const tmp = [];
                for(let i=0;i<response.hits.hits.length;i++){
                    tmp.push(response.hits.hits[i]);
                }
                console.log(tmp);
                return tmp;
            }
            catch(err){
                console.log(err);
                return [];//返回空数组防止错误
            }

            
            
        },
        truncString(str:String, max:number){
            return str.length > max ? str.substring(0,max)+"..." : str;
        },
        strMatch(str, substr){
            return new RegExp(substr,'i').test(str);
        },

    },
    computed: {
        groupNum() {
            return this.authors.length;
         },
        


    },

}
</script>
<style>
.el-collapse-item__header{
    height: auto !important;
    line-height: auto;
    text-align: left;
}
.el-radio-group{
    display: block !important;
}
</style>
<style scoped>
.rootBlock {
    width: 100%;
    height: 100%;
    overflow: auto;

}

.outer-step-table {
    padding-top: 50px;
    background-color: rgb(243, 245, 247);
    width: 100%;
    height: 100%;
}

.step-table {
    margin-top: 50px;
    margin-left: 100px;
    margin-right: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.steps {
    padding: 20px 10px;
    border-bottom: 1px solid #dcdfe6;
}

.firstTable {
    padding-top: 20px;
    padding-bottom: 15px;
    padding-left: 16%;
    padding-right: 30%;
}

.form-item-label {
    font-weight: bold;
}

#secondButton {
    margin-left: 10px;
    float: right;
}
#thirdButton{
    float: right;
}

.secondTable {
    margin-top: 20px;
    margin-bottom: 15px;
    margin-left: 15%;
    margin-right: 16%;
}

.wrapPassageGroup {
    margin-top: 20px;
}

.icon-ele {
    margin: 0 8px 0 auto;
    color: #409eff;
}
</style>
