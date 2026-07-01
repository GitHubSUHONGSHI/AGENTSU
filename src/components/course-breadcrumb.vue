<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { courseModules } from "../data/python-course";

const route = useRoute();

const routeParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const isCourseHomeRoute = computed(() => route.name === "course-home");
const isGlossaryRoute = computed(() => route.name === "glossary");
const isInterviewRoute = computed(() => route.name === "interview");
const isKnowledgeRoute = computed(() => route.name === "knowledge");
const isPracticeRoute = computed(() => String(route.name ?? "").startsWith("practice"));
const moduleId = computed(() => routeParam(route.params.moduleId));
const sectionId = computed(() => routeParam(route.params.sectionId));
const topicId = computed(() => routeParam(route.params.topicId));
const currentModule = computed(() =>
  courseModules.find((module) => module.id === moduleId.value),
);
const currentSection = computed(() =>
  currentModule.value?.sections.find((section) => section.id === sectionId.value),
);
const currentTopic = computed(() =>
  currentSection.value?.topics.find((topic) => topic.id === topicId.value),
);
const moduleTitle = computed(() => currentModule.value?.title ?? "未知模块");
const sectionTitle = computed(() => currentSection.value?.title ?? "未知章节");
const topicTitle = computed(() => currentTopic.value?.title ?? "未知知识点");
const modulePath = computed(() => `/modules/${moduleId.value ?? "m01"}`);
const sectionPath = computed(() => `${modulePath.value}/sections/${sectionId.value ?? ""}`);
</script>

<template>
  <nav class="course-breadcrumb" aria-label="当前位置">
    <el-breadcrumb :separator="isCourseHomeRoute ? '' : '/'">
      <template v-if="isCourseHomeRoute">
        <el-breadcrumb-item>课程首页</el-breadcrumb-item>
      </template>

      <template v-else-if="isKnowledgeRoute">
        <el-breadcrumb-item>知识章节</el-breadcrumb-item>
      </template>

      <template v-else-if="isGlossaryRoute">
        <el-breadcrumb-item>语法词典</el-breadcrumb-item>
      </template>

      <template v-else-if="isInterviewRoute">
        <el-breadcrumb-item>面试八股</el-breadcrumb-item>
      </template>

      <template v-else-if="isPracticeRoute">
        <el-breadcrumb-item :to="{ path: '/practice' }">练习题</el-breadcrumb-item>
        <el-breadcrumb-item v-if="moduleId">{{ moduleTitle }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="sectionId">{{ sectionTitle }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="topicId">{{ topicTitle }}</el-breadcrumb-item>
      </template>

      <template v-else-if="!isCourseHomeRoute">
        <el-breadcrumb-item :to="{ path: '/knowledge' }">知识章节</el-breadcrumb-item>
        <el-breadcrumb-item v-if="sectionId" :to="{ path: modulePath }">
          {{ moduleTitle }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else>{{ moduleTitle }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="sectionId && topicId" :to="{ path: sectionPath }">
          {{ sectionTitle }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="sectionId">{{ sectionTitle }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="topicId">{{ topicTitle }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </nav>
</template>
