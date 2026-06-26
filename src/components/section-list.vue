<script setup lang="ts">
import { Notebook, Pointer } from "@element-plus/icons-vue";
import type { CourseSection } from "../types/course";

defineProps<{
  moduleId: string;
  sections: CourseSection[];
  selectedSectionId?: string;
}>();
</script>

<template>
  <section class="section-list" aria-labelledby="section-list-title">
    <div class="section-list__heading">
      <el-icon><Notebook /></el-icon>
      <h2 id="section-list-title">章节与知识点</h2>
    </div>

    <div class="section-list__grid">
      <el-card
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="section-list__card"
        :class="{ 'section-list__card--active': section.id === selectedSectionId }"
        shadow="never"
      >
        <template #header>
          <div class="section-list__card-title">
            <span>{{ section.title }}</span>
            <el-tag size="small" effect="plain">{{ section.topics.length }} 项</el-tag>
          </div>
        </template>
        <ul class="section-list__topics">
          <li v-for="topic in section.topics" :key="topic.id">
            <router-link
              class="section-list__topic-link"
              :to="`/modules/${moduleId}/sections/${section.id}/topics/${topic.id}`"
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
