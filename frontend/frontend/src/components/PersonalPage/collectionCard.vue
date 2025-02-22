<template>
  <div class="scholar-card">
    <el-card class="no-border-card" shadow="hover">
      <div class="innerBox">
        <img
            :src="folder"
            style="width: 80%"
        />
        <span style="line-height:1.5; font-weight: 400; font-size: 12px; color: #777777; place-self: center">{{ props.collection.fname }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import folder from "@/assets/icon/PersonalPage/folder.svg"

const errorHandler = () => true

import { ref} from 'vue'

const props = defineProps({
  collection: Object,
})

</script>

<style scoped>
.no-border-card {
  margin: auto;
  width: 155px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  height: 100%; /* 确保卡片高度占满父元素 */
}

.innerBox {
  display: flex;
  flex-direction: column; /* 垂直排列内容 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  cursor: pointer;
  height: 100%; /* 确保 innerBox 高度占满父元素 */
}

.innerBox img {
  width: 80%;
  margin-bottom: 10px; /* 可选：增加图片和文字之间的间距 */
}

.innerBox span {
  text-align: center; /* 确保文字水平居中 */
}
</style>