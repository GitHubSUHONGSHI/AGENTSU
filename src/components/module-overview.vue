<script setup lang="ts">
import { computed } from "vue";
import { Check, Clock, Collection, Reading } from "@element-plus/icons-vue";
import type { CourseModule, Difficulty } from "../types/course";

const props = defineProps<{
  module: CourseModule;
  isCompleted: boolean;
}>();

const emit = defineEmits<{
  toggleCompleted: [moduleId: string];
}>();

const difficultyMap: Record<Difficulty, { label: string; type: "success" | "warning" | "danger" }> = {
  beginner: { label: "入门", type: "success" },
  intermediate: { label: "进阶", type: "warning" },
  advanced: { label: "高级", type: "danger" },
};

const topicCount = computed(() =>
  props.module.sections.reduce((total, section) => total + section.topics.length, 0),
);
</script>

<template>
  <el-card class="module-overview" shadow="never">
    <div class="module-overview__content">
      <div>
        <p class="module-overview__eyebrow">当前模块</p>
        <h2>{{ module.title }}</h2>
        <p class="module-overview__summary">{{ module.summary }}</p>
        <div class="module-overview__tags">
          <el-tag :type="difficultyMap[module.difficulty].type" effect="light">
            {{ difficultyMap[module.difficulty].label }}
          </el-tag>
          <el-tag effect="plain">
            <el-icon><Clock /></el-icon>
            {{ module.estimatedMinutes }} 分钟
          </el-tag>
          <el-tag effect="plain">
            <el-icon><Collection /></el-icon>
            {{ module.sections.length }} 个章节
          </el-tag>
          <el-tag effect="plain">
            <el-icon><Reading /></el-icon>
            {{ topicCount }} 个知识点
          </el-tag>
        </div>
      </div>

      <el-button
        class="module-overview__action"
        :type="isCompleted ? 'success' : 'primary'"
        :icon="Check"
        @click="emit('toggleCompleted', module.id)"
      >
        {{ isCompleted ? "已完成" : "标记完成" }}
      </el-button>
    </div>
  </el-card>
</template>
