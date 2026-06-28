<script setup lang="ts">
import { computed, inject, watchEffect } from "vue";
import { ArrowLeft, Check, Collection, Document, Picture, Reading } from "@element-plus/icons-vue";
import { courseProgressKey } from "../symbols/course-progress";
import { useCourseRoute } from "../composables/use-course-route";
import { useRecentLearning } from "../composables/use-recent-learning";
import { sectionContentStats, topicContentStats, topicExcerpt } from "../utils/course-content-stats";

const { module, section } = useCourseRoute();
const progress = inject(courseProgressKey);
const { writeRecentLearning } = useRecentLearning();

const completed = computed(() => (module.value ? progress?.isCompleted(module.value.id) ?? false : false));
const topicCount = computed(() => section.value?.topics.length ?? 0);
const stats = computed(() => (section.value ? sectionContentStats(section.value) : null));
const firstTopicPath = computed(() =>
  module.value && section.value && section.value.topics[0]
    ? `/modules/${module.value.id}/sections/${section.value.id}/topics/${section.value.topics[0].id}`
    : "/course",
);
const toggleCompleted = () => {
  if (module.value) {
    progress?.toggleCompleted(module.value.id);
  }
};

watchEffect(() => {
  if (module.value && section.value) {
    writeRecentLearning({
      moduleId: module.value.id,
      sectionId: section.value.id,
      title: section.value.title,
    });
  }
});
</script>

<template>
  <main v-if="module && section" class="course-main section-detail" id="main-content">
    <el-card class="section-detail__hero" shadow="never">
      <router-link class="section-detail__back" :to="`/modules/${module.id}`">
        <el-icon><ArrowLeft /></el-icon>
        返回模块概览
      </router-link>
      <div class="section-detail__title-row">
        <div>
          <p class="module-overview__eyebrow">{{ module.title }}</p>
          <h2>{{ section.title }}</h2>
          <p>本章节包含 {{ topicCount }} 个知识点，点击标题进入完整正文、图片和表格详情页。</p>
        </div>
        <el-button :type="completed ? 'success' : 'primary'" :icon="Check" @click="toggleCompleted">
          {{ completed ? "模块已完成" : "标记模块完成" }}
        </el-button>
      </div>
      <div class="module-overview__tags">
        <el-tag effect="plain">
          <el-icon><Reading /></el-icon>
          {{ topicCount }} 个知识点
        </el-tag>
        <el-tag effect="plain">
          <el-icon><Document /></el-icon>
          {{ stats?.blocks ?? 0 }} 个正文块
        </el-tag>
        <el-tag effect="plain">
          <el-icon><Picture /></el-icon>
          {{ stats?.code ?? 0 }} 代码 / {{ stats?.images ?? 0 }} 图 / {{ stats?.tables ?? 0 }} 表
        </el-tag>
      </div>
    </el-card>

    <aside class="learning-taskbar" aria-label="本节学习操作">
      <div>
        <span>本节要点</span>
        <strong>{{ topicCount }} 个知识点，建议按顺序阅读后进入练习。</strong>
      </div>
      <div class="learning-taskbar__actions">
        <router-link :to="firstTopicPath">
          <el-button :icon="Reading">开始阅读</el-button>
        </router-link>
        <router-link to="/practice">
          <el-button :icon="Collection">进入练习</el-button>
        </router-link>
        <el-button :type="completed ? 'success' : 'primary'" :icon="Check" @click="toggleCompleted">
          {{ completed ? "已完成" : "标记完成" }}
        </el-button>
      </div>
    </aside>

    <section class="topic-cards" aria-labelledby="topic-cards-title">
      <div class="section-list__heading">
        <el-icon><Reading /></el-icon>
        <h2 id="topic-cards-title">知识点详情</h2>
      </div>
      <div class="topic-cards__grid">
        <router-link
          v-for="topic in section.topics"
          :key="topic.id"
          class="topic-cards__item"
          :to="`/modules/${module.id}/sections/${section.id}/topics/${topic.id}`"
        >
          <strong>{{ topic.title }}</strong>
          <span>{{ topic.summary }}</span>
          <small>{{ topicExcerpt(topic) }}</small>
          <div class="topic-cards__meta">
            <el-tag size="small" effect="plain">{{ topicContentStats(topic).blocks }} 块</el-tag>
            <el-tag size="small" effect="plain">{{ topicContentStats(topic).code }} 代码</el-tag>
            <el-tag size="small" effect="plain">
              {{ topicContentStats(topic).images }} 图 / {{ topicContentStats(topic).tables }} 表
            </el-tag>
          </div>
        </router-link>
      </div>
    </section>
  </main>
  <el-empty v-else description="未找到章节内容" />
</template>
