<template >
  <div style="background-color: #f4f5f7; overflow: auto;">
    <topBar :opacity-value="opacityNum" style="width: 100%; height: 60px;"/>
    <div v-if="userInfo" class="personal-page">
      <header class="profile-header">
        <div class="header-content">
          <img :src="blankUser"
               alt="Profile Picture"
               class="profile-picture"
          />
          <div class="profile-info">
            <h1>{{ userInfo.name }}</h1>
            <p>
              <span>昵称: {{ userInfo.nickname }}</span>
            </p>
            <p>
              <span>邮箱: {{ userInfo.email }}</span>
            </p>
            <p>
              <span>注册日期: {{userInfo.createDate.split(" ")[0]}}</span>
            </p>
          </div>

          <div v-if="getUserId() == String(route.params.id)" class="header-button">
            <el-button style="width: 120px" v-if="!isScholar" @mouseenter="isHovered = false"
                       @mouseleave="isHovered = true" @click="toBeScholar">
              <img :src="mail"
                   style="width: 15px;
                          margin-right: 5px"
                   :class="{ 'blue-hover': isHovered }"
                   alt="mail"/>申请成为学者
            </el-button>
            <el-button v-else disabled>
              <img :src="check"
                   style="width: 15px;
                          margin-right: 5px"
                   :class="{ 'blue-hover': isHovered }"
                   alt="mail"/>已是学者
            </el-button>
          </div>
        </div>
      </header>

      <div class="grid-container">
        <div class="tab-pub">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="关注" name="first">
              <div class="scholar-grid">
                <person-card v-for="scholar in scholars" :scholar="scholar">
                </person-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="收藏" name="second">
              <div class="collection-grid">
                <div v-for="collection in collectionsInfo">
                  <collection-card
                                   :collection="collection"
                                   @click="seeFolder(collection)"
                  >
                  </collection-card>
                  <div class="button-container">
                    <el-button v-if="isDelete" style="margin-top: 5px" size="small" type="danger" @click="deleteCollection(collection)">删除</el-button>
                  </div>
                </div>
                <el-dialog
                    v-if="FolderInfo != null"
                    v-model="openFolder"
                    :title="FolderInfo.fname"
                    width="875"
                    align-center
                >
                  <span>{{FolderInfo.description}}</span>
                  <paper-table4-collection :pubs="FolderWorks"></paper-table4-collection>
                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="openFolder = false;FolderInfo = null;FolderWorks = null">取消</el-button>
                    </div>
                  </template>
                </el-dialog>
              </div>
              <el-row v-if="getUserId() == String(route.params.id)" style="margin-top: 20px" type="flex" justify="end">
                <el-button v-if="deleteText == '删除收藏夹'" type="danger" @click="changeDeleteState">{{ deleteText }}</el-button>
                <el-button v-if="deleteText == '取消删除'" type="primary" @click="changeDeleteState">{{ deleteText }}</el-button>
              </el-row>
            </el-tab-pane>

            <el-tab-pane v-if="isMyself" label="历史记录" name="third">
              <paper-table4-history v-if="historyPubs != null" :pubs="historyPubs"></paper-table4-history>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="citation">
          <div v-if="!isMyself" style=" margin-bottom: -10px;padding: 15px">
            <el-button type="primary" plain style="width: 240px; display: flex;margin: auto" @click="goMyself">
              去往我的主页
            </el-button>
          </div>
          <div v-else class="selfie">
            <div style="margin: auto">
              <h2 style="margin: auto;margin-bottom:-10px;padding: 10px">个人资料</h2>
              <div style="margin: auto;line-height: 2; padding: 20px">
                <span v-if="isScholar">姓名：{{ authorInfo.name }}</span>
                <span v-else>姓名：待认证为学者</span>
                <br/>
                <span>用户名：{{ userInfo.nickname }}</span>
                <br/>
                <span>邮箱：{{ userInfo.email }}</span>
                <br/>
                <span v-if="isScholar">机构：{{ authorInfo.organization_name }}</span>
                <span v-else>机构：待认证为学者</span>
                <br/>
                <el-button type="primary"
                           plain
                           @click="editProfile = true"
                           style="width: 100px; display: flex; margin: auto; margin-top:10px">
                  修改密码</el-button>
                <el-dialog
                    v-model="editProfile"
                    title="修改密码"
                    width="500"
                    align-center
                >
                  <el-form
                      ref="ruleFormRef"
                      style="max-width: 600px"
                      :model="ruleForm"
                      status-icon
                      :rules="rules"
                      label-width="auto"
                      class="demo-ruleForm"
                  >
                    <el-form-item label="密码" prop="pass">
                      <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                      <el-input
                          v-model="ruleForm.checkPass"
                          type="password"
                          autocomplete="off"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="resetForm(ruleFormRef);editProfile = false">取消</el-button>
                      <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确认
                      </el-button>
                    </div>
                  </template>
                </el-dialog>
              </div>
            </div>
          </div>

          <div v-if="!isScholar && isMyself" style="margin-top: -15px">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
              <h2 style="font-size: 22px">申请成为学者，获得更多内容！</h2>
            </div>
          </div>

          <div v-if="recommendScholars!=null" style="margin-top: -15px">
            <h2 style="margin: auto;padding: 20px">学者推荐</h2>
            <person-list :scholars="recommendScholars">
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
import PaperTable4History from "@/components/PersonalPage/paperTable4History.vue";

