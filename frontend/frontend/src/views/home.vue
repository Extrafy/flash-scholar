<template>
  <div class="container" ref="container">
    <topBar :opacity-value="1 - bgOpacity" style="width: 100%; height: 60px;" />
    <div class="main" :style="{ opacity: bgOpacity }">
      <div class="title">
        <span>F</span>
        <span>l</span>
        <span>a</span>
        <span>s</span>
        <span>h</span>
        <span>S</span>
        <span>c</span>
        <span>h</span>
        <span>o</span>
        <span>l</span>
        <span>a</span>
        <span>r</span>
      </div>
      <el-autocomplete ref="autocompleteRef" style="position:relative; 
                       width: 600px; 
                       top: 300px; 
                       left: calc(50% - (min(60%, 600px) + 60px)/ 2);
                       height: 50px;" input-style="height:40px;
                     font-size:20px" :popper-options="{
                      modifiers: [
                        {
                          name: 'computeStyles',
                          options: {
                            gpuAcceleration: false,
                            adaptive: false
                          }
                        }
                      ]
                    }" 
                     :fit-input-width="true"
                    v-model="state" :fetch-suggestions="querySearchAsync" placeholder="" @select="handleSelect"
        @keydown.enter="goSearch()" />
      <el-button type="primary" style="position: relative; 
                        width:60px; 
                        top: 300px; 
                        left: calc(50% - (min(60%, 600px) + 60px)/ 2);
                        height: 43px;" @click="goSearch()">
        <el-icon class="el-icon--search" style="font-size: 20px;">
          <Search />
        </el-icon>
      </el-button>
      <div class="intro">
        <div class="intro-block">
          <div class="out-block">
            <div class="intro-author"></div>
          </div>
          <div class="intro-text">Authors</div>
          <div class="intro-text">{{ authorNum.toLocaleString() }}</div>
        </div>
        <div class="intro-block">
          <div class="out-block">
            <div class="intro-work"></div>
          </div>
          <div class="intro-text">Works</div>
          <div class="intro-text">{{ workNum.toLocaleString() }}</div>
        </div>
        <div class="intro-block">
          <div class="out-block">
            <div class="intro-inst"></div>
          </div>
          <div class="intro-text">Institutions</div>
          <div class="intro-text">{{ instNum.toLocaleString() }}</div>
        </div>
        <div class="intro-block">
          <div class="out-block">
            <div class="intro-concept"></div>
          </div>
          <div class="intro-text">Topics</div>
          <div class="intro-text">{{ topicsNum.toLocaleString() }}</div>
        </div>
      </div>
    </div>
    <div class="recommend">
      <RecommandList />
    </div>
    <OrganizationRanking />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineComponent } from 'vue'
import RecommandList from '@/views/recommandList.vue';
import { useRouter } from 'vue-router';
import OrganizationRanking from '@/components/ranking.vue';
import { startAnimation } from '@/utils/animation'
import { getPlatformUsers, getPlatformScholars, getPlatformArticles, getPlatformInstitution, getPlatformConcept } from '@/apis/platFormData'
import topBar from "@/components/topBar.vue"
import { getRandomWork, searchWorksByTitle } from '@/apis/search';

defineComponent({
  components: {
    RecommandList,
    topBar
  }
});
const router = useRouter()
const state = ref('')
const autocompleteRef = ref(null)
const bgOpacity = ref(1)
const container = ref(null)

const authorNum = ref(0)
const workNum = ref(0)
const instNum = ref(0)
const topicsNum = ref(0)

onMounted(() => {
  const scholar = ref(0);
  const article = ref(0);
  const institution = ref(0);
  const concept = ref(0);
  getPlatformArticles().then(async res => {
    console.log(res);
    article.value = res.data;
    console.log(article.value);
    startAnimation(workNum, article.value);
  })
  getPlatformScholars().then(async res => {
    console.log(res);
    scholar.value = res.data;
    console.log(scholar.value);
    startAnimation(authorNum, scholar.value);
  })
  getPlatformConcept().then(async res => {
    console.log(res);
    concept.value = res.data;
    console.log(concept.value)
    startAnimation(topicsNum, concept.value)
  })
  getPlatformInstitution().then(async res => {
    console.log(res);
    institution.value = res.data;
    console.log(institution.value)
    startAnimation(instNum, institution.value);
  })

})

