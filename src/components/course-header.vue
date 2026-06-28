<script setup lang="ts">
import { computed, ref } from "vue";
import { Menu, Search } from "@element-plus/icons-vue";
import type { CourseSearchOption } from "../types/course";

interface HeaderSearchSuggestion {
  id: string;
  value: string;
  typeLabel: string;
  title: string;
  subtitle: string;
  isEmpty: boolean;
  option?: CourseSearchOption;
}

const props = defineProps<{
  keyword: string;
  completedCount: number;
  searchSummary: string;
  searchOptions: CourseSearchOption[];
  totalCount: number;
  progressPercent: number;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  openNavigation: [];
  selectSearchResult: [option: CourseSearchOption];
}>();

const searchValue = computed({
  get: () => props.keyword,
  set: (value: string) => emit("update:keyword", value),
});
const lastSearchText = ref("");

const searchTypeLabels: Record<CourseSearchOption["type"], string> = {
  module: "模块",
  section: "章节",
  topic: "知识点",
};

const querySearch = (query: string, callback: (items: HeaderSearchSuggestion[]) => void) => {
  lastSearchText.value = query;

  if (!query.trim()) {
    callback([]);
    return;
  }

  if (props.searchOptions.length === 0) {
    callback([
      {
        id: "empty",
        value: "未找到匹配内容",
        typeLabel: "无结果",
        title: "未找到匹配内容",
        subtitle: "换个关键词试试",
        isEmpty: true,
      },
    ]);
    return;
  }

  callback(
    props.searchOptions.map((option) => ({
      id: option.id,
      value: option.title,
      typeLabel: searchTypeLabels[option.type],
      title: option.title,
      subtitle: option.subtitle,
      isEmpty: false,
      option,
    })),
  );
};

const selectSuggestion = (suggestion: HeaderSearchSuggestion) => {
  if (suggestion.option) {
    emit("selectSearchResult", suggestion.option);
    return;
  }

  emit("update:keyword", lastSearchText.value);
};
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
      <div class="course-header__search-panel">
        <el-autocomplete
          v-model="searchValue"
          class="course-header__search"
          clearable
          value-key="value"
          placeholder="搜索模块、章节或知识点"
          :prefix-icon="Search"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          popper-class="course-search-popper"
          aria-label="搜索课程内容"
          @select="selectSuggestion"
        >
          <template #default="{ item }">
            <div
              class="course-search-option"
              :class="{ 'course-search-option--empty': item.isEmpty }"
            >
              <span class="course-search-option__type">{{ item.typeLabel }}</span>
              <span class="course-search-option__body">
                <strong>{{ item.title }}</strong>
                <small>{{ item.subtitle }}</small>
              </span>
            </div>
          </template>
        </el-autocomplete>
        <span class="course-header__search-summary" aria-live="polite">{{ searchSummary }}</span>
      </div>
      <div class="course-header__progress" aria-label="整体学习进度">
        <span>{{ completedCount }}/{{ totalCount }} 已完成</span>
        <el-progress :percentage="progressPercent" :stroke-width="10" color="#0d9488" />
      </div>
    </div>
  </header>
</template>
