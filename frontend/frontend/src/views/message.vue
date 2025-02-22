<template>
  <div class="message-body">
    <div class="message-topBar">
      <topBar :opacity-value="1" />
    </div>

    <div class="background">
      <div class="contain">
        <el-row style="width: 250px">
          <el-col>
            <el-menu
              default-active="2"
              class="menu"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-menu-item index="1">
                <el-icon><Promotion /></el-icon>
                <span style="font-weight: 1000; font-size: medium"
                  >消息中心</span
                >
              </el-menu-item>
              <el-menu-item index="2" @click="selectTitle = '系统通知'">
                <el-icon v-if="selectTitle === '系统通知'"
                  ><CaretBottom
                /></el-icon>
                <el-icon v-else><CaretRight /></el-icon>
                <span>系统通知</span>
              </el-menu-item>
              <el-menu-item index="3" @click="selectTitle = '回复我的'">
                <el-icon v-if="selectTitle === '回复我的'"
                  ><CaretBottom
                /></el-icon>
                <el-icon v-else><CaretRight /></el-icon>
                <span>回复我的</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        <div class="message-out">
          <div class="message-body-top">
            <span style="padding-left: 20px">{{ selectTitle }}</span>
            <el-button
              type="danger"
              style="margin-left: 650px"
              @click="deleteAll(actionValue)"
              >一键清空</el-button
            >
          </div>
          <div class="message-body-detail" v-if="selectTitle === '系统通知'">
            <div
              v-for="(message, index) in messages1"
              :key="message.id"
              class="message-item"
            >
              <div style="width: 100%; margin-top: 20px">
                <span class="message-title" @click="toAuthor(message)">{{
                  message.title
                }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div style="height: 8px; width: 8px"></div>
              <div style="width: 100%">
                <div class="message-detail">{{ message.detail }}</div>
              </div>
              <div style="width: 100%; margin-bottom: 10px; text-align: right">
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  class="deleteBtn"
                  @click="deleteOne(message)"
                />
              </div>
            </div>
          </div>
          <div class="message-body-detail" v-if="selectTitle === '回复我的'">
            <div
              v-for="(message, index) in messages2"
              :key="message.id"
              class="message-item"
            >
              <div style="width: 100%; margin-top: 20px">
                <span class="message-title" @click="toWork(message)">{{
                  message.title
                }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div style="height: 8px; width: 8px"></div>
              <div style="width: 100%">
                <div class="message-detail">{{ message.detail }}</div>
              </div>
              <div style="width: 100%; margin-bottom: 10px; text-align: right">
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  class="deleteBtn"
                  @click="deleteOne(message)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Delete } from "@element-plus/icons-vue";
import { ref, watch, computed, onMounted } from "vue";
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import topBar from "@/components/topBar.vue";
import router from "@/router/index";
import { ElLoading } from "element-plus";
import {
  getMessage,
  deleteMessage,
  deleteAllMessages,
} from "@/apis/message.js";
import { useRoute } from "vue-router";
import {
  ElDialog,
  ElTag,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import { getUserId } from "@/http/cookie";
const route = useRoute();

defineComponent({
  components: {
    ElDialog,
    ElTag,
    ElInput,
    ElButton,
  },
});

let selectTitle = ref("系统通知");
const actionValue = computed(() => (selectTitle.value === "系统通知" ? 0 : 1));
// console.log("actionValue: ", actionValue.value);
// 定义响应式数据
const messages1 = ref([]);
const messages2 = ref([]);

const toAuthor = (message) => {
  //   console.log(message.author_id);
  if (message.author_id != null) {
    router.push(`/scholar/${message.author_id}`);
  }
};

const toWork = (message) => {
  //   console.log(message.work_id);
  if (message.work_id != null) {
    router.push(`/article/${message.work_id}`);
  }
};

const deleteOne = (message) => {
  ElMessageBox.confirm("确定要删除这条消息吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteMessage(message.id).then((res) => {
        if (res.code === 200) {
          // 删除成功
          console.log("delete success");
          getMessages();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        } else {
          // 删除失败
          console.log("delete fail");
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const deleteAll = (value) => {
  const id = Number(route.params.id);
  // console.log("deleteAll");
  ElMessageBox.confirm("确定要清空所有消息记录吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteAllMessages(id, value).then((res) => {
        console.log(res);
        if (res.code === 200) {
          // 删除成功
          console.log("delete all success");
          getMessages();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        } else {
          // 删除失败
          console.log("delete all fail");
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const getMessages = async () => {
  const id = Number(route.params.id);
  // console.log(id);
  messages1.value = [];
  messages2.value = [];
  const response = await getMessage(id);
  console.log(response);
  if (response.code === 200) {
    if (response.data.length === 0) {
      // 消息为空
    } else {
      for (let i = 0; i < response.data.length; i++) {
        const data = response.data[i];
        if (data.type === 0) {
          // 系统通知
          messages1.value.push({
            id: data.id,
            title: data.title,
            detail: data.content,
            author_id: data.idSend,
            time: data.time,
          });
        } else {
          // 对论文的评论
          messages2.value.push({
            id: data.id,
            title: data.title,
            detail: data.content,
            work_id: data.idSend,
            time: data.time,
          });
        }
      }
    }
  } else {
    await router.push("/error");
  }
};

onMounted(async () => {
  getMessages();
});
</script>

<style scoped>
.message-body {
  background-color: rgb(244, 245, 247);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* overflow-y: scroll; */
}

.message-topBar {
  height: 60px;
}

.background {
  width: 100%;
  height: calc(100vh - 100px);
  display: grid;
  grid-template-columns: 1fr; /* 单列布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.contain {
  padding: 20px 20px 20px 300px;
  display: flex;
  justify-content: center;
  height: calc(100vh - 100px);
}

.message-out {
  width: 100%;
  margin: 0 300px 0 30px;
  height: calc(100vh - 100px);
}

.message-body-top {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 水平靠左 */
  font-weight: bold; /* 文字加粗 */
  font-size: 20px;
}

.message-body-detail {
  width: 100%;
  height: calc(100vh - 170px);
  /* background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
  border-radius: 2px;
  overflow-y: auto;
  display: inline-block;
}

.message-title {
  font-size: 16px;
  font-weight: 700;
  padding: 15px 25px 15px 25px;
}

.message-title:hover {
  color: rgb(131, 187, 247);
  cursor: pointer;
}

.message-time {
  font-size: 14px;
  font-weight: 500;
  color: #777777;
}

.message-detail {
  font-size: 14px;
  font-weight: 500;
  color: #393939;
  padding: 15px 30px 15px 35px;
  line-height: 1.8;
  white-space: inherit;
}

.message-item {
  width: 100%;
  line-height: 1.5;
  flex-direction: column;
  margin-bottom: 10px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  display: flex;
}

.menu {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 100px);
}

.deleteBtn {
  margin-right: 20px;
}
</style>
