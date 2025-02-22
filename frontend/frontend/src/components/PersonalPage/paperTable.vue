
<template>
  <div class="table-container">
  <el-table fit ref="tableRef" row-key="title" :data="tableData">
    <el-table-column
        prop="title"
        label="文献"
        width="640"
        sortable
        column-key="title"
    >
      <template #default="scope">
        <div>
          <span v-if="scope.row.display_name != null" class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row.id.split('/').pop())">
            {{ scope.row.display_name }}
          </span>
          <span v-else class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row.id.split('/').pop())">
            暂无标题
          </span>

          <br />
          <span class="ellipsis" style="font-size: 14px;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.authorships.map(authorship => authorship.author.display_name).join(', ') }}
          </span>
          <br />
          <span style="font-size: 12px;
                       color: #181818;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row.locations.map(locate => (locate.source ? locate.source.display_name : '') ).join(', ') }}
          </span>
        </div>
      </template>
    </el-table-column>>
    <el-table-column prop="publication_year" width="80" label="日期" sortable/>
    <el-table-column prop="cited_by_count" width="120" label="引用次数" sortable/>
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
  max-width: 600px; /* 设置最大宽度 */
}

</style>