const handleScroll = () => {
  const scrollTop = container.value.scrollTop;
  const clientHeight = container.value.clientHeight;
  const scrollPercent = scrollTop / clientHeight;
  if (scrollPercent < 0.5) {
    bgOpacity.value = 1
  }
  else if (scrollPercent < 1) {
    bgOpacity.value = (1 - scrollPercent) * 10 / 5
  }
  else {
    bgOpacity.value = 0
  }
};

const goSearch = () => {
  router.push({ path: '/search', query: { str: state.value } }).then(() => {
    window.location.reload();
  });
  // window.open(`/search?str=${state.value}`)
}

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  links.value = await getLinks();
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value
  cb(results)
}

async function getLinks() {
  let works = [];
  let tmp;
  if (state.value.length == 0) {
    tmp = await getRandomWork();
  }
  else {
    tmp = await searchWorksByTitle(state.value);
  }
  for (let work of tmp.hits.hits) {
    works.push({
      value: work._source.title,
      link: ''
    })
  }
  return works;
}

const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}
onMounted(() => {
  links.value = loadAll();
  if (container.value) { container.value.addEventListener('scroll', handleScroll); }
});
</script>

<style scoped>
.el-scrollbar {
  width: 600px !important;
}

.container {
  background-color: rgb(244, 245, 247);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;
  /* IE/Edge 隐藏滚动条 */
}

.main {
  position: absolute;
  left: 0;
  width: 100%;
  height: max(100vh, 600px);
  top: 0;
  background: black url(../assets/image/home_bg.jpg) center bottom no-repeat;
  background-size: 100vw 100vh;
}

.intro {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-evenly;
}

.intro-text {
  width: 100%;
  text-align: center;
  font-size: 35px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  color: white;
}

.intro-block {
  text-align: center;
}

.out-block {
  width: 100%;
  display: flex;
  justify-content: center;
}

.intro-author {
  position: relative;
  height: 100px;
  width: 80px;
  background: url(../assets/icon/home/author.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.intro-work {
  position: relative;
  height: 100px;
  width: 84px;
  background: url(../assets/icon/home/work.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.intro-inst {
  height: 100px;
  width: 100px;
  background: url(../assets/icon/home/institution.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.intro-concept {
  position: relative;
  height: 100px;
  width: 100px;
  background: url(../assets/icon/home/concept.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.title {
  font-family: arial;
  font-size: calc(min(130px, 10vw));
  font-weight: bold;
  position: absolute;
  top: calc(min(100px, 25vh));
  width: fit-content;
  transform: translateX(-50%);
  left: 50%;
}

.title>span {
  color: #e5f0ff;
  ;
  font-family: arial;
  font-size: calc(min(130px, 10vw));
  font-weight: bold;
  animation: textColorChange 6s infinite alternate;
}

@keyframes textColorChange {
  0% {
    color: #ffffff;
  }

  25% {
    color: #d5e7ff;
  }

  50% {
    color: #aed1ff;
  }

  75% {
    color: #d5e7ff;
  }

  100% {
    color: #ffffff;
  }
}

.title>span:nth-child(1) {
  animation-delay: 0s;
}

.title>span:nth-child(2) {
  animation-delay: 0.5s;
}

.title>span:nth-child(3) {
  animation-delay: 1.0s;
}

.title>span:nth-child(4) {
  animation-delay: 1.5s;
}

.title>span:nth-child(5) {
  animation-delay: 2.0s;
}

.title>span:nth-child(6) {
  animation-delay: 2.5s;
}

.title>span:nth-child(7) {
  animation-delay: 3.0s;
}

.title>span:nth-child(8) {
  animation-delay: 3.5s;
}

.title>span:nth-child(9) {
  animation-delay: 4.0s;
}

.title>span:nth-child(10) {
  animation-delay: 4.5s;
}

.title>span:nth-child(11) {
  animation-delay: 5.0s;
}

.title>span:nth-child(12) {
  animation-delay: 5.5s;
}

.recommend {
  position: absolute;
  left: 0;
  width: 100%;
  height: max(100vh, 600px);
  top: max(100vh, 600px);
}
</style>
