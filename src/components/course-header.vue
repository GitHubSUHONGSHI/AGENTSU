<script setup lang="ts">
import { computed } from "vue";
import { Menu, Search } from "@element-plus/icons-vue";

const props = defineProps<{
  keyword: string;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  openNavigation: [];
}>();

const searchValue = computed({
  get: () => props.keyword,
  set: (value: string) => emit("update:keyword", value),
});
</script>

<template>
  <header class="course-header">
    <div class="course-header__title">
      <el-button
        class="course-header__menu"
        :icon="Menu"
        circle
        aria-label="打开课程目录"
        @click="emit('openNavigation')"
      />
      <div>
        <p class="course-header__eyebrow">Python Course Studio</p>
        <h1>Python 课程学习站</h1>
      </div>
    </div>

    <div class="course-header__tools">
      <el-input
        v-model="searchValue"
        class="course-header__search"
        clearable
        placeholder="搜索模块、章节或知识点"
        :prefix-icon="Search"
        aria-label="搜索课程内容"
      />
      <div class="course-header__progress" aria-label="整体学习进度">
        <span>{{ completedCount }}/{{ totalCount }} 已完成</span>
        <el-progress :percentage="progressPercent" :stroke-width="10" color="#0d9488" />
      </div>
    </div>
  </header>
</template>
