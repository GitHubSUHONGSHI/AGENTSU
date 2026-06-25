<script setup lang="ts">
import { computed, inject } from "vue";
import { ArrowLeft, Check, Document, EditPen, Reading } from "@element-plus/icons-vue";
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
        返回模块概述
      </router-link>
      <div class="section-detail__title-row">
        <div>
          <p class="module-overview__eyebrow">{{ module.title }}</p>
          <h2>{{ section.title }}</h2>
          <p>这里是该知识章节的独立详情页，后续可扩展正文、代码示例和练习题。</p>
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
          详情内容预留
        </el-tag>
      </div>
    </el-card>

    <el-card class="section-detail__panel" shadow="never">
      <template #header>知识点</template>
      <ul class="section-list__topics">
        <li v-for="topic in section.topics" :key="topic.id">
          <el-icon><Reading /></el-icon>
          <span>{{ topic.title }}</span>
        </li>
      </ul>
    </el-card>

    <div class="section-detail__grid">
      <el-card shadow="never">
        <template #header><el-icon><Document /></el-icon> 正文内容</template>
        <p>后续可从 docx 结构化导入段落、图片说明和重点提示。</p>
      </el-card>
      <el-card shadow="never">
        <template #header><el-icon><EditPen /></el-icon> 代码与练习</template>
        <p>后续可扩展代码示例、复制按钮、练习题和答案解析。</p>
      </el-card>
    </div>
  </main>
  <el-empty v-else description="未找到章节内容" />
</template>
