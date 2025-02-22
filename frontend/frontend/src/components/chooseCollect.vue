<template>
    <el-dialog v-model="isVisible" title="收藏" @close="closeDialog">
    <div class="tags">
      <el-tag v-for="tag in tags" :key="tag" closable @close="removeTag(tag)">{{ tag }}</el-tag>
      <el-input
        v-model="newTag"
        placeholder="+ New Tag"
        size="small"
        @keyup.enter="addTag"
        class="new-tag-input"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmDialog">确定</el-button>
    </span>
  </el-dialog>

  <el-button @click="showDialog">打开弹窗</el-button>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { ElDialog, ElTag, ElInput, ElButton } from 'element-plus';

defineComponent({
    components: {
        ElDialog, 
        ElTag, 
        ElInput, 
        ElButton
    }
});

const isVisible = ref(false); // Controls the visibility of the popup
    const tags = ref(['默认', 'Python', 'Pytorch']); // Predefined tags
    const newTag = ref(''); // New tag input

    const addTag = () => {
      const trimmedTag = newTag.value.trim();
      if (trimmedTag && !tags.value.includes(trimmedTag)) {
        tags.value.push(trimmedTag);
      }
      newTag.value = '';
    };

    const removeTag = (tag: string) => {
      tags.value = tags.value.filter(t => t !== tag);
    };

    const showDialog = () => {
      isVisible.value = true;
    };

    const closeDialog = () => {
      isVisible.value = false;
    };

    const confirmDialog = () => {
      closeDialog();
    };
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.new-tag-input {
  flex: 1;
  max-width: 200px;
}
</style>