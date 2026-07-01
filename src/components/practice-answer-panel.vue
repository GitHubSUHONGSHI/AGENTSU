<script setup lang="ts">
import { Document, EditPen } from "@element-plus/icons-vue";
import MarkdownContent from "./markdown-content.vue";
import type { CourseExercise } from "../types/course";

defineProps<{
  exercise: CourseExercise;
}>();

const answerSections = [
  {
    key: "answerMarkdown",
    title: "参考答案",
    icon: EditPen,
  },
  {
    key: "analysisMarkdown",
    title: "答案分析",
    icon: Document,
  },
] as const;
</script>

<template>
  <div class="practice-answer-panel">
    <section
      v-for="section in answerSections"
      :key="section.key"
      class="practice-answer-panel__section"
    >
      <h5>
        <el-icon><component :is="section.icon" /></el-icon>
        {{ section.title }}
      </h5>
      <MarkdownContent :markdown="exercise[section.key]" />
    </section>
  </div>
</template>
