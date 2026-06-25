<script setup lang="ts">
import { computed, inject } from "vue";
import {
  Aim,
  ArrowRight,
  Collection,
  DataAnalysis,
  Finished,
  Promotion,
  Reading,
  TrendCharts,
} from "@element-plus/icons-vue";
import { courseModules } from "../data/python-course";
import { courseProgressKey } from "../symbols/course-progress";
import type { Difficulty } from "../types/course";

type DifficultyMeta = {
  label: string;
  type: "success" | "warning" | "danger";
  className: string;
};

const progress = inject(courseProgressKey);

const difficultyMap: Record<Difficulty, DifficultyMeta> = {
  beginner: { label: "入门", type: "success", className: "is-beginner" },
  intermediate: { label: "进阶", type: "warning", className: "is-intermediate" },
  advanced: { label: "高级", type: "danger", className: "is-advanced" },
};

const abilityCards = [
  "环境搭建",
  "语法基础",
  "流程控制",
  "数据结构",
  "函数",
  "面向对象",
  "文件与异常",
  "常用模块",
];

const completedModuleIds = computed(() => progress?.completedModuleIds.value ?? []);
const completedCount = computed(() => completedModuleIds.value.length);
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
const nextModule = computed(
  () => courseModules.find((module) => !completedModuleIds.value.includes(module.id)) ?? courseModules[0],
);
const continuePath = computed(() => `/modules/${nextModule.value?.id ?? "overview"}`);
const isCompleted = (moduleId: string) => completedModuleIds.value.includes(moduleId);
</script>

<template>
  <main class="course-main home-page" id="main-content">
    <section class="home-hero">
      <div>
        <p class="home-page__eyebrow">Python Course Studio</p>
        <h2>Python 课程学习站</h2>
        <p>
          把课程文档拆解为清晰的知识地图、模块目录和学习进度，帮助初学者从环境搭建走到可独立编码。
        </p>
        <div class="home-hero__actions">
          <router-link class="home-link-button" to="/modules/overview">
            <el-button type="primary" :icon="Promotion">开始学习</el-button>
          </router-link>
          <router-link class="home-link-button" :to="continuePath">
            <el-button :icon="ArrowRight">继续学习</el-button>
          </router-link>
        </div>
      </div>
      <el-card class="home-hero__progress" shadow="never">
        <template #header>学习进度</template>
        <strong>{{ completedCount }}/{{ courseModules.length }}</strong>
        <el-progress
          :percentage="progress?.progressPercent.value ?? 0"
          :stroke-width="12"
          color="#0d9488"
        />
        <p>下一站：{{ nextModule?.title ?? "概述" }}</p>
      </el-card>
    </section>

    <section class="home-stats" aria-label="课程数据概览">
      <el-card shadow="never">
        <el-icon><Collection /></el-icon>
        <strong>{{ courseModules.length }}</strong>
        <span>知识模块</span>
      </el-card>
      <el-card shadow="never">
        <el-icon><Reading /></el-icon>
        <strong>{{ sectionCount }}</strong>
        <span>课程章节</span>
      </el-card>
      <el-card shadow="never">
        <el-icon><Aim /></el-icon>
        <strong>{{ topicCount }}</strong>
        <span>知识点</span>
      </el-card>
      <el-card shadow="never">
        <el-icon><Finished /></el-icon>
        <strong>{{ completedCount }}</strong>
        <span>已完成模块</span>
      </el-card>
    </section>

    <section class="home-section">
      <div class="home-section__heading">
        <el-icon><TrendCharts /></el-icon>
        <h3>可视化学习路径</h3>
      </div>
      <div class="home-path">
        <router-link
          v-for="(module, index) in courseModules"
          :key="module.id"
          :class="[
            'home-path__item',
            difficultyMap[module.difficulty].className,
            { 'is-completed': isCompleted(module.id) },
          ]"
          :to="`/modules/${module.id}`"
        >
          <span>{{ index + 1 }}</span>
          <strong>{{ module.title }}</strong>
          <el-tag :type="difficultyMap[module.difficulty].type" effect="plain">
            {{ difficultyMap[module.difficulty].label }}
          </el-tag>
        </router-link>
      </div>
    </section>

    <section class="home-section">
      <div class="home-section__heading">
        <el-icon><DataAnalysis /></el-icon>
        <h3>核心能力要点</h3>
      </div>
      <div class="home-abilities">
        <el-tag v-for="item in abilityCards" :key="item" effect="light">
          {{ item }}
        </el-tag>
      </div>
    </section>
  </main>
</template>
