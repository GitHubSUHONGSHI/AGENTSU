<script setup lang="ts">
import CourseBreadcrumb from "../components/course-breadcrumb.vue";
import CourseHeader from "../components/course-header.vue";
import CourseSidebar from "../components/course-sidebar.vue";
import { useCourseLayout } from "../composables/use-course-layout";

const {
  activeModuleId,
  activeSectionId,
  closeNavigation,
  filteredModules,
  isCourseHomeRoute,
  isKnowledgeRoute,
  isMobileNavigationOpen,
  isPracticeRoute,
  openNavigation,
  progress,
  searchKeyword,
  totalModules,
} = useCourseLayout();
</script>

<template>
  <el-container class="app-shell">
    <el-aside class="app-shell__aside" width="320px">
      <CourseSidebar
        :modules="filteredModules"
        :selected-module-id="activeModuleId"
        :selected-section-id="activeSectionId"
        :completed-module-ids="progress.completedModuleIds.value"
        :is-home-active="isCourseHomeRoute"
        :is-knowledge-active="isKnowledgeRoute"
        :is-practice-active="isPracticeRoute"
        @navigate="closeNavigation"
      />
    </el-aside>

    <el-container class="app-shell__body">
      <el-header class="app-shell__header" height="auto">
        <div class="app-shell__content">
          <CourseHeader
            v-model:keyword="searchKeyword"
            :completed-count="progress.completedCount.value"
            :total-count="totalModules"
            :progress-percent="progress.progressPercent.value"
            @open-navigation="openNavigation"
          />
        </div>
      </el-header>

      <el-main class="app-shell__main">
        <CourseBreadcrumb />
        <router-view />
      </el-main>
    </el-container>

    <el-drawer
      v-model="isMobileNavigationOpen"
      title="课程目录"
      direction="ltr"
      size="86%"
      class="app-shell__drawer"
    >
      <CourseSidebar
        :modules="filteredModules"
        :selected-module-id="activeModuleId"
        :selected-section-id="activeSectionId"
        :completed-module-ids="progress.completedModuleIds.value"
        :is-home-active="isCourseHomeRoute"
        :is-knowledge-active="isKnowledgeRoute"
        :is-practice-active="isPracticeRoute"
        @navigate="closeNavigation"
      />
    </el-drawer>
  </el-container>
</template>
