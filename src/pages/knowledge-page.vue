<script setup lang="ts">
import { computed } from "vue";
import { Collection, Reading, Tickets } from "@element-plus/icons-vue";
import { courseModules } from "../data/python-course";
import type { CourseModule, Difficulty } from "../types/course";

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

const moduleTopicCount = (module: CourseModule) =>
  module.sections.reduce((total, section) => total + section.topics.length, 0);
</script>

<template>
  <main class="course-main knowledge-page" id="main-content">
    <section class="knowledge-page__hero">
      <p class="module-overview__eyebrow">Knowledge Chapters</p>
      <h2>知识章节</h2>
      <p>按一级模块浏览完整课程目录，进入模块后可继续查看二级章节和三级知识点。</p>
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
      </div>
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
          <h3>{{ module.title }}</h3>
          <p>{{ module.summary }}</p>
          <div class="module-overview__tags">
            <el-tag :type="difficultyMap[module.difficulty].type" effect="plain">
              {{ difficultyMap[module.difficulty].label }}
            </el-tag>
            <el-tag effect="plain">{{ module.sections.length }} 个章节</el-tag>
            <el-tag effect="plain">{{ moduleTopicCount(module) }} 个知识点</el-tag>
          </div>
        </div>
      </router-link>
    </section>
  </main>
</template>
