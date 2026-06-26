<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { courseModules } from "../data/python-course";

const route = useRoute();

const routeParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const isCourseHomeRoute = computed(() => route.name === "course-home");
const moduleId = computed(() => routeParam(route.params.moduleId));
const sectionId = computed(() => routeParam(route.params.sectionId));
const currentModule = computed(() =>
  courseModules.find((module) => module.id === moduleId.value),
);
const currentSection = computed(() =>
  currentModule.value?.sections.find((section) => section.id === sectionId.value),
);
const moduleTitle = computed(() => currentModule.value?.title ?? "未知模块");
const sectionTitle = computed(() => currentSection.value?.title ?? "未知章节");
const modulePath = computed(() => `/modules/${moduleId.value ?? "overview"}`);
</script>

<template>
  <nav class="course-breadcrumb" aria-label="当前位置">
    <el-breadcrumb :separator="isCourseHomeRoute ? '' : '/'">
      <el-breadcrumb-item v-if="isCourseHomeRoute">课程首页</el-breadcrumb-item>
      <el-breadcrumb-item v-else :to="{ path: '/course' }">课程首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="!isCourseHomeRoute && sectionId" :to="{ path: modulePath }">
        {{ moduleTitle }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else-if="!isCourseHomeRoute">
        {{ moduleTitle }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="!isCourseHomeRoute && sectionId">
        {{ sectionTitle }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </nav>
</template>
