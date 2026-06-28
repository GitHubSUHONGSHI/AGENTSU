<script setup lang="ts">
import { computed } from "vue";
import { Check, Clock, Collection, Document, Picture, Reading } from "@element-plus/icons-vue";
import type { CourseModule, Difficulty } from "../types/course";
import { moduleContentStats, moduleTopicCount } from "../utils/course-content-stats";

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

const topicCount = computed(() => moduleTopicCount(props.module));
const stats = computed(() => moduleContentStats(props.module));
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
          <el-tag effect="plain">
            <el-icon><Document /></el-icon>
            {{ stats.blocks }} 个正文块
          </el-tag>
          <el-tag effect="plain">
            <el-icon><Picture /></el-icon>
            {{ stats.code }} 代码 / {{ stats.images }} 图 / {{ stats.tables }} 表
          </el-tag>
        </div>
        <dl class="module-overview__coverage" aria-label="模块内容覆盖">
          <div>
            <dt>阅读段落</dt>
            <dd>{{ stats.paragraphs }}</dd>
          </div>
          <div>
            <dt>小节标题</dt>
            <dd>{{ stats.headings }}</dd>
          </div>
          <div>
            <dt>代码示例</dt>
            <dd>{{ stats.code }}</dd>
          </div>
          <div>
            <dt>图表素材</dt>
            <dd>{{ stats.images + stats.tables }}</dd>
          </div>
        </dl>
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
