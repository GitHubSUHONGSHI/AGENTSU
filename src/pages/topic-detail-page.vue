<script setup lang="ts">
import { computed, inject, watchEffect } from "vue";
import { ArrowLeft, Check, Collection, Document, Picture, Reading } from "@element-plus/icons-vue";
import CourseContent from "../components/course-content.vue";
import { useCourseRoute } from "../composables/use-course-route";
import { courseProgressKey } from "../symbols/course-progress";
import { useRecentLearning } from "../composables/use-recent-learning";
import { topicLearningPoints } from "../utils/course-learning-points";

const { module, section, topic } = useCourseRoute();
const progress = inject(courseProgressKey);
const { writeRecentLearning } = useRecentLearning();

const completed = computed(() => (module.value ? progress?.isCompleted(module.value.id) ?? false : false));
const learningPoints = computed(() => (topic.value ? topicLearningPoints(topic.value) : null));
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

watchEffect(() => {
  if (module.value && section.value && topic.value) {
    writeRecentLearning({
      moduleId: module.value.id,
      sectionId: section.value.id,
      topicId: topic.value.id,
      title: topic.value.title,
    });
  }
});
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

    <aside class="learning-taskbar" aria-label="当前知识点学习操作">
      <div class="learning-taskbar__content">
        <span>{{ learningPoints?.title }}</span>
        <ul>
          <li v-for="point in learningPoints?.points" :key="point">{{ point }}</li>
        </ul>
      </div>
      <div class="learning-taskbar__actions">
        <router-link :to="`/practice/modules/${module.id}/sections/${section.id}/topics/${topic.id}`">
          <el-button :icon="Collection">练习本知识点</el-button>
        </router-link>
        <el-button :type="completed ? 'success' : 'primary'" :icon="Check" @click="toggleCompleted">
          {{ completed ? "已完成" : "标记完成" }}
        </el-button>
      </div>
    </aside>

    <el-card class="topic-detail__content" shadow="never">
      <CourseContent :blocks="topic.contentBlocks" />
    </el-card>
  </main>
  <el-empty v-else description="未找到知识点内容" />
</template>
