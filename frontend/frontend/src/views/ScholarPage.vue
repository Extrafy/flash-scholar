<template>
  <div style="background-color: #f4f5f7; overflow: auto;">
    <topBar :opacity-value="opacityNum" style="width: 100%; height: 60px;"/>
    <div v-if="authorInfo" class="personal-page">
      <header class="profile-header">
        <div class="header-content">
          <img :src="profilePicture"
               alt="Profile Picture"
               class="profile-picture"
          />

          <div class="profile-info">
            <h1>{{ authorInfo.name }}</h1>
            <p><img :src="school"
                    style="width: 18px;
                          margin-right: 10px;
                          margin-bottom:-3px "
                    alt="school"/>

              <span v-if="authorInfo.organization_name != null">{{ authorInfo.organization_name }}</span>
              <span v-else>暂无机构信息</span>
            </p>
            <p><img :src="email_icon"
                    style="width: 18px;
                          margin-right: 10px;
                          margin-bottom:-3px "
                    alt="email"/>
              <span v-if="userInformation != null">{{ userInformation.email }}</span>
              <span v-else>学者暂未在平台注册</span>
            </p>
            <p><img :src="book"
                    style="width: 18px;
                          margin-right: 10px;
                          margin-bottom:-3px "
                    alt="book"/>
              <span>
                <template v-for="(interest, index) in researchInterests" :key="index">
                  <span style="color: #318ff1; cursor: pointer" @click="goToConcept(interest.id)"> {{ interest.name }} </span>
                  <span v-if="index < researchInterests.length - 1"> / </span>
                </template>
              </span>
            </p>
          </div>

          <div class="header-button">
            <el-button v-if="getUserRole() == 1 && (getUserAuthorId() == String(route.params.id))"
                       @mouseenter="isHovered = false"
                       @mouseleave="isHovered = true"
                       @click ="handleGetWork(authorInfo.name)">
              <img :src="mail"
                   style="width: 15px;
                          margin-right: 5px"
                   :class="{ 'blue-hover': isHovered }"
                   alt="mail"/>认领
            </el-button>
            <div v-else-if="isFollow != null">
              <el-button v-if="!isFollow"
                         @mouseenter="isHovered = false"
                         @mouseleave="isHovered = true"
                         @click="follow()">
                <img :src="mail"
                     style="width: 15px;
                            margin-right: 5px"
                     :class="{ 'blue-hover': isHovered }"
                     alt="mail"/>关注
              </el-button>
              <el-button v-else type="primary" @click="unfollow()">
                已关注
              </el-button>
            </div>

            <el-dialog
                v-model="getWorkFlag"
                title="认领文章"
                width="875"
                align-center
            >
              <paper-table4-get v-if="sameNameWorks != null" :pubs="sameNameWorks" :author="authorInfo.name"></paper-table4-get>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="getWorkFlag = false;">取消</el-button>
                </div>
              </template>
            </el-dialog>

          </div>
        </div>
      </header>

      <div class="grid-container">
        <div class="tab-pub">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="发表文献" name="first">
              <paper-table v-if="publications != null" :pubs="publications"></paper-table>
            </el-tab-pane>

            <el-tab-pane v-if="publications != null" label="专家关系网络" name="second"  >
              <div style="padding: 10px">
                <div v-if="graphData != null" id="rel_chart" style="width: 680px;
                                           height: 580px;
                                           margin: auto;
                                           padding: 10px;
                                           box-shadow:0 0 10px rgba(0, 0, 0, 0.1);"></div>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>

        <div class="citation">
          <div style=" margin-bottom: -10px;padding: 15px">
            <el-button v-if="getUserAuthorId() == String(route.params.id)" type="primary" plain style="width: 300px; display: flex;margin: auto" @click="goToMyself">制作我的个人资料</el-button>
          </div>

          <div class="inner-citation">
            <div style="margin: auto">
              <h2 style="margin: auto;margin-bottom:-10px;padding: 10px">被引次数</h2>
              <el-table fit v-if="citeData.length != 0" :data="citeData" style="width: 100%; display: flex;margin: auto; padding: 10px">
                <el-table-column fit type="index" :label-class-name="'custom-label'" label="" width="160">
                  <template #default="scope">
                    <div style="display: flex; align-items: center">
                      <span style="margin-left: 10px">{{ content[scope.$index] }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fit prop="all" label="所有年份" width="88" />
                <el-table-column fit prop="since2019" label="自 2019" width="88" />
              </el-table>
            </div>
          </div>

          <div class="citation-bar-chart">
            <div id="bar_chart" style="width: 320px;
                                       height: 300px;
                                       margin-top: -40px;
                                       padding: 10px;
                                       "></div>

          </div>

          <div v-if="relatedScholars!=null" class="rel-scholars">
            <h2 style="margin: auto;padding: 20px">相关学者</h2>
            <person-list :scholars="relatedScholars">
            </person-list>
          </div>

        </div>
      </div>
      <br/>
      <br/>
      <br/>
    </div>

  </div>

</template>

<script setup lang="ts">
const userInformation = ref(null);

function goToMyself(){
  router.push(`/person/${getUserId()}`).then(()=>{
    window.location.reload();
  });
}
function goToConcept(concept) {
  window.open("/concept/" + concept)
}
const sameNameWorks = ref(null)
const getWorkFlag = ref(false);
import { getWorksFromAuthorName } from "@/apis/search"
async function handleGetWork(name){
  sameNameWorks.value = [];
  const rtnWorks = await getWorksFromAuthorName(name);
  console.log(rtnWorks)
  for(let work of rtnWorks){
    const i = {
      workId: work._source.workId,
      title: work._source.title,
      authors: work._source.authorDTOS.map(author=>author.authorName).join(', '),
      journal: work._source.institutionDTOS.map(inst=>inst.institutionName).join(', '),
      date:work._source.publishTime.split('-')[0],
      quoteTime:work._source.cited,
    }
    sameNameWorks.value.push(i);
  }
  console.log(sameNameWorks.value)
  getWorkFlag.value = true;
}
import {nextTick, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import PersonList from "@/components/PersonalPage/personList.vue";
import TopBar from "@/components/topBar.vue";
import scholar from '@/assets/icon/PersonalPage/scholar.svg'
import PaperTable from "@/components/PersonalPage/paperTable.vue";
import mail from "@/assets/icon/PersonalPage/mail.svg"
import email_icon from "@/assets/icon/PersonalPage/email.svg"
import school from "@/assets/icon/PersonalPage/school.svg"
import book from "@/assets/icon/PersonalPage/book.svg"
import * as echarts from 'echarts/core';
import {LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent} from 'echarts/components';
import {GraphChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {initRelChart} from "@/stores/PersonalPage/rel_chart.js";
import {initBarChart} from "@/stores/PersonalPage/bar_chart.js";
import {followHandler, checkFollowRel, changePwdApi, getAuthorInfo, userDetailsApi} from "@/apis/user.js";
import {useRoute, useRouter} from "vue-router";
import {alexWorksFast, alexAuthor, searchWorksByAuthorId} from '@/apis/search.js';
import {getUserRole, getUserAuthorId,getUserId} from '@/http/cookie'
import {Query4Author} from '@/utils/paperClasses.vue';
import PaperTable4Get from "@/components/PersonalPage/paperTable4Get.vue";

const ruleFormRef = ref<FormInstance>()
const isFollow = ref(null);
function follow(){
  followHandler(getUserId(), String(route.params.id), authorInfo.value.name, authorInfo.value.organization_name).then(()=>{
    isFollow.value = true;
  });
}

function unfollow(){
  followHandler(getUserId(), String(route.params.id), authorInfo.value.name, authorInfo.value.organization_name).then(()=>{
    isFollow.value = false;
  });
}

let ruleForm = reactive({
  pass: '',
  checkPass: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次密码不一致！"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})


const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      await changePwdApi(getUserId(), ruleForm.pass, ruleForm.checkPass).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '修改成功!',
            type: 'success',
          })
        } else {
          ElMessage.error('修改失败!')
        }
      })
      resetForm(formEl);
      editProfile.value = false;
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


