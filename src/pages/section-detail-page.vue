<script setup lang="ts">
import { computed, inject } from "vue";
import { ArrowLeft, Check, Document, Reading } from "@element-plus/icons-vue";
import { courseProgressKey } from "../symbols/course-progress";
import { useCourseRoute } from "../composables/use-course-route";

const { module, section } = useCourseRoute();
const progress = inject(courseProgressKey);

const completed = computed(() => (module.value ? progress?.isCompleted(module.value.id) ?? false : false));
const topicCount = computed(() => section.value?.topics.length ?? 0);
const toggleCompleted = () => {
  if (module.value) {
    progress?.toggleCompleted(module.value.id);
  }
};
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
          正文详情可读
        </el-tag>
      </div>
    </el-card>

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
        </router-link>
      </div>
    </section>
  </main>
  <el-empty v-else description="未找到章节内容" />
</template>