const deleteText = ref('删除收藏夹');
function changeDeleteState() {
  isDelete.value = !isDelete.value;
  deleteText.value = isDelete.value ? '取消删除' : '删除收藏夹';
}
async function deleteCollection(coll) {
  await deleteCollectionFolder(getUserId(), coll.fid).then(()=>{
    collectionsInfo.value = collectionsInfo.value.filter(item => item.fid !== coll.fid);
  })
}
const isDelete = ref(false);
import {getFolderContents, deleteCollectionFolder} from '@/apis/collection'
const openFolder = ref(false);
const FolderInfo = ref(null);
const FolderWorks = ref(null);

async function seeFolder(item: any) {
  FolderInfo.value = null;
  FolderWorks.value = null;
  const rtn = await getFolderContents(item.fid);
  if(rtn.code === 200){
    FolderWorks.value = rtn.data;
    openFolder.value = true;
    FolderInfo.value = item;
    console.log("folderInfo:", FolderInfo.value)
    console.log("folder:", FolderWorks.value);
  } else {
    ElMessage.error("服务器出错啦!");
  }
}

import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import check from '@/assets/icon/PersonalPage/check.svg'
const ruleFormRef = ref<FormInstance>()

const goMyself = () => {
  router.push("/person/"+getUserId()).then(() => {
    window.location.reload();
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


import {ElMessage} from "element-plus";

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

import PersonList from "@/components/PersonalPage/personList.vue";

const opacityNum = ref(1);
import TopBar from "@/components/topBar.vue";
import blankUser from "@/assets/icon/PersonalPage/blankUser.png"
const scholars = ref(null);

const isScholar = ref(true);
const isMyself = ref(true);

function toBeScholar() {
  window.location.href = '/applySettle';
}



import PaperTable from "@/components/PersonalPage/paperTable.vue";
import PaperTable4Collection from "@/components/PersonalPage/paperTable4Collection.vue";
import mail from "@/assets/icon/PersonalPage/mail.svg"

import {onMounted, nextTick} from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

const collectionsInfo = ref(null);
const activeName = ref('first');
const isHovered = ref(true);
const institution1 = ref('null');

const historyPubs = ref(null);
import { ToolboxComponent } from 'echarts/components';
echarts.use([ToolboxComponent]);

import { followersApi, changeProfileApi, changePwdApi } from "@/apis/user.js";
import { userDetailsApi, getHistory } from '@/apis/user.js';
import { useRoute, useRouter } from "vue-router";
import PersonCard from "@/components/PersonalPage/personCard.vue";

const router = useRouter();
const route = useRoute();
const userInfo = ref(null);

import { getUserId, getUserAuthorId } from '@/http/cookie'
import { getCollectionFolders } from '@/apis/collection';
import CollectionCard from "@/components/PersonalPage/collectionCard.vue";
const authorInfo = ref(null);
onMounted(async () => {
  const id = Number(route.params.id);
  const rtn = await userDetailsApi(id);
  console.log("userInfo:", rtn);
  isMyself.value = (getUserId() == id);
  if(rtn.code === 200){
    userInfo.value = rtn.data;
    isScholar.value = (userInfo.value.role === 1);
  } else {
    await router.push('/error')
  }

  const rtnFollows = await followersApi(id);
  if(rtnFollows.code === 200){
    scholars.value = rtnFollows.data;
    console.log("follows", rtnFollows.data);
  } else {
    // TODO
  }

  const rtnCollections = await getCollectionFolders(id);
  if(rtnCollections.code === 200){
    collectionsInfo.value = rtnCollections.data;
    console.log("collections", rtnCollections.data);
  } else {
    // TODO
  }

  const rtnHistoryPubs = await getHistory(id);
  if(rtnHistoryPubs.code === 200){
    historyPubs.value = rtnHistoryPubs.data.reverse();
    console.log("historyPubs", rtnHistoryPubs.data);
  }

  if(isScholar.value){
    const rtnAuthInfo = await getAuthorInfo(getUserAuthorId());
    console.log(rtnAuthInfo)
    authorInfo.value = rtnAuthInfo.hits.hits[0]._source
  }

  const iii = await randomScholars(5);
  recommendScholars.value = iii.data.content;
  console.log(recommendScholars.value)

})
import {getAuthorInfo} from '@/apis/search';
const recommendScholars = ref(null);
import {randomScholars} from '@/apis/user';

</script>


<style>

.button-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  width: 100%; /* 确保按钮容器占满宽度 */
}
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

.collection-grid {
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