const editProfile = ref(false);

const opacityNum = ref(1);
const scholars = ref(null);
const isMyself = ref(true);

function toBeScholar() {
  router.push("/applySettle").then(()=>{
    window.location.reload();
  });
}


const content = ['引用量','h_index']
const citeData = []

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

let graphData = ref(null);
const activeName = ref('first');
let rel_init_flag = true;
const handleClick = (tab) => {
  console.log(tab.props.name);
  if(tab.props.name === 'second' && rel_init_flag){
    nextTick(() => {
      // 在下一次 DOM 更新循环之后执行
      // 在这里调用你的函数
      if(authorInfo.value != null && publications.value != null) {
        rel_init_flag = false;
        initRelChart(graphData.value);
      }
    });
  }
};

const relatedScholars = ref(null)
function handleExpertNet(authorInfo, publications){
  const data = [];
  const nodeFather = {
    id: "0",
    authorId: authorInfo.id,
    name: authorInfo.name,
    symbolSize: 0,
    x: 0,
    y: 0,
    value: authorInfo.cited,
    category: 0,
  }
  data.push(nodeFather);

  let tmpCounter = [], i = 1;
  for(let authorship of publications.map(publication => publication.authorships)){
    for(let authorSelf of authorship){
      let ID = String(authorSelf.author.id);
      ID = ID.split("/").pop();
      if(ID != authorInfo.authorId){
        const existingAuthor = tmpCounter.find(author => author.authorId === ID);
        if (!existingAuthor) {
          tmpCounter.push({
            id: String(i),
            authorId: ID,
            name: authorSelf.author.display_name, // 假设 authorship 包含 name 属性
            institution: authorSelf.raw_affiliation_strings.length == 0?null:authorSelf.raw_affiliation_strings.pop(),
            symbolSize: 0,
            x: 0, // 随机位置
            y: 0,
            value: 1,
            category: 1 // 假设类别为 1
          });
          i++;
        } else {
          existingAuthor.value += 1;
        }
      }
    }
  }
  data.push(...tmpCounter.sort((a, b) => b.value - a.value).slice(0,30))
  scholars.value = tmpCounter.filter(a => a.id != "0").sort((a, b) => b.value - a.value).slice(0,8)
  relatedScholars.value = [];
  for(let sch of scholars.value){
    const ii = {
      id: sch.authorId,
      name: sch.name,
      organizationName: sch.institution,
    }
    relatedScholars.value.push(ii);
  }
  console.log(relatedScholars.value,"1232315143512341234")


  console.log(scholars.value)
  const net = [];
  for(let ii = 1; ii < i; ii++){
    net.push({
      source: String(ii),
      target: "0",
    })
  }

  const AB = [];
  AB.push({
    name: "A",
  },
  {
    name: "B",
  })

  return {
    nodes: data,
    links: net,
    categories: AB
  };
}

