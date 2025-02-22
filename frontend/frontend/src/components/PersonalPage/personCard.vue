<template>
  <div class="scholar-card">
    <el-card class="no-border-card" shadow="hover" @click="jumpToScholar(props.scholar.idTo)">
      <div class="innerBox">
        <div class="avata">
          <el-avatar style="background-color: transparent" :size="40" fit="cover" :src="scholar_icon"
                     @error="errorHandler">
            <img :src="scholar_icon" alt="empty"/>
          </el-avatar>
        </div>

        <div class="brief-intro">
          <span style="font-weight: 800; font-size: 16px">{{ props.scholar.authorName}}</span>
          <br/>
          <span v-if="props.scholar.authorInst != 'null'" style="font-weight: 400; font-size: 12px; color: #777777">
            {{ props.scholar.authorInst }}
          </span>
          <span v-else style="font-weight: 400; font-size: 12px; color: #777777">
            暂无机构信息
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import scholar_icon from "@/assets/icon/PersonalPage/scholar.svg"

const errorHandler = () => true

import {useRouter} from "vue-router";
const router = useRouter();
function jumpToScholar(authorId: string) {
  router.push(`/scholar/${authorId}`).then(()=>{
    window.location.reload();
  })
}
const props = defineProps({
  scholar : {
    name : String,
    position : String,
    institution : String,
  },
})

</script>

<style scoped>
.no-border-card {
  margin: auto;
  width: 280px;
  cursor: pointer;
}

.innerBox {
  display: grid;
  grid-template-columns: 2fr 10fr;
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