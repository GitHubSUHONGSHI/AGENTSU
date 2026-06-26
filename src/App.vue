<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CourseBreadcrumb from "./components/course-breadcrumb.vue";
import CourseHeader from "./components/course-header.vue";
import CourseSidebar from "./components/course-sidebar.vue";
import { useCourseProgress } from "./composables/use-course-progress";
import { useCourseSearch } from "./composables/use-course-search";
import { courseModules } from "./data/python-course";
import { courseProgressKey } from "./symbols/course-progress";

const route = useRoute();
const searchKeyword = ref("");
const isMobileNavigationOpen = ref(false);

const { filteredModules } = useCourseSearch(courseModules, searchKeyword);
const progress = useCourseProgress(courseModules.length);

provide(courseProgressKey, progress);

const isPortalRoute = computed(() => route.name === "portal");
const isCourseHomeRoute = computed(() => route.name === "course-home");
const activeModuleId = computed(() =>
  isPortalRoute.value || isCourseHomeRoute.value
    ? ""
    : String(route.params.moduleId ?? courseModules[0]?.id ?? ""),
);
const activeSectionId = computed(() => {
  const value = route.params.sectionId;
  return value ? String(value) : undefined;
});

const closeNavigation = () => {
  isMobileNavigationOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    closeNavigation();
  },
);
</script>

<template>
  <router-view v-if="isPortalRoute" />
  <template v-else>
    <el-container class="app-shell">
      <el-aside class="app-shell__aside" width="320px">
        <CourseSidebar
          :modules="filteredModules"
          :selected-module-id="activeModuleId"
          :selected-section-id="activeSectionId"
          :completed-module-ids="progress.completedModuleIds.value"
          :is-home-active="isCourseHomeRoute"
          @navigate="closeNavigation"
        />
      </el-aside>

      <el-container class="app-shell__body">
        <el-header class="app-shell__header" height="auto">
          <div class="app-shell__content">
            <CourseHeader
              v-model:keyword="searchKeyword"
              :completed-count="progress.completedCount.value"
              :total-count="courseModules.length"
              :progress-percent="progress.progressPercent.value"
              @open-navigation="isMobileNavigationOpen = true"
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
          @navigate="closeNavigation"
        />
      </el-drawer>
    </el-container>
  </template>
</template>