const isHovered = ref(true);
const profilePicture = ref(scholar);

const researchInterests = ref([]);

const publications = ref(null);
echarts.use([ToolboxComponent]);

const router = useRouter();
const route = useRoute();
const authorInfo = ref(null);
const userInfo = ref(null);


onMounted(async () => {
  const id = String(route.params.id);
  if(getUserId()){
    const followRtn = await checkFollowRel(getUserId(), id);
    if(followRtn.code === 200){
      isFollow.value = followRtn.data;
    }
  }

  if(id[0] === 'A'){
    let search: Query4Author = new Query4Author(Query4Author.id_fields, id);
    let json = {
      must: [
        search.toJson()
      ]
    }
    let response = await getAuthorInfo(json);
    if(response.hits.hits.length != 0){
      authorInfo.value = response.hits.hits[0]._source;
      console.log("es:",authorInfo.value)
      for(let field of authorInfo.value.fields.slice(0,5)){
        researchInterests.value.push(field);
      }
      console.log("concept",researchInterests.value)


      citeData.push(
          {
            all: Math.max(authorInfo.value.cited,authorInfo.value.counts_by_year.filter(citation => citation.year >= 2019).reduce((sum, citation) => sum + citation.cited, 0)),
            since2019: authorInfo.value.counts_by_year.filter(citation => citation.year >= 2019).reduce((sum, citation) => sum + citation.cited, 0)
          }
      )
      citeData.push(
          {
            all: authorInfo.value.h_index,
            since2019: '-',
          }
      )

      let rtn = await alexWorksFast(String(route.params.id));
      let rtn2 = await searchWorksByAuthorId(String(route.params.id));
      publications.value = rtn.results;
      for(let i of rtn2){
        if(!publications.value.some(exist => exist.id.split('/').pop() === i.id)){
          publications.value.push(i);
        }
      }
      console.log("publications:",publications.value);
      const dataX = authorInfo.value.counts_by_year.slice(0,7).reverse().map(count => count.year);
      const dataY = authorInfo.value.counts_by_year.slice(0,7).reverse().map(count => count.cited);
      if(dataX.length == 0){
        dataX.push(2018,2019,2020,2021,2022,2023,2024);
        dataY.push(0,0,0,0,0,0,0)
      }
      await initBarChart(dataX,dataY);
      graphData.value = handleExpertNet(authorInfo.value, publications.value);

    } else {
      authorInfo.value = {};
      let tmp = await alexAuthor(String(route.params.id));
      console.log("alex:",tmp);
      authorInfo.value.name = tmp.display_name;
      authorInfo.value.organization_name = tmp.last_known_institutions.length == 0? null : tmp.last_known_institutions.pop().display_name;
      authorInfo.value.authorId = tmp.id.split("/").pop();
      for(let field of tmp.x_concepts.slice(0,5)){
        const f = {
          id: field.id.split('/').pop(),
          name: field.display_name,
          level: field.level,
        }
        researchInterests.value.push(f);
      }
      console.log("concept",researchInterests.value)
      citeData.push(
          {
            all: tmp.cited_by_count,
            since2019: tmp.counts_by_year.filter(citation => citation.year >= 2019).reduce((sum, citation) => sum + citation.cited_by_count, 0)
          }
      )
      citeData.push(
          {
            all: tmp.summary_stats.h_index,
            since2019: '-',
          }
      )

      let rtn = await alexWorksFast(String(route.params.id));
      let rtn2 = await searchWorksByAuthorId(String(route.params.id));
      publications.value = rtn.results;
      for(let i of rtn2){
        if(!publications.value.some(exist => exist.id === i.id)){
          publications.value.push(i);
        }
      }
      console.log("publications:",publications.value);
      const dataX = tmp.counts_by_year.slice(0,7).reverse().map(count => count.year);
      const dataY = tmp.counts_by_year.slice(0,7).reverse().map(count => count.cited_by_count);
      if(dataX.length == 0){
        dataX.push(2018,2019,2020,2021,2022,2023,2024);
        dataY.push(0,0,0,0,0,0,0)
      }
      await initBarChart(dataX,dataY);
      graphData.value = handleExpertNet(authorInfo.value, publications.value);
    }

  }
  const rtnUseri = await getUserInfoByAuthorId(String(route.params.id));
  if(rtnUseri.data != -1){
    const rtnUser = await userDetailsApi(rtnUseri.data);
    userInformation.value = rtnUser.data;
    console.log(userInformation.value)
  }
});
import {getUserInfoByAuthorId} from '@/apis/user'
</script>


