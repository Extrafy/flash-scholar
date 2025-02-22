<template>
  <div style="background-color: #f4f5f7; overflow: auto;">
    <topBar :opacity-value="1" style="width: 100%; height: 60px;"/>
    <div v-if="conceptInfo != null" class="personal-page">
      <header class="profile-header">
        <div class="header-content">
          <img :src="profilePicture"
               alt="Profile Picture"
               class="profile-picture"
          />

          <div class="profile-info">
            <h1>{{ conceptInfo.name }}</h1>

            <p><img :src="book"
                    style="width: 18px;
                          margin-right: 5px;
                          margin-bottom:-3px "
                    alt="book"/>
              <span v-if="conceptInfo.description != null">
                <span>简介：</span>
                <span>{{ conceptInfo.description }}</span>
              </span>
              <span v-else>暂无简介</span>
            </p>
          </div>
        </div>
      </header>

      <div class="grid-container">
        <div class="tab-pub">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="相关论文" name="first">
              <div class="scholar-grid">
                <paper-table4-paged-search :concept-id="conceptInfo.id"></paper-table4-paged-search>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>

        <div class="citation">
          <div class="inner-citation">
            <div style="margin: auto">
              <h2 style="margin: auto;margin-bottom:-10px;padding: 10px">被引次数</h2>
              <el-table fit v-if="citeData.length != 0" :data="citeData" style="width: 100%; display: flex;margin: auto; padding: 10px">
                <el-table-column fit type="index" :label-class-name="'custom-label'" label="" width="104">
                  <template #default="scope">
                    <div style="display: flex; align-items: center">
                      <span style="margin-left: 10px">{{ content[scope.$index] }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fit prop="all" label="所有年份" width="116" />
                <el-table-column fit prop="since2019" label="自 2019" width="116" />
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

          <div class="rel-scholars">
            <h2 style="margin: auto;padding: 20px">领域图解</h2>
            <img v-if="conceptInfo.image_url != null" :src="conceptInfo.image_url" style="width: 350px">
            <span v-else style="margin: auto;padding-left: 30px">暂无领域图解</span>
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
import TopBar from "@/components/topBar.vue";
import {onMounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {searchInstitutions, searchConceptById} from "@/apis/search";
import {initBarChart} from "@/stores/PersonalPage/bar_chart"
import {searchWorksByConcepts} from "@/apis/search"
import profilePicture from "@/assets/icon/concept.svg"
import chain from "@/assets/icon/institutionPage/chain.svg"
import book from "@/assets/icon/PersonalPage/book.svg"
import PersonCard from "@/components/PersonalPage/personCard.vue";
import PaperTable from "@/components/PersonalPage/paperTable.vue";
import PaperTable4PagedSearch from "@/components/PersonalPage/paperTable4PagedSearch.vue";
const route = useRoute();
const router = useRouter();
const citeData = ref([]);
const conceptInfo = ref(null);
const activeName = ref('first');
const scholars = ref(null);
const content = ['引用量']

onMounted(async () => {
  const rtnConceptInfo = await searchConceptById(String(route.params.id));
  if(rtnConceptInfo.hits.hits.length != 0){
    conceptInfo.value = rtnConceptInfo.hits.hits[0]._source;
    console.log(conceptInfo.value)
    const dataX = conceptInfo.value.counts_by_year.slice(0,7).reverse().map(counting => counting.year);
    const dataY = conceptInfo.value.counts_by_year.slice(0,7).reverse().map(counting => counting.count);
    if(dataX.length == 0){
      dataX.push(2018,2019,2020,2021,2022,2023,2024);
      dataY.push(0,0,0,0,0,0,0)
    }
    citeData.value.push(
        {
          all: Math.max(conceptInfo.value.cited_by_count,conceptInfo.value.counts_by_year.filter(citation => citation.year >= 2019).reduce((sum, citation) => sum + citation.count, 0)),
          since2019: conceptInfo.value.counts_by_year.filter(citation => citation.year >= 2019).reduce((sum, citation) => sum + citation.count, 0)
        }
    )
    // const rtnAuthors = await searchWorksByConcepts(String(route.params.id));
    // console.log("rtnAuthors:",rtnAuthors)
    // if(rtnAuthors.hits.hits.length != 0){
    //   scholars.value = [];
    //   for(let item of rtnAuthors.hits.hits){
    //     let i = {
    //       idTo: item._source.id,
    //       authorName: item._source.name,
    //       authorInst: item._source.organization_name,
    //     };
    //     scholars.value.push(i);
    //   }
    // }
    await initBarChart(dataX,dataY);
  }
})

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
  grid-template-columns: 1fr 8fr 1fr; /* 左侧三份宽度，右侧一份宽度 */
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
  grid-column: 1 / 3;
}


.citation {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 10px;
  grid-row: 1 / 2; /* 从第二行开始到最后一行 */
  grid-column: 3 / 4;
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

