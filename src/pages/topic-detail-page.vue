<script setup lang="ts">
import { computed, inject } from "vue";
import { ArrowLeft, Check, Document, Picture, Reading } from "@element-plus/icons-vue";
import CourseContent from "../components/course-content.vue";
import { useCourseRoute } from "../composables/use-course-route";
import { courseProgressKey } from "../symbols/course-progress";

const { module, section, topic } = useCourseRoute();
const progress = inject(courseProgressKey);

const completed = computed(() => (module.value ? progress?.isCompleted(module.value.id) ?? false : false));
const tableCount = computed(() =>
  topic.value?.contentBlocks.filter((block) => block.kind === "table").length ?? 0,
);
const imageCount = computed(() =>
  topic.value?.contentBlocks.filter((block) => block.kind === "image").length ?? 0,
);
const sectionPath = computed(() =>
  module.value && section.value ? `/modules/${module.value.id}/sections/${section.value.id}` : "/course",
);
const toggleCompleted = () => {
  if (module.value) {
    progress?.toggleCompleted(module.value.id);
  }
};
</script>

<template>
  <main v-if="module && section && topic" class="course-main topic-detail" id="main-content">
    <el-card class="section-detail__hero" shadow="never">
      <router-link class="section-detail__back" :to="sectionPath">
        <el-icon><ArrowLeft /></el-icon>
        返回章节
      </router-link>
      <div class="section-detail__title-row">
        <div>
          <p class="module-overview__eyebrow">{{ module.title }} / {{ section.title }}</p>
          <h2>{{ topic.title }}</h2>
          <p>{{ topic.summary }}</p>
        </div>
        <el-button :type="completed ? 'success' : 'primary'" :icon="Check" @click="toggleCompleted">
          {{ completed ? "模块已完成" : "标记模块完成" }}
        </el-button>
      </div>
      <div class="module-overview__tags">
        <el-tag effect="plain">
          <el-icon><Reading /></el-icon>
          {{ topic.contentBlocks.length }} 个内容块
        </el-tag>
        <el-tag effect="plain">
          <el-icon><Picture /></el-icon>
          {{ imageCount }} 张图片
        </el-tag>
        <el-tag effect="plain">
          <el-icon><Document /></el-icon>
          {{ tableCount }} 张表格
        </el-tag>
      </div>
    </el-card>

    <el-card class="topic-detail__content" shadow="never">
      <CourseContent :blocks="topic.contentBlocks" />
    </el-card>
  </main>
  <el-empty v-else description="未找到知识点内容" />
</template>