<style>
.custom-label {
  color: black;
  font-size: 20px; /* 根据需要调整字体大小 */
}
.tab-pub .el-tabs__item {
  font-size: 20px;
}
</style>

<style scoped>
.scholar-grid {
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: auto;
  align-items: center;
  gap: 10px;
}

.blue-hover {
  filter: grayscale(100%);
}

.demo-tabs {
  margin-top: -16px;
  padding: 32px;
  font-size: 16px;
  font-weight: 600;
}

.personal-page {
  width: 1350px;
  margin: auto;
  padding: 20px;
  height: 100vh;
  font-family: 'Microsoft YaHei', sans-serif; /* 设置全局字体为微软雅黑 */
}

.profile-header {
  background-color: white;
  padding: 15px;
  margin-top: -10px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
.header-content {
  align-items: center;
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 7fr 2fr; /* 左侧三份宽度，右侧一份宽度 */
  gap: 20px; /* 格子之间的间距 */
}

.profile-picture {
  grid-column: 1/2;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 20px;
  margin-right: 20px;

}

.profile-info{
  grid-column: 2/3;
}

.profile-info h1 {
  margin: 0;
  font-size: 24px;
}

.profile-info p {
  margin: 5px 0;
  font-size: 16px;
}

.header-button {
  grid-column: 3/4;
  align-content: center;
}

.grid-container {
  display: grid;
  grid-template-columns: 7fr 3fr; /* 左侧三份宽度，右侧一份宽度 */
  grid-template-rows: 1fr;
  gap: 20px; /* 格子之间的间距 */
  margin-bottom: 6vh;
}


.tab-pub {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}


.citation {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 10px;
  grid-row: 1 / 2; /* 从第二行开始到最后一行 */
  grid-column: 2 / 3;
}
.citation-bar-chart {
  width: 336px;
  margin: auto;
  background-color: white;
}

.inner-citation {
  background-color: white;
  padding: 10px;
  grid-row: 1 / 2; /* 从第二行开始到最后一行 */
  grid-column: 2 / 3;
}

.selfie {
  background-color: white;
  padding: 10px;
}

</style>

