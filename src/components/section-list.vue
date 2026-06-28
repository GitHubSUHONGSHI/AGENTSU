<script setup lang="ts">
import { computed } from "vue";
import { Document, Notebook, Picture, Pointer, Reading } from "@element-plus/icons-vue";
import type { CourseSection } from "../types/course";
import { sectionContentStats, sectionExcerpt } from "../utils/course-content-stats";

const props = defineProps<{
  moduleId: string;
  sections: CourseSection[];
  selectedSectionId?: string;
}>();

const sectionInsights = computed(() =>
  props.sections.map((section) => ({
    section,
    stats: sectionContentStats(section),
    excerpt: sectionExcerpt(section),
  })),
);
</script>

<template>
  <section class="section-list" aria-labelledby="section-list-title">
    <div class="section-list__heading">
      <el-icon><Notebook /></el-icon>
      <h2 id="section-list-title">章节与知识点</h2>
    </div>

    <div class="section-list__grid">
      <el-card
        v-for="item in sectionInsights"
        :id="item.section.id"
        :key="item.section.id"
        class="section-list__card"
        :class="{ 'section-list__card--active': item.section.id === selectedSectionId }"
        shadow="never"
      >
        <template #header>
          <div class="section-list__card-title">
            <span>{{ item.section.title }}</span>
            <el-tag size="small" effect="plain">{{ item.section.topics.length }} 项</el-tag>
          </div>
        </template>
        <p class="section-list__excerpt">{{ item.excerpt }}</p>
        <div class="section-list__meta">
          <el-tag size="small" effect="plain">
            <el-icon><Document /></el-icon>
            {{ item.stats.blocks }} 块
          </el-tag>
          <el-tag size="small" effect="plain">
            <el-icon><Reading /></el-icon>
            {{ item.stats.code }} 代码
          </el-tag>
          <el-tag size="small" effect="plain">
            <el-icon><Picture /></el-icon>
            {{ item.stats.images }} 图 / {{ item.stats.tables }} 表
          </el-tag>
        </div>
        <ul class="section-list__topics">
          <li v-for="topic in item.section.topics" :key="topic.id">
            <router-link
              class="section-list__topic-link"
              :to="`/modules/${moduleId}/sections/${item.section.id}/topics/${topic.id}`"
            >
              <el-icon><Pointer /></el-icon>
              <span>{{ topic.title }}</span>
            </router-link>
          </li>
        </ul>
      </el-card>
    </div>
  </section>
</template>
