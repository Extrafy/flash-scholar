<template>
  <div class="org-ranking-container">

    <!-- 点击栏 -->
    <div class="ranking-toggle" @click="toggleSidebar" :class="{ rotated: isRotated }" v-if="!isVisible">
      <p :class="{ flipped: isRotated }">{{ toggleText }}</p>
    </div>

    <!-- 循环图标按钮 -->
      <el-tooltip
        :content="isRotated ? '切换到科研机构排行榜' : '切换到学术领域排行榜'"
        placement="left"
      >
        <div class="ranking-toggle-btn" @click="toggleRankType" v-if="!isVisible">
          <el-icon><Refresh /></el-icon>
        </div>
      </el-tooltip>

    <!-- 排行榜面板 -->
    <div class="org-ranking-panel" :class="{ active: isVisible }" ref="panelRef">
      <div class="org-ranking-header">
        <el-icon><Trophy /></el-icon>
        <span>{{ panelTitle }}</span>
      </div>
      <div class="org-ranking-table-header">
        <div class="org-ranking-index">序号</div>
        <div class="org-ranking-name">{{ rankingName }}</div>
        <div class="org-ranking-controls">
          <div class="custom-select" @click="toggleDropdown($event)">
            <div class="select-selected">{{ selectedLabel }}</div>
            <div v-if="dropdownVisible" class="select-options">
              <p @click="selectOption('worksCount', '成果个数', $event)">成果个数</p>
              <p @click="selectOption('citedByCount', '总引用量', $event)">总引用量</p>
            </div>
          </div>
        </div>
      </div>

      <transition name="slide">
        <div class="org-ranking-content" v-if="isVisible">
          <!-- 数据列表 -->
          <div class="org-ranking-list">
            <div v-for="(item, index) in sortedData" :key="item.id" class="org-ranking-item" @click="jumpTo(item.id)">
              <div class="org-ranking-index">{{ index + 1 }}</div>
                            
              <el-tooltip class="org-ranking-tooltip" effect="dark" :content="item.name" placement="top">
                <div class="org-ranking-name">{{ item.name.slice(0, 8) + '...' }}</div>
              </el-tooltip>
           
              <div class="org-ranking-score">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Trophy, Refresh } from '@element-plus/icons-vue'; // 使用 Refresh 图标
import { useRouter } from 'vue-router';
import { getCitedByCountRank, getWorksCountRank, getConceptCitedByCountRank, getConceptWorksCountRank } from '@/apis/rank.js';

const router = useRouter();
const isVisible = ref(false);
const isRotated = ref(false); // 判断是否旋转，控制点击栏翻转
const sortedData = ref([]);
const sortType = ref('worksCount');
const dropdownVisible = ref(false);
const selectedLabel = ref('成果个数');
const panelTitle = ref('科研机构成果排行榜');
const rankingName = ref('机构名称'); // 动态名称
const toggleText = ref('点击查看科研机构分类排名'); // 点击栏文字
const panelRef = ref(null);

const toggleSidebar = () => {
  isVisible.value = !isVisible.value;
};

const toggleRankType = () => {
  isRotated.value = !isRotated.value;
  if (isRotated.value) {
    panelTitle.value = '学术领域成果排行榜';
    rankingName.value = '领域名称';
    toggleText.value = '点击查看学术领域分类排名';
    fetchRankingData('concept');
  } else {
    panelTitle.value = '科研机构成果排行榜';
    rankingName.value = '机构名称';
    toggleText.value = '点击查看科研机构分类排名';
    fetchRankingData('institution');
  }
};

const jumpTo = (id) => {
  if (isRotated.value) {
    // 跳转到领域页面
    router.push(`/concept/${id}`).then(() => window.location.reload());
  } else {
    // 跳转到机构页面
    router.push(`/institution/${id}`).then(() => window.location.reload());
  }
};

