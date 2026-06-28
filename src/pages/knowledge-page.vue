<script setup lang="ts">
import { computed, inject } from "vue";
import { Check, Collection, DataAnalysis, Picture, Reading, Tickets } from "@element-plus/icons-vue";
import { courseModules } from "../data/python-course";
import { useRecentLearning } from "../composables/use-recent-learning";
import { courseProgressKey } from "../symbols/course-progress";
import type { CourseModule, Difficulty } from "../types/course";
import {
  moduleContentStats,
  moduleSectionInsights,
  moduleTopicCount,
  sectionCount as countSection,
} from "../utils/course-content-stats";

type DifficultyMeta = {
  label: string;
  type: "success" | "warning" | "danger";
};

const difficultyMap: Record<Difficulty, DifficultyMeta> = {
  beginner: { label: "入门", type: "success" },
  intermediate: { label: "进阶", type: "warning" },
  advanced: { label: "高级", type: "danger" },
};

const sectionCount = computed(() =>
  courseModules.reduce((total, module) => total + module.sections.length, 0),
);
const topicCount = computed(() =>
  courseModules.reduce(
    (total, module) =>
      total + module.sections.reduce((sum, section) => sum + section.topics.length, 0),
    0,
  ),
);
const contentStats = computed(() =>
  courseModules.reduce(
    (total, module) => {
      const stats = moduleContentStats(module);
      total.blocks += stats.blocks;
      total.code += stats.code;
      total.images += stats.images;
      total.tables += stats.tables;
      return total;
    },
    { blocks: 0, code: 0, images: 0, tables: 0 },
  ),
);
const progress = inject(courseProgressKey);
const { recentPath, recentTitle } = useRecentLearning();

const modulePreviewSections = (module: CourseModule) => moduleSectionInsights(module).slice(0, 3);
const isCompleted = (module: CourseModule) => progress?.isCompleted(module.id) ?? false;
</script>

<template>
  <main class="course-main knowledge-page" id="main-content">
    <section class="knowledge-page__hero">
      <p class="module-overview__eyebrow">Knowledge Chapters</p>
      <h2>知识章节</h2>
      <p>按一级模块浏览完整课程目录，并快速判断每个模块的正文、代码、图片和表格覆盖情况。</p>
      <div class="module-overview__tags">
        <el-tag effect="light">
          <el-icon><Collection /></el-icon>
          {{ courseModules.length }} 个模块
        </el-tag>
        <el-tag effect="light">
          <el-icon><Reading /></el-icon>
          {{ sectionCount }} 个章节
        </el-tag>
        <el-tag effect="light">
          <el-icon><Tickets /></el-icon>
          {{ topicCount }} 个知识点
        </el-tag>
        <el-tag effect="light">
          <el-icon><DataAnalysis /></el-icon>
          {{ contentStats.blocks }} 个正文块
        </el-tag>
        <el-tag effect="light">
          <el-icon><Picture /></el-icon>
          {{ contentStats.images }} 图 / {{ contentStats.tables }} 表
        </el-tag>
      </div>
      <router-link v-if="recentPath" class="knowledge-page__recent" :to="recentPath">
        继续学习：{{ recentTitle }}
      </router-link>
    </section>

    <section class="knowledge-page__grid" aria-label="知识章节列表">
      <router-link
        v-for="(module, index) in courseModules"
        :key="module.id"
        class="knowledge-page__module"
        :to="`/modules/${module.id}`"
      >
        <span class="knowledge-page__index">{{ index + 1 }}</span>
        <div>
          <div class="knowledge-page__module-title">
            <h3>{{ module.title }}</h3>
            <el-tag v-if="isCompleted(module)" type="success" effect="light">
              <el-icon><Check /></el-icon>
              已完成
            </el-tag>
          </div>
          <p>{{ module.summary }}</p>
          <div class="module-overview__tags">
            <el-tag :type="difficultyMap[module.difficulty].type" effect="plain">
              {{ difficultyMap[module.difficulty].label }}
            </el-tag>
            <el-tag effect="plain">{{ countSection(module) }} 个章节</el-tag>
            <el-tag effect="plain">{{ moduleTopicCount(module) }} 个知识点</el-tag>
            <el-tag effect="plain">{{ moduleContentStats(module).blocks }} 个正文块</el-tag>
            <el-tag effect="plain">
              {{ moduleContentStats(module).code }} 代码 / {{ moduleContentStats(module).images }} 图 /
              {{ moduleContentStats(module).tables }} 表
            </el-tag>
          </div>
          <div class="knowledge-page__sections" aria-label="章节预览">
            <span v-for="section in modulePreviewSections(module)" :key="section.id">
              {{ section.title }} · {{ section.topicCount }} 点
            </span>
          </div>
        </div>
      </router-link>
    </section>
  </main>
</template>
