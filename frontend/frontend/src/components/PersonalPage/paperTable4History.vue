
<template>
  <div class="table-container">
  <el-table fit ref="tableRef" row-key="title" :data="tableData">
    <el-table-column
        prop="title"
        label="文献"
        width="500"
        sortable
        column-key="title"
    >
      <template #default="scope">
        <div>
          <span v-if="scope.row.title != null" class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 1.5;
                       cursor: pointer;" @click="jumpToPaper(scope.row.workId.split('/').pop())">
            {{ scope.row.title }}
          </span>
          <span v-else class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 1.5;
                       cursor: pointer;" @click="jumpToPaper(scope.row.workId.split('/').pop())">
            暂无标题
          </span>
          <br v-if="scope.row.name!=null && scope.row.name.length!=0&& scope.row.name!='null'"/>
          <span v-if="scope.row.name!=null && scope.row.name.length!=0&& scope.row.name!='null'" class="ellipsis" style="font-size: 14px;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.name }}
          </span>
          <br v-if="scope.row.publisher!=null && scope.row.publisher.length!=0"/>
          <span v-if="scope.row.publisher!=null && scope.row.publisher.length!=0" style="font-size: 12px;
                       color: #181818;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.publisher }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column width="80" label="日期" sortable>
      <template #default="scope">
        {{ scope.row.publishTime.split('-')[0] }}
      </template>
    </el-table-column>
    <el-table-column prop="count" width="120" label="引用次数" sortable/>
    <el-table-column prop="time" width="120" label="历史访问" sortable/>

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

const props = defineProps({
  pubs: Array,
})

import {useRouter} from "vue-router";

const route = useRouter();
function jumpToPaper(id){
  route.push(`/article/${id}`).then(()=>{
    window.location.reload();
  });
}
import type { ComponentSize } from 'element-plus'
const currentPage4 = ref(1)
const pageSize4 = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  let fromIdx = pageSize4.value * (currentPage4.value-1)
  let toIdx = pageSize4.value * currentPage4.value
  tableData.value = props.pubs.slice(fromIdx, toIdx)
  console.log(props.pubs)

  console.log(`${pageSize4.value} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  let fromIdx = pageSize4.value * (currentPage4.value-1)
  let toIdx = pageSize4.value * currentPage4.value
  tableData.value = props.pubs.slice(fromIdx, toIdx)
  console.log(`current page: ${currentPage4.value}`)
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
  max-width: 480px; /* 设置最大宽度 */
}

</style>