const fetchRankingData = async (type = 'institution') => {
  const response =
    type === 'concept'
      ? (sortType.value === 'worksCount' ? await getConceptWorksCountRank() : await getConceptCitedByCountRank())
      : (sortType.value === 'worksCount' ? await getWorksCountRank() : await getCitedByCountRank());
  
  sortedData.value = response.data.content.map((item) => ({
    id: item.id,
    name: item.name,
    count: item[sortType.value]
  }));
};

const toggleDropdown = (event) => {
  event.stopPropagation();
  dropdownVisible.value = !dropdownVisible.value;
};

const selectOption = (type, label, event) => {
  event.stopPropagation();
  sortType.value = type;
  selectedLabel.value = label;
  dropdownVisible.value = false;
  fetchRankingData(isRotated.value ? 'concept' : 'institution');
};

const handleClickOutside = (event) => { 
  if (panelRef.value && !panelRef.value.contains(event.target) && 
  !event.target.closest('.ranking-toggle')) { 
    isVisible.value = false; 
  } 
};

onMounted(() => {
  fetchRankingData('institution');
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>



<style scoped>
.org-ranking-container {
  position: fixed;
  right: 0;
  top: 0;
  height: 100%; 
  width: 20%;
  min-width: 300px;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  justify-content: center; 
  z-index: 1000;
  pointer-events: none;
}

.ranking-toggle-btn {
  position: absolute;
  top: calc(50% + 120px); /* 使按钮位于点击栏下方 */
  right: 6px; /* 和点击栏对齐 */
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.7s ease;

}

.ranking-toggle-btn:hover {
  background-color: rgba(157, 157, 157, 0.872);
}

.ranking-toggle {
  position: absolute;
  top: 50%; 
  transform: translateY(-50%); 
  height: 24%; 
  min-height: 220px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  writing-mode: vertical-lr; 
  cursor: pointer;
  border-radius: 6px 0 0 6px;
  transition: all 0.7s ease;
  pointer-events: auto;
}

.ranking-toggle.rotated {
  transform: translateY(-50%) rotateY(180deg); 
  border-radius: 0 6px 6px 0; 
}

.ranking-toggle:hover{
  background-color: rgba(157, 157, 157, 0.872);
}
.ranking-toggle p {
  margin-top: 2%;
  margin-bottom: 2%;
  letter-spacing: 2px;
  font-size: 14px;
}

.ranking-toggle p.flipped {
  transform: rotateY(180deg); /* 文字翻转 */
}

.org-ranking-panel {
  width: 90%;
  height: 70%;
  margin-right: 10%;
  background: white; 
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  transform: translateX(111%);
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.org-ranking-panel.active {
  transform: translateX(0);
}

.org-ranking-content {
  flex: 1;
  margin-top: 5%;
  padding-left: 4%;
  padding-right: 4%;
  height: 75%; 
  overflow-y: auto;
  box-sizing: border-box; 
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.org-ranking-header {
  padding: 5%;
  background-color: rgba(97, 192, 255, 0.9);
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 2%; 
  border-radius: 6px; 
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
}

.org-ranking-table-header {
  display: flex;
  align-items: center;
  padding-left: 4%;
  padding-right: 4%;
  font-weight: bold;
  margin-top: 2%;
}

.custom-select {
  position: relative;
  user-select: none;
}

.select-selected {
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  cursor: pointer;
}

.select-options {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  width: 100%;
  z-index: 10;
  left: 0;
  top: 100%;
  text-align: center;
}

.select-options p {
  cursor: pointer;
}

.select-options p:hover {
  background-color: #f1f1f1;
}

.org-ranking-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.org-ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(240, 250, 255, 0.8);
  margin-bottom: 4%;
  padding: 2% 2%;

  border-radius: 5px; 
  transition: background-color 0.3s ease; 
  cursor: pointer;
}

.org-ranking-item:hover {
  background-color: rgba(255, 111, 97, 0.1);
}


.org-ranking-name {
  flex: 1;
  text-align: center;
}

.org-ranking-score {
  font-weight: bold;
  color: #606266;
}


</style>
