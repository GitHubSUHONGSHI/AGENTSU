<script setup lang="ts">
import { CircleCheck, Document, EditPen, Warning } from "@element-plus/icons-vue";
import type { CourseExerciseAnswer } from "../types/course";

defineProps<{
  answer: CourseExerciseAnswer;
}>();

const answerSections = [
  {
    key: "explanation",
    title: "参考答案",
    icon: EditPen,
  },
  {
    key: "example",
    title: "案例",
    icon: Document,
  },
  {
    key: "result",
    title: "结果",
    icon: CircleCheck,
  },
  {
    key: "counterExample",
    title: "反例案例",
    icon: Warning,
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
      <pre v-if="section.key === 'example'">{{ answer[section.key] }}</pre>
      <p v-else>{{ answer[section.key] }}</p>
    </section>

    <section class="practice-answer-panel__section">
      <h5>
        <el-icon><CircleCheck /></el-icon>
        注意事项
      </h5>
      <ul>
        <li v-for="note in answer.notes" :key="note">{{ note }}</li>
      </ul>
    </section>
  </div>
</template>
