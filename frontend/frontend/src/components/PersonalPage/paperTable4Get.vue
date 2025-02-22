
<template>
  <div class="table-container">
  <el-table fit ref="tableRef" row-key="title" :data="tableData">
    <el-table-column
        prop="title"
        label="文献"
        width="550"
        sortable
        column-key="title"
    >
      <template #default="scope">
        <div>
          <span v-if="scope.row.title != null" class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row.achievementId)">
            {{ scope.row.title }}
          </span>
          <span v-else class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row.achievementId)">
            暂无标题
          </span>

          <br />
          <span class="ellipsis"
                v-if="scope.row.authors!=null && scope.row.authors.length!=0 && scope.row.authors !=', ' && scope.row.authors !='null'"
                style="font-size: 14px;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.authors }}
          </span>
          <br />
          <span style="font-size: 12px;
                       color: #181818;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.journal }}
          </span>
        </div>
      </template>
    </el-table-column>>
    <el-table-column prop="date" width="80" label="日期" sortable/>
    <el-table-column prop="quoteTime" width="110" label="引用次数" sortable/>
    <el-table-column width="100">
      <template #default="scope">
        <el-button size="small" @click="handleGet(scope.row)">
          认领
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="demo-pagination-block">
    <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[5, 10, 20, 50]"
        :size="size"
        :disabled="disabled"
        :background="background"
        layout=" prev, pager, next, ->, jumper, sizes, total"
        :total="pubs.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import {getUserId,getUserAuthorId} from '@/http/cookie'
import {changeWorkAuthor} from '@/apis/search'
function handleGet(row) {
  console.log("row",row)
  changeWorkAuthor(row.workId, props.author, getUserAuthorId()).then(()=>{
    ElMessage.success("认领成功！");
  });
}
const props = defineProps({
  pubs: Array,
  author: String,
})

import {useRouter} from "vue-router";

const route = useRouter();
function jumpToPaper(id){
  route.push(`/article/${id}`).then(()=>{
    window.location.reload();
  });
}

import {ComponentSize, ElMessage} from 'element-plus'
const currentPage4 = ref(1)
const pageSize4 = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  let fromIdx = pageSize4.value * (currentPage4.value-1)
  let toIdx = pageSize4.value * currentPage4.value
  tableData.value = props.pubs.slice(fromIdx, toIdx)
}
const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  let fromIdx = pageSize4.value * (currentPage4.value-1)
  let toIdx = pageSize4.value * currentPage4.value
  tableData.value = props.pubs.slice(fromIdx, toIdx)
}
const background = ref(false)

import { ref } from 'vue'
import type { TableInstance } from 'element-plus'
const tableRef = ref<TableInstance>()
const tableData = ref(props.pubs.slice(pageSize4.value * (currentPage4.value-1), pageSize4.value * currentPage4.value));
</script>


<style scoped>
.demo-pagination-block {
  margin-top: 20px;
}

.ellipsis {
  margin-bottom: -5px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 550px; /* 设置最大宽度 */
}

</style>