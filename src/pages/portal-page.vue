<script setup lang="ts">
import { computed } from "vue";
import {
  ArrowRight,
  Collection,
  Connection,
  DocumentChecked,
  Link,
  Promotion,
  Reading,
  TrendCharts,
} from "@element-plus/icons-vue";
import ReleaseStatusPanel from "../components/release-status-panel.vue";
import { courseModules } from "../data/python-course";
import { personalSiteUrl, repositoryUrl } from "../data/release-history";
import { useCourseProgress } from "../composables/use-course-progress";
import { useRecentLearning } from "../composables/use-recent-learning";

const progress = useCourseProgress(courseModules.length);
const { recentPath, recentTitle } = useRecentLearning();

const completedCount = computed(() => progress.completedCount.value);
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
  () =>
    courseModules.find((module) => !progress.completedModuleIds.value.includes(module.id)) ??
    courseModules[0],
);
const continuePath = computed(() => recentPath.value || `/modules/${nextModule.value?.id ?? "m01"}`);
const continueLabel = computed(() => (recentPath.value ? recentTitle.value : nextModule.value?.title ?? "课程首页"));
</script>

<template>
  <main class="portal-page" id="main-content">
    <section class="portal-hero" aria-label="Python 课程学习站入口">
      <div class="portal-hero__content">
        <span class="portal-hero__eyebrow">Python Course Studio</span>
        <div class="portal-hero__title">
          <span class="portal-hero__mark">Py</span>
          <h1>Python 课程学习站</h1>
        </div>
        <p class="portal-hero__summary">
          面向 Python 初学者的课程工作台，把知识模块、章节、知识点、练习和本地学习进度整理成一条清晰的学习路径。
        </p>

        <div class="portal-hero__actions">
          <router-link class="portal-link-button" :to="continuePath">
            <el-button type="primary" size="large" :icon="Promotion">继续学习</el-button>
          </router-link>
          <router-link class="portal-link-button" to="/practice">
            <el-button size="large" text :icon="Reading">进入练习</el-button>
          </router-link>
          <router-link class="portal-link-button" to="/course">
            <el-button size="large" text>课程工作台</el-button>
          </router-link>
        </div>

        <div class="portal-hero__meta" aria-label="课程概览">
          <span><el-icon><Collection /></el-icon>{{ courseModules.length }} 个模块</span>
          <span><el-icon><DocumentChecked /></el-icon>{{ sectionCount }} 个章节</span>
          <span><el-icon><TrendCharts /></el-icon>{{ topicCount }} 个知识点</span>
        </div>
      </div>

      <aside class="portal-progress" aria-label="继续学习任务">
        <div class="portal-progress__header">
          <p>Next Step</p>
          <h2>{{ continueLabel }}</h2>
        </div>
        <el-progress
          type="dashboard"
          :percentage="progress.progressPercent.value"
          :stroke-width="12"
          color="#0d9488"
        />
        <div class="portal-progress__next">
          <span>整体进度</span>
          <strong>{{ completedCount }}/{{ courseModules.length }} 个模块已完成</strong>
        </div>
        <router-link class="portal-progress__link" :to="continuePath">
          打开当前学习任务
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </aside>
    </section>

    <section class="portal-grid" aria-label="学习入口面板">
      <router-link class="portal-card portal-card--primary" to="/course">
        <div class="portal-card__heading">
          <el-icon><Promotion /></el-icon>
          <div>
            <p>Course Workspace</p>
            <h2>课程工作台</h2>
          </div>
        </div>
        <span>查看完整课程路径、搜索知识点，并按模块记录学习进度。</span>
      </router-link>

      <router-link class="portal-card" to="/practice">
        <div class="portal-card__heading">
          <el-icon><Reading /></el-icon>
          <div>
            <p>Practice Studio</p>
            <h2>练习题</h2>
          </div>
        </div>
        <span>每次刷新 2 道复合编码题，先简单再难度，适合课后复盘。</span>
      </router-link>

      <ReleaseStatusPanel />

      <div class="portal-card portal-card--site">
        <div class="portal-card__heading">
          <el-icon><Connection /></el-icon>
          <div>
            <p>Project Links</p>
            <h2>站点链接</h2>
          </div>
        </div>
        <div class="portal-links">
          <a :href="personalSiteUrl" target="_blank" rel="noreferrer">GitHub Pages 站点</a>
          <a :href="repositoryUrl" target="_blank" rel="noreferrer">
            <el-icon><Link /></el-icon>
            GitHub 仓库
          </a>
          <router-link to="/course">进入课程首页</router-link>
        </div>
      </div>
    </section>
  </main>
</template>
