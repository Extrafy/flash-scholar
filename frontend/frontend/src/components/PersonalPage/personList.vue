<template>
  <div class="scholars-list">
    <div v-for="(scholar, index) in showScholars" :key="index" class="scholar-card">
      <el-card class="no-border-card" shadow="hover" @click="jumpToScholar(scholar.id)">
        <div class="innerBox">
          <div class="avata">
            <el-avatar style="background-color: transparent" :size="45" fit="cover" :src="scholar_icon"
                       @error="errorHandler">
              <img :src="scholar_icon" alt="empty"/>
            </el-avatar>
          </div>

          <div class="brief-intro">
            <span style="line-height:1.5;font-weight: 800; font-size: 18px">{{ scholar.name }}</span>
            <br/>
            <div v-if="scholar.organizationName!=null">
              <span style="line-height:1.5;font-weight: 400; font-size: 12px; color: #777777">{{ scholar.organizationName.slice(0,30) }}</span>
              <span v-if="scholar.organizationName.length>30">...</span>
            </div>
              <span v-else style="line-height:2.0;font-weight: 400; font-size: 12px; color: #777777">暂无机构信息</span>
          </div>

          <div class="arrow-box">
            <img :src="rightarrow" alt="arrow" class="arrow"/>
          </div>
        </div>
      </el-card>
      <el-divider v-if="index < scholars.length - 1" style="width: 300px; margin: auto;"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import rightarrow from "@/assets/icon/PersonalPage/rightarrow.svg"
import scholar_icon from "@/assets/icon/PersonalPage/scholar.svg"
const errorHandler = () => true

import { ref} from 'vue'

const props = defineProps({
  scholars: Array,
})

import {useRouter} from "vue-router"

const route = useRouter();
function jumpToScholar(authorId: string) {
  route.push(`/scholar/${authorId}`).then(() => {
    window.location.reload();
  });
}
const showScholars = ref(props.scholars == null ? null : props.scholars.slice(0, 10));

</script>

<style scoped>
.arrow-box {
  display: flex;
}

.arrow {
  margin-left: -10px;
  width: 15px;
  filter: grayscale(100%);
  transition: transform 0.3s ease;
}

.scholar-card:hover .arrow {
  transform: scale(1.5); /* 悬停到卡片时放大箭头 */
  filter: grayscale(0%);
}

.no-border-card {
  border: none; /* 移除边框 */
  box-shadow: none; /* 移除阴影 */
  margin: auto;
  width: 360px;
  cursor: pointer;
}

.innerBox {
  display: grid;
  grid-template-columns: 2fr 9fr 1fr;
  gap: 25px;
  cursor: pointer;
}

.avata {
  margin: auto;
  grid-column: 1/2;
  cursor: pointer;
}

.brief-intro {
  grid-column: 2/3;
  cursor: pointer;
}
</style>