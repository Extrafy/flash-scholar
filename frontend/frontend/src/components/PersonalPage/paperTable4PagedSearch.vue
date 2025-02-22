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
          <span v-if="scope.row._source.title != null" class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row._id)">
            {{ scope.row._source.title }}
          </span>
            <span v-else class="ellipsis" style="font-size: 18px;
                       color: #1791b4;
                       line-height: 2.0;
                       cursor: pointer;" @click="jumpToPaper(scope.row._id)">
            暂无标题
          </span>

            <br/>
            <span class="ellipsis" style="font-size: 14px;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row._source.authorDTOS.map(authorship => authorship.authorName).join(', ') }}
          </span>
            <br/>
            <span style="font-size: 12px;
                       color: #181818;
                       line-height: 1.0;
                       font-weight: lighter">
            {{ scope.row._source.sources.map(locate => locate.name).join(', ') }}
          </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="80" label="日期" sortable>
        <template #default="scope">
          {{ scope.row._source.publishTime.split('-')[0] }}
        </template>
      </el-table-column>

      <el-table-column width="120" label="引用次数" sortable>
        <template #default="scope">
          {{ scope.row._source.cited }}
        </template>
      </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[5, 10, 20, 50]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout=" prev, pager, next, ->, jumper, sizes, total"
          :total="total_length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
  </div>
  </div>

</template>

<script setup lang="ts">
import {searchWorksByConcepts} from "@/apis/search";

const props = defineProps({
  conceptId: String,
})

import {useRouter} from "vue-router";

const route = useRouter();

function jumpToPaper(id) {
  route.push(`/article/${id}`).then(() => {
    window.location.reload();
  });
}

import type {ComponentSize} from 'element-plus'

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const size = ref<ComponentSize>('default')
const disabled = ref(false)
let total_length = ref(0);
const tableData = ref([]);

let c_id = props.conceptId;
getWorks();

async function getWorks(){
  let response = await searchWorksByConcepts(c_id, (currentPage4.value-1)*pageSize4.value, pageSize4.value);
  tableData.value = response.hits.hits;
  console.log(tableData.value);
  total_length = response.hits.total.value;
}

const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  getWorks();
}
const handleCurrentChange = (val: number) => {
  currentPage4.value = val;
  getWorks();
}
const background = ref(false)

import {ref} from 'vue'
import type {TableInstance} from 'element-plus'

const tableRef = ref<TableInstance>()
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